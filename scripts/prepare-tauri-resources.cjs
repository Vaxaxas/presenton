const fs = require("fs");
const path = require("path");
const https = require("https");

const rootDir = path.join(__dirname, "..");
const tauriResources = path.join(rootDir, "src-tauri", "resources");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
}

async function downloadFile(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest) && fs.statSync(dest).size > 10000000) {
    console.log(`[tauri-prepare] File already exists: ${dest}`);
    return;
  }
  console.log(`[tauri-prepare] Downloading ${url} -> ${dest}`);
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });
      fileStream.on("error", reject);
    }).on("error", reject);
  });
}

async function main() {
  fs.mkdirSync(tauriResources, { recursive: true });

  // 1. Copy templates
  console.log("[tauri-prepare] Copying templates...");
  copyDir(path.join(rootDir, "templates"), path.join(tauriResources, "templates"));

  // 2. Copy FastAPI assets and static
  console.log("[tauri-prepare] Copying FastAPI assets & static...");
  copyDir(path.join(rootDir, "servers", "fastapi", "static"), path.join(tauriResources, "fastapi", "static"));
  copyDir(path.join(rootDir, "servers", "fastapi", "assets"), path.join(tauriResources, "fastapi", "assets"));

  // 3. Copy Next.js bundle from electron/resources/nextjs if built, or servers/nextjs/.next-build/standalone
  console.log("[tauri-prepare] Copying Next.js standalone bundle...");
  const electronNextjs = path.join(rootDir, "electron", "resources", "nextjs");
  const nextjsStandalone = path.join(rootDir, "servers", "nextjs", ".next-build", "standalone");
  if (fs.existsSync(electronNextjs)) {
    copyDir(electronNextjs, path.join(tauriResources, "nextjs"));
  } else if (fs.existsSync(nextjsStandalone)) {
    copyDir(nextjsStandalone, path.join(tauriResources, "nextjs"));
  }

  // 4. Download standalone Node.js for Windows, macOS, and Linux
  const nodeDir = path.join(tauriResources, "node");
  fs.mkdirSync(nodeDir, { recursive: true });

  if (process.platform === "win32") {
    const nodeDest = path.join(nodeDir, "node.exe");
    if (!fs.existsSync(nodeDest)) {
      console.log("[tauri-prepare] Fetching Windows node.exe...");
      await downloadFile("https://nodejs.org/dist/v20.18.0/win-x64/node.exe", nodeDest);
    }
  } else if (process.platform === "darwin") {
    const nodeDest = path.join(nodeDir, "node");
    if (!fs.existsSync(nodeDest)) {
      const arch = process.arch === "arm64" ? "darwin-arm64" : "darwin-x64";
      console.log(`[tauri-prepare] Fetching macOS Node.js (${arch})...`);
      const tarUrl = `https://nodejs.org/dist/v20.18.0/node-v20.18.0-${arch}.tar.gz`;
      const tempTar = path.join(tauriResources, "node.tar.gz");
      await downloadFile(tarUrl, tempTar);
      const tempDir = path.join(tauriResources, "node-extract");
      fs.mkdirSync(tempDir, { recursive: true });
      require("child_process").execSync(`tar -xzf "${tempTar}" -C "${tempDir}" --strip-components=1`);
      fs.copyFileSync(path.join(tempDir, "bin", "node"), nodeDest);
      fs.chmodSync(nodeDest, 0o755);
      fs.rmSync(tempTar, { force: true });
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  } else if (process.platform === "linux") {
    const nodeDest = path.join(nodeDir, "node");
    if (!fs.existsSync(nodeDest)) {
      console.log("[tauri-prepare] Fetching Linux Node.js (linux-x64)...");
      const tarUrl = `https://nodejs.org/dist/v20.18.0/node-v20.18.0-linux-x64.tar.gz`;
      const tempTar = path.join(tauriResources, "node.tar.gz");
      await downloadFile(tarUrl, tempTar);
      const tempDir = path.join(tauriResources, "node-extract");
      fs.mkdirSync(tempDir, { recursive: true });
      require("child_process").execSync(`tar -xzf "${tempTar}" -C "${tempDir}" --strip-components=1`);
      fs.copyFileSync(path.join(tempDir, "bin", "node"), nodeDest);
      fs.chmodSync(nodeDest, 0o755);
      fs.rmSync(tempTar, { force: true });
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  // Ensure binaries have executable permissions on Unix
  if (process.platform !== "win32") {
    const nodeBinary = path.join(nodeDir, "node");
    if (fs.existsSync(nodeBinary)) fs.chmodSync(nodeBinary, 0o755);
    const fastapiBinary = path.join(tauriResources, "fastapi", "fastapi");
    if (fs.existsSync(fastapiBinary)) fs.chmodSync(fastapiBinary, 0o755);
  }

  console.log("[tauri-prepare] All Tauri resources prepared successfully!");
}

main().catch((err) => {
  console.error("[tauri-prepare] Error:", err);
  process.exit(1);
});
