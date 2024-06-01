import { app, BrowserWindow, Menu, shell } from "electron"
import { spawn } from "child_process"
import { fileURLToPath, pathToFileURL } from "url"
import path from "path"
import is_dev from "electron-is-dev"

let mainWindow
let serverProcess
let PORT
if (is_dev) PORT = 3000
else PORT = 3120

// Define the path to the server directory using import.meta.url
const dirname = path.dirname(fileURLToPath(import.meta.url))
let serverPath = ""
if (is_dev) {
    serverPath = path.join(dirname, "../.output/server/index.mjs")
} else {
    serverPath = path.join(process.resourcesPath, "./.output/server/index.mjs")
}

// Start the Nuxt server
serverProcess = spawn("node", [serverPath], {
    env: { ...process.env, PORT },
    stdio: "ignore",
})
async function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        backgroundColor: "#1e293b",
        webPreferences: { nodeIntegration: true },
        windowsHide: true,
    })

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: "deny" }
    })

    // Wait for the server to start before loading the URL
    setTimeout(() => {
        // Load the Nuxt app
        mainWindow.loadURL(`http://localhost:${PORT}`)

        // Open the DevTools.
        mainWindow.webContents.openDevTools()
    }, 0) // Adjust the timeout as needed
}

app.whenReady()
    .then(createWindow)
    .then(() => {
        Menu.setApplicationMenu(null)
    })

app.on("window-all-closed", () => {
    // Kill the server process when the window is closed
    serverProcess.kill()
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
