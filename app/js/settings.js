'use strict';

const ipc = require('electron').ipcRenderer;
const configuration = require('../config');

let modifierCheckBoxes =  document.querySelectorAll('.global-shortcut');
for(let i = 0; i < modifierCheckBoxes.length; i++){
    console.log('test');
    let shortcutKeys = configuration.readSettings('shortcutKeys');
    let modifierKey = modifierCheckBoxes[i].attributes['data-mod-key'].value;
    modifierCheckBoxes[i].checked = shortcutKeys.indexOf(modifierKey) !== -1;

    modifierCheckBoxes[i].addEventListener('click',(e)=>{
        bindModifierCheckboxes(e);
    });
}


function bindModifierCheckboxes(ele){
    let shortcutKeys = configuration.readSettings('shortcutKeys');
    let modifierKey = ele.target.attributes['data-mod-key'].value;
    if(shortcutKeys.indexOf(modifierKey)!== -1){
        let keyIndex = shortcutKeys.indexOf(modifierKey);
        shortcutKeys.splice(keyIndex,1);
    }
    else{
        shortcutKeys.push(modifierKey);
    }

    configuration.saveSettings('shortcutKeys',shortcutKeys);
    ipc.send('set-global-shortcuts');
}

let closeEle = document.querySelector('.close');
closeEle.addEventListener('click', () => {
    ipc.send('close-settings-window');
})