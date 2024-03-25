const {createWindow} = require('./main');
const {app,Menu} = require('electron');
require('./database');
require('electron-reload')(__dirname);

app.allowRendererProcessReuse = true;
app.whenReady().then( () => {
    createWindow();

    // Implement Menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

})

// Menu Template

const menu = [
    
    {
        role: 'fileMenu'
    },
    
];