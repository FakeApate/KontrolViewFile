import * as fs from "fs";

export function getNativeExePath(): string {
  const nativeExePathPacked =
    "resources/app/src/service/KontrolViewFileInfo.exe";
  const nativExePathUnpacked = "src/service/KontrolViewFileInfo.exe";

  if (fs.existsSync(nativeExePathPacked)) {
    return nativeExePathPacked;
  } else if (fs.existsSync(nativExePathUnpacked)) {
    return nativExePathUnpacked;
  }

  throw new Error("nativeExe does not exist!");
}
export function appdataError(): string {
  throw new Error("Appdata path not defined");
}
