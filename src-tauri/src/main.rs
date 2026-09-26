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

#[cfg(unix)]
fn ensure_executable(path: &Path) {
    use std::os::unix::fs::PermissionsExt;
    if let Ok(metadata) = fs::metadata(path) {
        let mut perms = metadata.permissions();
        perms.set_mode(0o755);
        let _ = fs::set_permissions(path, perms);
    }
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
        let _ = Command::new("kill")
            .args(["-9", &pid.to_string()])
            .status();
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

fn log_to_file(app_data_dir: &Path, message: &str) {
    let log_file = app_data_dir.join("desktop.log");
    if let Ok(mut file) = fs::OpenOptions::new().create(true).append(true).open(log_file) {
        use std::io::Write;
        let _ = writeln!(file, "[{}] {}", std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map(|d| d.as_secs()).unwrap_or(0), message);
    }
}

fn get_candidate_roots(resource_dir: &Path) -> Vec<PathBuf> {
    let mut roots = Vec::new();
    roots.push(resource_dir.to_path_buf());
    roots.push(resource_dir.join("resources"));

    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            roots.push(exe_dir.to_path_buf());
            roots.push(exe_dir.join("resources"));
            if let Some(parent) = exe_dir.parent() {
                roots.push(parent.join("resources"));
            }
        }
    }

    #[cfg(target_os = "windows")]
    {
        if let Ok(localappdata) = std::env::var("LOCALAPPDATA") {
            roots.push(PathBuf::from(&localappdata).join("Presenton"));
            roots.push(PathBuf::from(&localappdata).join("Presenton").join("resources"));
            roots.push(PathBuf::from(&localappdata).join("Programs").join("Presenton"));
            roots.push(PathBuf::from(&localappdata).join("Programs").join("Presenton").join("resources"));
        }
        if let Ok(progfiles) = std::env::var("ProgramFiles") {
            roots.push(PathBuf::from(&progfiles).join("Presenton"));
            roots.push(PathBuf::from(&progfiles).join("Presenton").join("resources"));
        }
    }

    #[cfg(target_os = "macos")]
    {
        roots.push(PathBuf::from("/Applications/Presenton.app/Contents/Resources"));
        roots.push(PathBuf::from("/Applications/Presenton.app/Contents/Resources/resources"));
    }

    #[cfg(target_os = "linux")]
    {
        roots.push(PathBuf::from("/usr/lib/presenton/resources"));
        roots.push(PathBuf::from("/opt/Presenton/resources"));
    }

    roots
}

fn spawn_services(resource_dir: &Path, children: Arc<Mutex<Vec<Child>>>) {
    let app_data_dir = resolve_app_data_dir();
    let app_data_str = app_data_dir.to_string_lossy().to_string();
    log_to_file(&app_data_dir, &format!("Tauri starting. AppData dir: {}", app_data_str));
    log_to_file(&app_data_dir, &format!("Resource dir: {:?}", resource_dir));

    let roots = get_candidate_roots(resource_dir);

    // 1. Resolve FastAPI executable
    let mut fastapi_candidates = Vec::new();
    for root in &roots {
        fastapi_candidates.push(root.join("fastapi").join("fastapi.exe"));
        fastapi_candidates.push(root.join("resources").join("fastapi").join("fastapi.exe"));
        fastapi_candidates.push(root.join("fastapi").join("fastapi"));
        fastapi_candidates.push(root.join("resources").join("fastapi").join("fastapi"));
    }
    fastapi_candidates.push(PathBuf::from("../../electron/resources/fastapi/fastapi.exe"));

    // 2. Resolve Node executable
    let mut node_candidates = Vec::new();
    for root in &roots {
        node_candidates.push(root.join("node").join("node.exe"));
        node_candidates.push(root.join("resources").join("node").join("node.exe"));
        node_candidates.push(root.join("node").join("node"));
        node_candidates.push(root.join("resources").join("node").join("node"));
    }
    node_candidates.push(PathBuf::from("node"));

    // 3. Resolve Templates directory
    let mut templates_candidates = Vec::new();
    for root in &roots {
        templates_candidates.push(root.join("templates"));
        templates_candidates.push(root.join("resources").join("templates"));
    }
    templates_candidates.push(PathBuf::from("../../templates"));
    templates_candidates.push(PathBuf::from("templates"));

    // 4. Resolve Next.js standalone server
    let mut nextjs_script_candidates = Vec::new();
    for root in &roots {
        nextjs_script_candidates.push(root.join("nextjs").join("server.js"));
        nextjs_script_candidates.push(root.join("resources").join("nextjs").join("server.js"));
        nextjs_script_candidates.push(root.join("nextjs").join("servers").join("nextjs").join("server.js"));
        nextjs_script_candidates.push(root.join("resources").join("nextjs").join("servers").join("nextjs").join("server.js"));
    }
    nextjs_script_candidates.push(PathBuf::from("../../servers/nextjs/.next-build/standalone/server.js"));
    nextjs_script_candidates.push(PathBuf::from("../../servers/nextjs/.next-build/standalone/servers/nextjs/server.js"));

    let templates_dir = find_file_in_candidates(&templates_candidates)
        .unwrap_or_else(|| resource_dir.join("resources").join("templates"));
    let templates_str = templates_dir.to_string_lossy().to_string();
    log_to_file(&app_data_dir, &format!("Templates dir resolved to: {:?}", templates_dir));

    // Spawn FastAPI
    if let Some(fastapi_exe) = find_file_in_candidates(&fastapi_candidates) {
        log_to_file(&app_data_dir, &format!("FastAPI binary resolved to: {:?}", fastapi_exe));
        let parent_dir = fastapi_exe.parent().unwrap_or(resource_dir);
        let mut cmd = Command::new(&fastapi_exe);
        cmd.args(["--port", "5001"])
            .current_dir(parent_dir)
            .env("PORT", "5001")
            .env("DISABLE_AUTH", "true")
            .env("APP_DATA_DIRECTORY", &app_data_str)
            .env("TEMPLATES_DIR", &templates_str);

        // Pipe FastAPI logs to app_data/fastapi.log
        if let Ok(out_file) = fs::OpenOptions::new().create(true).append(true).open(app_data_dir.join("fastapi.log")) {
            if let Ok(err_file) = out_file.try_clone() {
                cmd.stdout(std::process::Stdio::from(out_file));
                cmd.stderr(std::process::Stdio::from(err_file));
            }
        }

        #[cfg(unix)]
        ensure_executable(&fastapi_exe);

        #[cfg(target_os = "windows")]
        cmd.creation_flags(CREATE_NO_WINDOW);

        match cmd.spawn() {
            Ok(child) => {
                log_to_file(&app_data_dir, &format!("FastAPI successfully spawned with PID: {}", child.id()));
                if let Ok(mut lock) = children.lock() {
                    lock.push(child);
                }
            }
            Err(e) => {
                log_to_file(&app_data_dir, &format!("ERROR: Failed to spawn FastAPI: {}", e));
            }
        }
    } else {
        log_to_file(&app_data_dir, "ERROR: FastAPI binary not found among candidates.");
    }

    // Spawn Next.js Standalone
    if let Some(nextjs_script) = find_file_in_candidates(&nextjs_script_candidates) {
        log_to_file(&app_data_dir, &format!("Next.js script resolved to: {:?}", nextjs_script));
        let nextjs_cwd = nextjs_script.parent().unwrap_or(resource_dir);
        let node_exe = find_file_in_candidates(&node_candidates)
            .unwrap_or_else(|| PathBuf::from("node"));
        log_to_file(&app_data_dir, &format!("Node binary resolved to: {:?}", node_exe));

        #[cfg(unix)]
        ensure_executable(&node_exe);

        let mut cmd = Command::new(node_exe);
        cmd.arg(&nextjs_script)
            .current_dir(nextjs_cwd)
            .env("PORT", "3000")
            .env("HOSTNAME", "127.0.0.1")
            .env("FAST_API_INTERNAL_URL", "http://127.0.0.1:5001")
            .env("NEXT_PUBLIC_FAST_API", "http://127.0.0.1:5001")
            .env("APP_DATA_DIRECTORY", &app_data_str)
            .env("TEMPLATES_DIR", &templates_str);

        // Pipe Next.js logs to app_data/nextjs.log
        if let Ok(out_file) = fs::OpenOptions::new().create(true).append(true).open(app_data_dir.join("nextjs.log")) {
            if let Ok(err_file) = out_file.try_clone() {
                cmd.stdout(std::process::Stdio::from(out_file));
                cmd.stderr(std::process::Stdio::from(err_file));
            }
        }

        #[cfg(target_os = "windows")]
        cmd.creation_flags(CREATE_NO_WINDOW);

        match cmd.spawn() {
            Ok(child) => {
                log_to_file(&app_data_dir, &format!("Next.js standalone successfully spawned with PID: {}", child.id()));
                if let Ok(mut lock) = children.lock() {
                    lock.push(child);
                }
            }
            Err(e) => {
                log_to_file(&app_data_dir, &format!("ERROR: Failed to spawn Next.js: {}", e));
            }
        }
    } else {
        log_to_file(&app_data_dir, "ERROR: Next.js server script not found among candidates.");
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
