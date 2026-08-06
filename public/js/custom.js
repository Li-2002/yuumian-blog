// ===== FPS 监测 =====

var FPS_STORAGE_KEY = "anzhiyuFPSToggle";
var anzhiyu_FPS = localStorage.getItem(FPS_STORAGE_KEY) !== "false";

function syncFPSState() {
  var fpsGroup = document.getElementById("fps-group");
  var consoleFPS = document.getElementById("consoleFPS");

  if (fpsGroup) {
    fpsGroup.classList.toggle("show", anzhiyu_FPS);
  }

  if (consoleFPS) {
    consoleFPS.classList.toggle("on", anzhiyu_FPS);
  }
}

function initFPSMonitor() {
  syncFPSState();

  if (window.__anzhiyuFPSLoopStarted) {
    return;
  }

  window.__anzhiyuFPSLoopStarted = true;

  var raf = window.requestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

  var fps = 0;
  var last = Date.now();

  function step() {
    var fpsEl = document.getElementById("fps");
    var offset = Date.now() - last;

    fps += 1;

    if (offset >= 1000) {
      last += offset;
      if (fpsEl) {
        fpsEl.textContent = fps;
      }
      fps = 0;
    }

    raf(step);
  }

  step();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFPSMonitor);
} else {
  initFPSMonitor();
}

document.addEventListener("pjax:complete", syncFPSState);
