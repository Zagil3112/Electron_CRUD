const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('ipcRendererSender', {
  send: (channel,data) => ipcRenderer.send(channel,data),
  invoke: (channel,...args) => ipcRenderer.invoke(channel,...args)  
});