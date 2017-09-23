'use strict';

const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const Tray = remote.Tray;
const Menu = remote.Menu;
const path = require('path');

let trayIcon = null;
trayIcon = new Tray(path.join(__dirname, 'img/tray-icon.png'));
let trayMenuTemplate = [
    {
        label: 'Airhorn!',
        enable: false
    },
    {
        label: 'Settings',
        click: () =>{
            ipc.send('open-settings-window');
        }
    },
    {
        label: 'Quit',
        click: ()=>{
            ipc.send('close-main-window');
        }
    }
];
var trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
trayIcon.setContextMenu(trayMenu);
trayIcon.setPressedImage(path.join(__dirname, 'img/tray-iconHighlight.png'));


var closeEle = document.querySelector('.close');
var soundButtons = document.querySelectorAll('.button-sound');
var settingsEle = document.querySelector('.settings');

settingsEle.addEventListener('click', function () {
    ipc.send('open-settings-window');
});

closeEle.addEventListener('click',()=>{
    ipc.send('close-main-window');
})

for(var i = 0; i < soundButtons.length; i++){
    var soundButton = soundButtons[i];
    var soundName = soundButton.attributes["data-sound"].value;

    prepareButton(soundButton, soundName);
}

ipc.on('global-shortcut', function (e,arg) {
    var soundName = soundButtons[arg].attributes["data-sound"].value;
    playSound(soundName);
});

function prepareButton(buttonEle, name){
    buttonEle.addEventListener('click', function () {
        playSound(name);
    });
}

function playSound(soundName){
    var audio = new Audio(__dirname + '/sounds/' + soundName + '.mp3');
    audio.currentTime = 0;
    audio.play();
}
