///Imports
const http = require("http");
const fs = require("fs");
const { Server } = require("socket.io");
const exec = require("child_process").execFile;
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);
///Const
const server = http.createServer();
const io = new Server(server);

///Vars
let activeGroups = [];
let userSettPath;
let userSettings;
let deviceId;
let device;
let profilePath;
let profile;
[userSettPath, userSettings, deviceId, device, profilePath, profile] =
  read_mixer_files();

///Events
fs.watchFile(userSettPath, () => {
  [userSettPath, userSettings, deviceId, device, profilePath, profile] =
    read_mixer_files();
  dataTransfer();
});

io.on("connection", () => {
  read_mixer_files();
  dataTransfer();
});

server.listen(3000);

///Parsing Setting files from Midi Mixer App
function read_mixer_files() {
  const userSettPath = `${process.env.APPDATA}/midi-mixer-app/user-settings.json`;
  const userSettings = JSON.parse(fs.readFileSync(userSettPath, "utf-8"));
  const deviceId = Object.keys(userSettings.activeMidiDevices)[0];
  const device = userSettings.device[deviceId];
  const profilePath = `${process.env.APPDATA}/midi-mixer-app/profiles/${deviceId}/spec.json`;
  const profile = JSON.parse(fs.readFileSync(profilePath, "utf-8"));

  return [userSettPath, userSettings, deviceId, device, profilePath, profile];
}

/// Calling nativ application to get the icon and product name
/// Emitting event for front-end
async function dataTransfer() {
  const keys = Object.keys(device.groups);
  for (var keyIndex in keys) {
    const key = keys[keyIndex];
    const group = device.groups[key][0];
    const groupNum = profile.groups[key].name.split(" ")[1];
    if (group.type === "session") {
      var path = "";
      if(fs.existsSync("resources/app/KontrolViewFileInfo.exe")){
        path = "resources/app/";
      }
      const { stdout } = await execFile(path+"KontrolViewFileInfo.exe", [
        group.paths[0],
      ]);
      let result = JSON.parse(stdout.toString());
      result.num = groupNum;
      activeGroups[result.num] = result;
    }
  }
  io.emit("mixerInfo", activeGroups);
}
