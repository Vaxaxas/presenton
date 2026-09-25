#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Child, Command};
use std::sync::{Arc, Mutex};
use tauri::{Manager, WindowEvent};

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

#[cfg(target_os = "windows")]
const CREATE_NO_WINDOW: u32 = 0x08000000;

struct AppState {
    children: Arc<Mutex<Vec<Child>>>,
}

fn kill_child_process(child: &mut Child) {
    let pid = child.id();
    #[cfg(target_os = "windows")]
    {
        // Use taskkill with /T (tree kill) and /F (force) to ensure any worker processes are terminated
        let _ = Command::new("taskkill")
            .args(["/F", "/T", "/PID", &pid.to_string()])
            .creation_flags(CREATE_NO_WINDOW)
            .status();
    }
    #[cfg(not(target_os = "windows"))]
    {
        let _ = child.kill();
    }
}

fn find_file_in_candidates(candidates: &[PathBuf]) -> Option<PathBuf> {
    for path in candidates {
        if path.exists() {
            return Some(path.clone());
        }
    }
    None
}

fn resolve_app_data_dir() -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        if let Ok(appdata) = std::env::var("APPDATA") {
            let path = PathBuf::from(appdata).join("Presenton");
            let _ = fs::create_dir_all(&path);
            return path;
        }
    }
    if let Some(home) = dirs_fallback() {
        let path = home.join(".presenton");
        let _ = fs::create_dir_all(&path);
        return path;
    }
    let path = PathBuf::from("./app_data");
    let _ = fs::create_dir_all(&path);
    path
}

fn dirs_fallback() -> Option<PathBuf> {
    #[cfg(target_os = "windows")]
    {
        std::env::var("USERPROFILE").ok().map(PathBuf::from)
    }
    #[cfg(not(target_os = "windows"))]
    {
        std::env::var("HOME").ok().map(PathBuf::from)
    }
}

fn spawn_services(resource_dir: &Path, children: Arc<Mutex<Vec<Child>>>) {
    let app_data_dir = resolve_app_data_dir();
    let app_data_str = app_data_dir.to_string_lossy().to_string();

    // 1. Resolve FastAPI executable
    let fastapi_candidates = [
        resource_dir.join("resources").join("fastapi").join("fastapi.exe"),
        resource_dir.join("fastapi").join("fastapi.exe"),
        resource_dir.join("resources").join("fastapi").join("fastapi"),
        resource_dir.join("fastapi").join("fastapi"),
        PathBuf::from("../../electron/resources/fastapi/fastapi.exe"),
    ];

    // 2. Resolve Node executable
    let node_candidates = [
        resource_dir.join("resources").join("node").join("node.exe"),
        resource_dir.join("node").join("node.exe"),
        resource_dir.join("resources").join("node").join("node"),
        resource_dir.join("node").join("node"),
        PathBuf::from("node"),
    ];

    // 3. Resolve Templates directory
    let templates_candidates = [
        resource_dir.join("resources").join("templates"),
        resource_dir.join("templates"),
        PathBuf::from("../../templates"),
        PathBuf::from("templates"),
    ];

    // 4. Resolve Next.js standalone server
    let nextjs_script_candidates = [
        resource_dir.join("resources").join("nextjs").join("server.js"),
        resource_dir.join("resources").join("nextjs").join("servers").join("nextjs").join("server.js"),
        resource_dir.join("nextjs").join("server.js"),
        resource_dir.join("nextjs").join("servers").join("nextjs").join("server.js"),
        PathBuf::from("../../servers/nextjs/.next-build/standalone/server.js"),
        PathBuf::from("../../servers/nextjs/.next-build/standalone/servers/nextjs/server.js"),
    ];

    let templates_dir = find_file_in_candidates(&templates_candidates)
        .unwrap_or_else(|| resource_dir.join("resources").join("templates"));
    let templates_str = templates_dir.to_string_lossy().to_string();

    // Spawn FastAPI
    if let Some(fastapi_exe) = find_file_in_candidates(&fastapi_candidates) {
        let parent_dir = fastapi_exe.parent().unwrap_or(resource_dir);
        let mut cmd = Command::new(&fastapi_exe);
        cmd.args(["--port", "5001"])
            .current_dir(parent_dir)
            .env("PORT", "5001")
            .env("DISABLE_AUTH", "true")
            .env("APP_DATA_DIRECTORY", &app_data_str)
            .env("TEMPLATES_DIR", &templates_str);

        #[cfg(target_os = "windows")]
        cmd.creation_flags(CREATE_NO_WINDOW);

        if let Ok(child) = cmd.spawn() {
            println!("[Tauri] FastAPI spawned with PID: {}", child.id());
            if let Ok(mut lock) = children.lock() {
                lock.push(child);
            }
        } else {
            eprintln!("[Tauri] Failed to spawn FastAPI from {:?}", fastapi_exe);
        }
    } else {
        eprintln!("[Tauri] FastAPI binary not found among candidates.");
    }

    // Spawn Next.js Standalone
    if let Some(nextjs_script) = find_file_in_candidates(&nextjs_script_candidates) {
        let nextjs_cwd = nextjs_script.parent().unwrap_or(resource_dir);
        let node_exe = find_file_in_candidates(&node_candidates)
            .unwrap_or_else(|| PathBuf::from("node"));

        let mut cmd = Command::new(node_exe);
        cmd.arg(&nextjs_script)
            .current_dir(nextjs_cwd)
            .env("PORT", "3000")
            .env("HOSTNAME", "127.0.0.1")
            .env("FAST_API_INTERNAL_URL", "http://127.0.0.1:5001")
            .env("NEXT_PUBLIC_FAST_API", "http://127.0.0.1:5001")
            .env("APP_DATA_DIRECTORY", &app_data_str)
            .env("TEMPLATES_DIR", &templates_str);

        #[cfg(target_os = "windows")]
        cmd.creation_flags(CREATE_NO_WINDOW);

        if let Ok(child) = cmd.spawn() {
            println!("[Tauri] Next.js standalone spawned with PID: {}", child.id());
            if let Ok(mut lock) = children.lock() {
                lock.push(child);
            }
        } else {
            eprintln!("[Tauri] Failed to spawn Next.js from {:?}", nextjs_script);
        }
    } else {
        eprintln!("[Tauri] Next.js server script not found among candidates.");
    }
}

fn main() {
    let children: Arc<Mutex<Vec<Child>>> = Arc::new(Mutex::new(Vec::new()));
    let children_for_events = Arc::clone(&children);
    let children_for_setup = Arc::clone(&children);

    tauri::Builder::default()
        .manage(AppState { children })
        .setup(move |app| {
            let resource_dir = app
                .path()
                .resource_dir()
                .unwrap_or_else(|_| PathBuf::from("."));

            spawn_services(&resource_dir, children_for_setup);
            Ok(())
        })
        .on_window_event(move |_window, event| {
            if let WindowEvent::Destroyed = event {
                if let Ok(mut lock) = children_for_events.lock() {
                    for child in lock.iter_mut() {
                        kill_child_process(child);
                    }
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
