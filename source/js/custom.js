// ===== FPS 监测 =====

// 检查是否开启 FPS
if (localStorage.getItem("anzhiyuFPSToggle") === "true") {
  anzhiyu_FPS = true;
  document.querySelector("#fps-group")?.classList.add("show");
  document.querySelector("#consoleFPS")?.classList.add("on");
} else {
  anzhiyu_FPS = false;
}

// FPS 计算
(function () {
  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };

  let fps = 0,
    last = Date.now();

  const step = function () {
    const offset = Date.now() - last;
    fps += 1;
    if (offset >= 1000) {
      last += offset;
      document.querySelector("#fps").innerHTML = fps;
      fps = 0;
    }
    requestAnimationFrame(step);
  };

  step();
})();
