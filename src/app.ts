import {
  app,
  BrowserWindow,
  type BrowserWindowConstructorOptions,
} from "electron";
import * as path from "path";

import { start } from "./service/backend.js";
start();

const createWindow: () => void = () => {
  const options: BrowserWindowConstructorOptions = {
    x: -1,
    y: 1434,
    width: 1380,
    height: 430,
    autoHideMenuBar: true,
    frame: false,
    enableLargerThanScreen: true,
    webPreferences: {
      preload: path.join(__dirname, "client/preload.js"),
      nodeIntegration: true,
    },
  };

  const win: BrowserWindow = new BrowserWindow(options);

  win.loadFile("web/index.html").catch((reason) => {
    throw new Error(reason as string);
  });
};

app
  .whenReady()
  .then(() => {
    createWindow();
  })
  .catch((reason) => {
    throw new Error(reason as string);
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
