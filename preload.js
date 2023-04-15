const { io } = require("socket.io-client");
const { exec } = require("child_process");

window.addEventListener("DOMContentLoaded", () => {
  var socket = io("http://localhost:3000/");
  socket.on("mixerInfo", function (data) {
    let inactiveControlls = [1,2,3,4,5,6,7,8];
    for (var groupIndex in data) {
      var group = data[groupIndex];
      var tid = "titel_" + group.num;
      var iid = "image_" + group.num;
      var title = document.getElementById(tid);
      var img = document.getElementById(iid);
      title.innerText = group.name;
      img.src = group.icon;

      document.getElementsByClassName("col")[group.num-1].style.opacity = 1;
      inactiveControlls = inactiveControlls.filter((value) => {
        return value != group.num;
      });
    }

    inactiveControlls.forEach((index) => {
      document.getElementsByClassName("col")[index-1].style.opacity = 0;
    })
  });
});
