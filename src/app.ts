import {app, BrowserWindow, type BrowserWindowConstructorOptions} from 'electron';
import * as path from 'path';

const createWindow: () => void = () => {
	const options: BrowserWindowConstructorOptions = {
		width: 1330,
		height: 450,
		autoHideMenuBar: true,
		kiosk: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
		},
	};

	const win: BrowserWindow = new BrowserWindow(options);

	win.loadFile('index.html').catch(reason => {
		throw new Error(reason as string);
	});
};

app.whenReady().then(() => {
	createWindow();
}).catch(reason => {
	throw new Error(reason as string);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

