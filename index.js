const { app, BrowserWindow } = require("electron");
const path = require('path')
const backend = require("./backend");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1330,
    height: 450,
    autoHideMenuBar: true,
    kiosk: false,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
      }
  });
  
  win.loadFile("index.html");
  win.addListener("moved", () => {
    console.log(win.getPosition());
  });
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

