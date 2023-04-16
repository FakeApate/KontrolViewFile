const { io } = require("socket.io-client");
var socket = io("http://localhost:3000/");
socket.on("mixerInfo", incomingData);

function incomingData(data){
  let visibleColIndexes = [];
  for (var groupIndex in data) {

    var group = data[groupIndex];

    //catch any null members
    if (group == null) {
      continue;
    }

    //Getting Elements
    var tid = "titel_" + group.num;
    var iid = "image_" + group.num;
    var title = document.getElementById(tid);
    var img = document.getElementById(iid);

    //Update content
    title.innerText = group.name;
    img.src = group.icon;

    //add index to the visible Cols
    visibleColIndexes.push(group.num - 1);
  }

  updateOpacity(visibleColIndexes);
}

function updateOpacity(visibleColIndexes){
  let cols = document.getElementsByClassName("col");
  for (var i = 0; i < cols.length; i++) {
    cols[i].style.opacity = 0;
  }
  for (var i = 0; i < visibleColIndexes.length; i++) {
    cols[visibleColIndexes[i]].style.opacity = 1;
  }
}