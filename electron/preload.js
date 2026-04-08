const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  readData: (key) => ipcRenderer.invoke('read-data', key),
  writeData: (key, value) => ipcRenderer.invoke('write-data', key, value),
});
