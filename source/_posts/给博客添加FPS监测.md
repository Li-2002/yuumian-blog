---
title: 给博客添加 FPS 监测
cover: https://yuumii.top/article/%E5%8D%9A%E5%AE%A2%E9%AD%94%E6%94%B9%E8%AE%B0%E5%BD%95/ScreenShot_2026-07-14_114920_711.png
categories: 博客
tags:
  - 博客
  - 安知鱼
  - FPS
  - 博客美化
keywords: 博客FPS,安知鱼,页面性能,帧率监测,博客优化
description: 
ai: >-

date: 2026-07-14 10:12:00
---


## 具体操作

### 第一步：创建自定义 JS

在 `source/js/` 下创建 <span style="color: rgba(66, 133, 244, 1)">custom.js</span>，写入 FPS 监测代码：

```javascript
// 检查是否开启 FPS
if (localStorage.getItem("anzhiyuFPSToggle") === "true") {
  document.querySelector("#fps-group")?.classList.add("show");
  document.querySelector("#consoleFPS")?.classList.add("on");
}

// FPS 计算
(function () {
  const raf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (cb) { window.setTimeout(cb, 1000 / 60); };

  let fps = 0, last = Date.now();

  const step = function () {
    const offset = Date.now() - last;
    fps += 1;
    if (offset >= 1000) {
      last += offset;
      document.querySelector("#fps").innerHTML = fps;
      fps = 0;
    }
    raf(step);
  };

  step();
})();
```

原理其实很简单——用 `requestAnimationFrame` 来数每秒执行了多少次，一般 60 帧流畅，低于 30 帧就会觉得卡了。

### 第二步：创建自定义 CSS

在 `source/css/` 下创建 <span style="color: rgba(66, 133, 244, 1)">custom.css</span>：

```css
/* FPS 显示区域 */
#fps-group {
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  padding: 0 6px;
  min-width: 36px;
  color: var(--anzhiyu-white);
  transition: opacity 0.3s ease;
}

#fps-group.show {
  opacity: 1;
}

.nav-fixed #fps-group,
.not-top-img #fps-group {
  color: var(--anzhiyu-fontcolor);
}

#fps {
  font-size: 13px;
  font-weight: bold;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.fps-text {
  font-size: 10px;
  line-height: 1;
  opacity: 0.6;
  letter-spacing: 1px;
}

/* 中控台 FPS 按钮点亮状态 */
#consoleFPS.on {
  color: var(--anzhiyu-main);
}

/* 移动端隐藏 */
@media screen and (max-width: 768px) {
  #fps-group.show { display: none; }
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

### 第四步：修改导航栏

在主题的 <span style="color: rgba(66, 133, 244, 1)">nav.pug</span> 文件中，`#nav-right` 下面添加 FPS 显示区域：

```pug
#nav-right
  #fps-group
    #fps 0
    span.fps-text FPS
  // ... 其他导航按钮
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

1. 打开博客，右下角的中控台按钮
2. 找到 <span style="color: rgba(66, 133, 244, 1)">FPS 监测</span> 图标（一个仪表盘样子的）
3. 点击开启，导航栏右侧就会出现实时 FPS 数字
4. 不用了再点一下关闭，状态会保存在浏览器里

---

<span style="color: rgba(252, 142, 2, 1)">愿君安康，平安同乐！</span>
