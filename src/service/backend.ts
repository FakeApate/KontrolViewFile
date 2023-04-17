import * as cp from "child_process";
import * as fs from "fs";
import * as http from "http";
import { Server } from "socket.io";
import {
  UserSettings,
  Profile,
  Device,
  ActiveGroup,
  GroupV1,
  ActiveSession,
} from "./UserSettings.js";
import { appdataError, getNativeExePath } from "./Errors.js";

const server = http.createServer();
const io = new Server(server);
const appdata = process.env.APPDATA ?? appdataError();
const userSettingsPath = `${appdata}/midi-mixer-app/user-settings.json`;
const nativeExePath = getNativeExePath();

let userSettings: UserSettings;
let profile: Profile;
let device: Device;

export function start() {
  io.on("connection", () => {
    readSettings();
    retrieveAndEmitActiveGroupsData();
  });

  server.listen(3000);

  fs.watchFile(userSettingsPath, () => {
    readSettings();
    retrieveAndEmitActiveGroupsData();
  });
}

function readSettings() {
  userSettings = JSON.parse(
    fs.readFileSync(userSettingsPath, "utf-8")
  ) as UserSettings;
  const deviceId = Object.keys(userSettings.activeMidiDevices)[0];
  device = userSettings.device[deviceId];
  const profilePath = `${appdata}/midi-mixer-app/profiles/${deviceId}/spec.json`;
  profile = JSON.parse(fs.readFileSync(profilePath, "utf-8")) as Profile;
}

function retrieveAndEmitActiveGroupsData() {
  const keys = Object.keys(device.groups);
  const activeGroups = new Array<ActiveGroup>();
  for (const key of keys) {
    let group = device.groups[key][0];
    if (group.type === "session") {
      group = group as GroupV1;
      const agroup: ActiveGroup = {
        pathToExe: group.paths[0],
        icon: undefined,
        name: undefined,
        num: Number(profile.groups[key].name.split(" ")[1]),
      };
      activeGroups.push(agroup);
    }
  }

  activeGroups.forEach((element, index) => {
    const buffer = cp
      .execFileSync(nativeExePath, [element.pathToExe])
      .toString("utf-8");
    activeGroups[index] = {
      ...element,
      ...(JSON.parse(buffer) as ActiveSession),
    };
  });
  io.emit("mixerInfo", activeGroups);
}
