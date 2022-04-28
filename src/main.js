const electron = require("electron");
const {
  Menu,
  app,
  Tray,
  BrowserWindow,
  ipcMain: ipc,
  globalShortcut,
} = electron;
const exec = require("child_process").exec;
const child_process = require("child_process");
var { PythonShell } = require("python-shell");
var AutoLaunch = require("auto-launch");
const path = require("path");
var options = {};
function execute(command, callback) {
  exec(command, (error, stdout, stderr) => {
    callback(stdout);
  });
}
let tray = null;

options = {
  pythonPath: "/usr/bin/python3",
};
var mode = "asst";
var manage = {
  state: -1,
  stateListener: function (val) {},
  set trigger(val) {
    this.state = val;
    this.stateListener(val);
  },
  get trigger() {
    return this.state;
  },
  registerListener: function (listener) {
    this.stateListener = listener;
  },
};

require("electron-reload")(__dirname, {
  electron: require(`${__dirname}/../node_modules/electron`),
});

var mainWindow = null;
app.on("ready", async (_) => {
  let autoLaunch = new AutoLaunch({
    name: "BTBat",
  });
  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled) autoLaunch.enable();
  });

  // mainWindow = new BrowserWindow({
  //   width: 0,
  //   height: 0,
  //   webPreferences: {
  //     nodeIntegration: true,
  //   },
  // });
  // mainWindow.loadURL(`file://${__dirname}/index.html`);
  tray = new Tray(path.join(__dirname, "assets/min.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Gathering Information",
      click: function () {
        console.log("User is too eager ! ")
      },
    },
    {
      label: "Quit",
      click: function () {
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("Bluetooth Battery");


  manage.registerListener(() => {
    console.log("CALLING SCRIPT");
    PythonShell.run(path.join(__dirname, "../bbt/exec.py"), options, function (
      err,
      results
    ) {
      if (err) {
        throw err;
      }
      results = JSON.parse(results[results.length-1]);
      const contextMenu = Menu.buildFromTemplate([
        ...results['info'].map(device=> {return {
          label: device['name'] + " : " + (device['battery']  === -1 ? "Not Connected" : device['battery'].toString() + "%")
        }}),
        {
          label: "Quit",
          click: function () {
            app.quit();
          },
        },
      ]);
      tray.setContextMenu(contextMenu);
      setTimeout(()=>{manage.trigger += 1},30000);
    });
  });

  manage.trigger += 1;


});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.exit(0);
  }
});

ipc.on("close", (evt) => {
  app.exit(0);
});
app.on("before-quit", () => {
  globalShortcut.unregisterAll();
  if (mainWindow) {
    mainWindow.removeAllListeners("close");
    mainWindow.close();
  }
});
