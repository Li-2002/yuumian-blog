// ===== FPS 监测 =====

var anzhiyu_FPS = localStorage.getItem("anzhiyuFPSToggle") === "true";

// 检查是否开启 FPS
if (anzhiyu_FPS) {
  var fpsGroup = document.getElementById("fps-group");
  var consoleFPS = document.getElementById("consoleFPS");
  if (fpsGroup) fpsGroup.classList.add("show");
  if (consoleFPS) consoleFPS.classList.add("on");
}

// FPS 计算
var fpsEl = document.getElementById("fps");
if (fpsEl) {
  (function () {
    var raf =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };

    var fps = 0,
      last = Date.now();

    function step() {
      var offset = Date.now() - last;
      fps += 1;
      if (offset >= 1000) {
        last += offset;
        fpsEl.innerHTML = fps;
        fps = 0;
      }
      raf(step);
    }

    step();
  })();
}
