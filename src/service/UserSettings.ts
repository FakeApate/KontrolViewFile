export type UserSettings = {
  activeMidiDevices: Record<string, boolean>;
  device: Record<string, Device>;
};
export type Device = {
  groups: Record<string, Array<GroupV1 | GroupV2>>;
};
export type GroupV1 = {
  type: string;
  paths: string[];
};
type GroupV2 = {
  type: string;
  id: string;
};
export type Profile = {
  groups: Record<string, { name: string }>;
};
export type ActiveSession = {
  num: number | undefined;
  icon: string | undefined;
  name: string | undefined;
};
export type ActiveGroup = ActiveSession & { pathToExe: string };
