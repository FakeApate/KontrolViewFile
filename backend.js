const http = require("http");
const server = http.createServer();
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");
const fileIcon = require("extract-file-icon");
const exiftool = require("exiftool-vendored").exiftool;

class MixerInfo {
  constructor() {
    this.read();
    fs.watchFile(this.userSettPath, () => {
      this.read();
    });
  }

  read() {
    delete this.list;
    this.userSettPath = `${process.env.APPDATA}/midi-mixer-app/user-settings.json`;
    this.userSettings = JSON.parse(fs.readFileSync(this.userSettPath, "utf-8"));
    this.deviceId = Object.keys(this.userSettings.activeMidiDevices)[0];
    this.device = this.userSettings.device[this.deviceId];
    this.profilePath = `${process.env.APPDATA}/midi-mixer-app/profiles/${this.deviceId}/spec.json`;
    this.profile = JSON.parse(fs.readFileSync(this.profilePath, "utf-8"));

    this.getList().then(() => {
      io.emit("mixerInfo", this.list);
    });
  }

  async getList() {
    const keys = Object.keys(this.device.groups);

    for (var keyIndex in keys) {
      const key = keys[keyIndex];
      const group = this.device.groups[key][0];
      const groupNum = this.profile.groups[key].name.split(" ")[1];
      if (group.type === "session") {
        const stats = await exiftool.read(group.paths[0]);
        const buffer = await fileIcon(this.device.groups[key][0].paths[0]);
        const image = `data:image/jpg;base64,${buffer.toString("base64")}`;
        if (this.list) {
          this.list.push({
            num: groupNum,
            name: stats.ProductName,
            icon: image,
          });
        } else {
          this.list = [{ num: groupNum, name: stats.ProductName, icon: image }];
        }
      }
    }
  }
}

const mixerInfo = new MixerInfo();

io.on("connection", () => {
  mixerInfo.read();
});

server.listen(3000);
