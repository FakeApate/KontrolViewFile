import { io } from "socket.io-client";
import { ActiveSession } from "../service/UserSettings.js";

const socket = io("http://localhost:3000/");
socket.on("mixerInfo", incomingData);

function incomingData(data: ActiveSession[]) {
  const visibleColIndexes: number[] = [];

  for (const group of data) {
    if (!group.icon || !group.name || !group.num) continue;

    const title = document.getElementById(`titel_${group.num}`);
    const img = document.getElementById(
      `image_${group.num}`
    ) as HTMLImageElement;

    if (!title || !img) continue;

    title.innerText = group.name;
    img.src = group.icon;

    //add index to the visible Cols
    visibleColIndexes.push(group.num - 1);
  }

  updateOpacity(visibleColIndexes);
}

function getVisibilityMask(
  numColumns: number,
  visibleIndexes: number[]
): number[] {
  const mask = new Array<number>(numColumns);
  for (let i = 0; i < numColumns; i++) {
    if (visibleIndexes.includes(i)) {
      // Set the i-th bit to 1 if the column is visible
      mask[i] = 1;
    } else {
      mask[i] = 0;
    }
  }
  return mask;
}

function updateOpacity(visibleColIndexes: number[]) {
  const cols = document.getElementsByClassName("col");
  const mask = getVisibilityMask(cols.length, visibleColIndexes);
  Array.from(cols).forEach((col, i) => {
    (col as HTMLDivElement).style.opacity = mask[i].toString();
  });
}
