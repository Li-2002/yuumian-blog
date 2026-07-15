---
title: 给博客添加 FPS 监测
cover: >-
  https://yuumii.top/article/%E5%8D%9A%E5%AE%A2%E9%AD%94%E6%94%B9%E8%AE%B0%E5%BD%95/ScreenShot_2026-07-14_114920_711.png
categories: 博客
tags:
  - 博客
  - 安知鱼
  - FPS
  - 博客美化
keywords: 博客FPS,安知鱼,页面性能,帧率监测,博客优化
ai: >-
  雨眠AI摘要帮您理解这篇文章~文章详细介绍了给博客添加FPS监测的全过程，包括创建自定义JS和CSS文件、注入页面、挂载到body、添加中控台开关及逻辑，默认右下角显示实时帧率，支持开关并保存状态。
date: 2026-07-14 10:12:00
description:
---

## 具体操作

### 第一步：创建自定义 JS

在 `source/js/` 下创建 <span style="color: rgba(66, 133, 244, 1)">custom.js</span>，写入 FPS 监测代码：

```javascript
// ===== FPS 监测 =====

// 默认开启：只有显式存过 "false" 才关闭
var FPS_STORAGE_KEY = "anzhiyuFPSToggle";
var anzhiyu_FPS = localStorage.getItem(FPS_STORAGE_KEY) !== "false";

// 同步显示状态（开关点击 / PJAX 切页后都会调用）
function syncFPSState() {
  var fpsGroup = document.getElementById("fps-group");
  var consoleFPS = document.getElementById("consoleFPS");
  if (fpsGroup) fpsGroup.classList.toggle("show", anzhiyu_FPS);
  if (consoleFPS) consoleFPS.classList.toggle("on", anzhiyu_FPS);
}

// 初始化 + 启动帧率计数循环（只启动一次，避免 PJAX 切页重复累加）
function initFPSMonitor() {
  syncFPSState();
  if (window.__anzhiyuFPSLoopStarted) return;
  window.__anzhiyuFPSLoopStarted = true;

  var raf = window.requestAnimationFrame || function (cb) {
    window.setTimeout(cb, 1000 / 60);
  };
  var fps = 0, last = Date.now();

  function step() {
    var fpsEl = document.getElementById("fps");
    var offset = Date.now() - last;
    fps += 1;
    if (offset >= 1000) {
      last += offset;
      if (fpsEl) fpsEl.textContent = fps;
      fps = 0;
    }
    raf(step);
  }
  step();
}

// 页面加载完就初始化（兼容 PJAX 不重新执行脚本的情况）
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFPSMonitor);
} else {
  initFPSMonitor();
}

// 切页后重新同步开关状态
document.addEventListener("pjax:complete", syncFPSState);
```

原理其实很简单——用 `requestAnimationFrame` 来数每秒执行了多少次，一般 60 帧流畅，低于 30 帧就会觉得卡了。

### 第二步：创建自定义 CSS

在 `source/css/` 下创建 <span style="color: rgba(66, 133, 244, 1)">custom.css</span>：

```css
/* ===== FPS 监测 ===== */
#fps-group {
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 固定到页面右下角角落 */
  position: fixed;
  right: 20px;
  bottom: 24px;
  z-index: 9999;
  min-width: 52px;
  padding: 8px 10px;
  border-radius: 14px;
  background: rgba(20, 20, 20, 0.72);
  color: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  pointer-events: none; /* 不挡鼠标操作 */
  transform: translateY(8px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

#fps-group.show {
  opacity: 1;
  transform: translateY(0);
}

/* 亮色主题适配 */
html[data-theme="light"] #fps-group {
  background: rgba(255, 255, 255, 0.88);
  color: var(--anzhiyu-fontcolor);
}

#fps {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.fps-text {
  font-size: 11px;
  line-height: 1;
  opacity: 0.72;
  letter-spacing: 0.8px;
}

/* 中控台 FPS 按钮点亮状态 */
#consoleFPS.on {
  color: var(--anzhiyu-main);
}

#consoleFPS.on .FPS-switch i {
  color: var(--anzhiyu-main) !important;
}

/* 移动端隐藏 */
@media screen and (max-width: 768px) {
  #fps-group.show {
    display: none;
  }
}
```

### 第三步：注入到页面

在 <span style="color: rgba(66, 133, 244, 1)">_config.anzhiyu.yml</span> 中找到 inject 配置，取消注释并添加：

```yaml
inject:
  head:
    - <link rel="stylesheet" href="/css/custom.css">

  bottom:
    - <script src="/js/custom.js"></script>
```

### 第四步：挂到页面 body

```pug
    include ./rightside.pug

    //- FPS 监测角标（固定显示在页面右下角）
    //- 必须挂在 body 直接子级
    #fps-group
      #fps 0
      span.fps-text FPS
```


### 第五步：添加中控台开关

在 <span style="color: rgba(66, 133, 244, 1)">console.pug</span> 中添加 FPS 开关按钮：

```pug
.console-btn-item#consoleFPS(onclick='anzhiyu.FPSToggle()', title='FPS监测')
  a.FPS-switch
    i.anzhiyufont.anzhiyu-icon-gauge-high
```

### 第六步：添加开关逻辑

在 <span style="color: rgba(66, 133, 244, 1)">main.js</span> 中声明变量：

```javascript
var anzhiyu_FPS = false;
```

在 <span style="color: rgba(66, 133, 244, 1)">utils.js</span> 的 `anzhiyu` 对象中添加函数：

```javascript
FPSToggle: function () {
  const isFPSOn = anzhiyu_FPS;
  const fpsGroup = document.querySelector("#fps-group");
  const consoleFPS = document.querySelector("#consoleFPS");
  if (isFPSOn) {
    fpsGroup?.classList.remove("show");
    consoleFPS?.classList.remove("on");
    anzhiyu_FPS = false;
  } else {
    fpsGroup?.classList.add("show");
    consoleFPS?.classList.add("on");
    anzhiyu_FPS = true;
  }
  localStorage.setItem("anzhiyuFPSToggle", isFPSOn ? "false" : "true");
},
```

---

## 怎么用

装好之后：

1. 打开博客，<span style="color: rgba(252, 142, 2, 1)">右下角角落</span>默认就会显示实时 FPS 数字
2. 想关掉的话，点开右下角的中控台按钮
3. 找到 <span style="color: rgba(66, 133, 244, 1)">FPS 监测</span> 图标（一个仪表盘样子的）点一下即可关闭
4. 开/关状态会存在浏览器里，下次打开沿用

---

<span style="color: rgba(252, 142, 2, 1)">愿君安康，平安同乐！</span>