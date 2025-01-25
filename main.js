const { app, BrowserWindow, ipcMain, desktopCapturer } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
});

ipcMain.handle("capture-screen", async () => {
  try {
    // Capture all available displays
    const sources = await desktopCapturer.getSources({ types: ["screen"] });

    // Pick the first screen source (entire screen)
    const screen = sources[0];

    // Decode base64 image data and save it
    const imageBuffer = Buffer.from(screen.thumbnail.toPNG(), "base64");

    // Create the screenshots directory if it doesn't exist
    const screenshotsPath = path.join(__dirname, "screenshots");
    if (!fs.existsSync(screenshotsPath)) {
      fs.mkdirSync(screenshotsPath);
    }

    // Save the screenshot
    const filePath = path.join(screenshotsPath, `screenshot-${Date.now()}.png`);
    fs.writeFileSync(filePath, imageBuffer);

    return { success: true, filePath };
  } catch (error) {
    console.error("Error capturing screen:", error);
    return { success: false, error: error.message };
  }
});
