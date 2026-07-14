---
title: 给博客添加 FPS 监测
cover: https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=a%20blog%20website%20on%20a%20laptop%20screen%20showing%20a%20small%20FPS%20counter%20in%20the%20navigation%20bar%2C%20minimalist%20dark%20theme&image_size=landscape_16_9
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

## 前言



最近在优化博客的性能，想着能不能实时看到页面的 <span style="color: rgba(66, 133, 244, 1)">帧率</span>，这样优化前后有没有效果一目了然。

找了一圈发现安知鱼主题本身没有这个功能，那就自己动手搞一个。效果就是在导航栏右侧显示当前 FPS，并且可以通过中控台开关，想开就开想关就关。

先看看效果（虽然你也看不到动效但是意思到了）：

```
导航栏右侧显示：  [ 60 FPS ]
                ↑ 实时更新的帧率
```

---

## 实现思路

整体流程是这样的：

| 步骤 | 干啥 |
|:---|:---|
| ① 写 JS | 监听 `requestAnimationFrame` 计算每秒帧数 |
| ② 写 CSS | 给 FPS 显示区域写样式 |
| ③ 改 nav | 在导航栏右侧加一个 FPS 显示位 |
| ④ 改控制台 | 加一个 FPS 开关按钮 |
| ⑤ 加函数 | 在主题的 utils.js 里加开关逻辑 |
| ⑥ 注入 | 把自定义 js/css 注入到页面 |

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

## 一些说明

- <span style="color: rgba(52, 168, 83, 1)">60 FPS</span> 说明页面很流畅
- <span style="color: rgba(252, 142, 2, 1)">30 FPS 左右</span> 说明有点卡了，可以看看是不是插件太多
- <span style="color: rgba(234, 67, 53, 1)">低于 30 FPS</span> 那就要考虑优化了
- 移动端默认隐藏，毕竟手机屏幕小，没必要占位置

这个功能的好处就是可以直观看到页面的性能状况，加了新功能或者新插件之后看看 FPS 有没有掉，心里有个数。

---

## 最后

代码量不大，主要是要改几个文件。如果你也是安知鱼主题，照着上面步骤来就行。其他主题的话原理一样，找到对应的地方改就可以了。

有什么问题可以来问我~

<span style="color: rgba(252, 142, 2, 1)">愿君安康，平安同乐！</span>
