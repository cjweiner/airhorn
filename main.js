'use strict';

const autoUpdate = require('electron').autoUpdater;
const appVersion = require("./package.json").appVersion;
const env = require('./package.json').config.environment;
const os = require("os").platform();
const path = require('path');

const app = require('electron').app;
const ipc = require('electron').ipcMain;
const globalShortcut = require('electron').globalShortcut;
const configuration = require('./config');
const BrowserWindow = require('electron').BrowserWindow;

// adds debug features like hotkeys for triggering dev tools and reload
if(process.env.NODE_ENV == "dev"){
	require('electron-debug')();
}

// prevent window being garbage collected
let mainWindow;
let settingsWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new BrowserWindow({
		width: 368,
		height: 525,
		frame: false,
		resizable:false,
		icon: path.join(__dirname,'app/img/app-icon.icns'),
		backgroundColor: '#696969'
	});

	win.loadURL(`file://${__dirname}/app/index.html`);
	win.on('closed', onClosed);

	return win;
}

ipc.on('close-main-window', () => {
	console.log(process.env.NODE_ENV);
	if(process.platform == "darwin"){
		mainWindow.hide();
	}
	else{
		app.quit();
	}
});

ipc.on('open-settings-window',() => {
	if(settingsWindow){
		return;
	}

	settingsWindow = new BrowserWindow({
		frame:false,
		height:250,
		width:200,
		resizable:false,
		backgroundColor: '#696969'
	});

	settingsWindow.loadURL('file://'+__dirname+'/app/settings.html');

	settingsWindow.on('closed', () => {
		settingsWindow = null;
	});
});

ipc.on('close-settings-window', () => {
	if(settingsWindow){
		settingsWindow.close();
	}
});

ipc.on('set-global-shortcuts',()=>{
	setGlobalShortcuts();
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {

	if(!configuration.readSettings('shortcutKeys')){
		configuration.saveSettings('shortcutKeys',['ctrl','shift']);
	}

	mainWindow = createMainWindow();

	setGlobalShortcuts();
});

function setGlobalShortcuts() {
	globalShortcut.unregisterAll();

	let shortcutKeysSetting = configuration.readSettings('shortcutKeys');
	let prefix = shortcutKeysSetting.lenght === 0 ? '' : shortcutKeysSetting.join('+') + '+';
	
	globalShortcut.register(prefix+'1',()=>{
		mainWindow.webContents.send('global-shortcut',0);
	});
}
