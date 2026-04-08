const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs/promises');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 430,
    height: 932,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the index.html of the app.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  ipcMain.handle('read-data', async (event, key) => {
    try {
      const userDataPath = app.getPath('userData');
      const dataPath = path.join(userDataPath, 'data.json');
      const data = await fs.readFile(dataPath, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed[key];
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      console.error('Error reading data:', error);
      return null;
    }
  });

  ipcMain.handle('write-data', async (event, key, value) => {
    try {
      const userDataPath = app.getPath('userData');
      const dataPath = path.join(userDataPath, 'data.json');
      
      let parsed = {};
      try {
        const data = await fs.readFile(dataPath, 'utf-8');
        parsed = JSON.parse(data);
      } catch (error) {
        // File might not exist yet, which is fine
      }

      parsed[key] = value;
      await fs.writeFile(dataPath, JSON.stringify(parsed, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing data:', error);
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
