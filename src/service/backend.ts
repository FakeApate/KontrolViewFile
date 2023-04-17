import * as http from 'http';
import * as fs from 'fs';
import {Server} from 'socket.io';
import execFile from 'child_process';

const server = http.createServer();
const io = new Server(server);
const appdata = process.env.APPDATA ?? '';
const userSettingsPath = `${appdata}/midi-mixer-app/user-settings.json`;

io.on('connection', () => {
	//
});

server.listen(3000);

fs.watchFile(userSettingsPath, () => {
	const userSettings: UserSettings = JSON.parse(fs.readFileSync(userSettingsPath, 'utf-8')) as UserSettings;
	const deviceId = Object.keys(userSettings.activeMidiDevices)[0];
	const device: Dev = userSettings.device[deviceId];
	const profilePath = `${appdata}/midi-mixer-app/profiles/${deviceId}/spec.json`;
	const profile: Profile = JSON.parse(fs.readFileSync(profilePath, 'utf-8')) as Profile;
});

type UserSettings = {
	activeMidiDevices: Record<string, boolean>;
	device: Record<string, Dev>;
};

type Dev = {
	groups: Record<string, GroupV1 | GroupV2>;
};

type GroupV1 = {
	type: string;
	paths: string[];
};

type GroupV2 = {
	type: string;
	id: string;
};

type Profile = {
	name: string;
};
