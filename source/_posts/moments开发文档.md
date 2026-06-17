---
title: 动态/朋友圈(moments)页面开发文档
top_img: https://yuumii.top/about/about6-yanyun.jpg
cover: https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/Logo.png
categories: 博客
tags: Hexo新页面
keywords: moment
description: 动态/朋友圈(moments)页面开发文档
ai: >-
  雨眠AI摘要帮您理解这篇文章~本文档详细介绍了Hexo
  Anzhiyu主题动态/朋友圈页面的开发步骤，通过新建index.md、moments.yml和moments.pug文件实现仿微信朋友圈风格页面，支持文字、图片、视频、音乐等内容发布，数据从source/_data/moments.yml读取，每条动态有独立Twikoo评论区，无需修改现有文件。
---

# 动态/朋友圈(moments)页面开发文档-Anzhiyu主题

## 一、功能概述

### 1、了解该页面

因为原先的闲言碎语页面不是我觉得不是很喜欢，所以就想着自己去做一个，仿照别人的创建新页面的方法做了一个pug模板，一个页面，然后剩下的ai一下，最终做出这个仿微信朋友圈风格的动态展示页面，支持发布文字、图片、视频、音乐等内容，我自己加了一个实况图的，看到这话说明这边还没加入。数据通过_data/moments文件管理，评论系统接入Twikoo，每条动态拥有独立评论区。而且，图片的排版方式我也修改了，按照我喜欢的去排版了

- 页面路径：`/moments/`
- 数据来源：`source/_data/moments.yml`
- **这个新增页面好的点就是仅新增文件，不修改任何现有文件**

### 2、查看效果

新增页面这种东西，肯定要先看看效果好不好再看看要不要啦！
<a href="/moments/" target="_blank" class="moment-post-preview-btn" style="display:inline-flex;align-items:center;gap:8px;padding:8px 24px;background:linear-gradient(135deg,#425AEF,#6C83F7);color:#fff;font-size:0.95rem;font-weight:600;border-radius:50px;text-decoration:none;position:relative;overflow:hidden;transition:all 0.35s cubic-bezier(0.25,0.8,0.25,1);box-shadow:0 4px 12px rgba(66,90,239,0.25);" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(66,90,239,0.4)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px rgba(66,90,239,0.25)';">
  <i class="anzhiyufont anzhiyu-icon-arrow-circle-right" style="font-size:1rem;transition:transform 0.35s ease;"></i>
  <span>碎碎念动态</span>
</a>

## 二、实现步骤

### 1、修改菜单配置

在 `_config.anzhiyu.yml` 和 `themes/anzhiyu/_config.yml` 的 `menu` 中添加动态菜单项：

```yaml
  动态:
    朋友圈: /moments/ || anzhiyu-icon-bolt
```

位置在两个文件的 menu 部分，与其他 menu 分组同级。

---

### 2、新建文件

#### 2.1 新建 MD 页面文件

在 `\source\moments\` 中新建 `index.md`：

```markdown
---
title: 动态
date: 2026-06-12 00:00:00
type: moments
layout: moments
comments: false
aside: false
top_img: false
---
```

#### 2.2 新建 YML 数据文件

在 `\source\_data\` 中新建 `moments.yml`：


```yaml
- class_name: 朋友圈
  subTitle: 唠唠嗑发发好玩的
  tips: 万物可爱，生活明朗 ✨
  top_background: https://yuumii.top/sys/bakcgournd.png
  buttonText: 关于我
  buttonLink: /about/
  moments_list:

    - content: 这条动态只有纯文字
      date: 2026/06/15
      address: 佛山
      from: Windows 10

    - content: 带图片的动态
      date: 2026/06/10
      image:
        - https://example.com/img1.jpg
        - https://example.com/img2.jpg
      address: 深圳
      from: K90

    - content: 带视频的动态
      date: 2026/06/05
      video:
        - https://player.bilibili.com/player.html?aid=226886152&bvid=BV1Ch41137tR&cid=1081639816&p=1&autoplay=0
      from: Windows 10

    - content: 带音乐推荐
      date: 2026/06/08
      aplayer:
        server: netease
        id: 2082329068
      address: 佛山
```

**字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `content` | 字符串 | 动态正文 |
| `date` | 字符串 | 日期，格式 `YYYY/MM/DD` |
| `image` | 数组 | 图片链接列表，支持 1-9 张 |
| `video` | 数组 | 视频链接列表，支持 B站/YouTube/本地视频 |
| `aplayer` | 对象 | 音乐播放器，`server` 支持 `netease`/`tencent`/`kugou`/`kuwo`/`baidu` |
| `address` | 字符串 | 地址，为空默认显示"佛山" |
| `from` | 字符串 | 设备标识，为空默认显示"Redmi K90" |
| `link` | 字符串 | 外链地址 |

#### 2.3 新建 PUG 模板文件

在 `\themes\anzhiyu\layout\` 中新建 `moments.pug`：

```pug
//- ============================================================
//- Hexo Anzhiyu 主题 - 朋友圈/动态页面模板
//- 路径：/moments/
//- 数据：source/_data/moments.yml
//- 评论：Twikoo（每条动态独立评论区）
//- ============================================================
extends includes/layout.pug

block content
  link(rel="stylesheet" href=url_for("/css/moments.css"))

  if site.data.moments
    each i in site.data.moments
      #moments-page.moments-page
        //- ========== 顶部 Banner ==========
        .moments-banner(style = i.top_background ? `background: url(${i.top_background}) center / cover no-repeat;` : "")
          .banner-overlay
          .banner-content
            .banner-tips= i.tips
            h1.banner-title= i.subTitle
            if i.buttonText
              a.banner-link(href=url_for(i.buttonLink))
                i.anzhiyufont.anzhiyu-icon-arrow-circle-right
                span= i.buttonText

        //- ========== 动态时间线 ==========
        .moments-timeline
          each item, idx in i.moments_list
            - var suffix = ((idx * 137 + 59) % 900 + 100)
            - var momentPath = '/moments/' + item.date.replace(/\//g, '-') + '-' + suffix
            .moment-item(id='moment-' + idx)
              .moment-card
                //- 头部：头像 + 昵称
                .moment-header
                  img.moment-header-avatar(src=theme.avatar_img || "/img/avatar.png" alt="avatar" loading="lazy")
                  .moment-header-info
                    .moment-author= config.author || "我"
                    if item.date
                      time.moment-header-time(datetime=item.date)= item.date

                //- 正文
                if item.content
                  .moment-text= item.content

                //- 图片画廊
                if item.image && item.image.length
                  - var imgTotal = item.image.length
                  - var imgUrls = item.image.map(function(x){return url_for(x)}).join(',')
                  - var visibleCount = imgTotal > 5 ? 5 : imgTotal
                  - var displayImages = imgTotal > 5 ? item.image.slice(0, 5) : item.image

                  //- 1 张图
                  if imgTotal === 1
                    - var r0 = url_for(item.image[0])
                    .moment-gallery.gallery-1
                      img.gallery-img(src=r0 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 0)`)

                  //- 2 张图 — 上下等分
                  if imgTotal === 2
                    - var r0 = url_for(item.image[0]), r1 = url_for(item.image[1])
                    .moment-gallery.gallery-2
                      .gallery-item
                        img.gallery-img(src=r0 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 0)`)
                      .gallery-item
                        img.gallery-img(src=r1 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 1)`)

                  //- 3 张图 — 上1下2 + 斜切分割
                  if imgTotal === 3
                    - var r0 = url_for(item.image[0]), r1 = url_for(item.image[1]), r2 = url_for(item.image[2])
                    .moment-gallery.gallery-3
                      .gallery-row-top
                        img.gallery-img(src=r0 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 0)`)
                      .gallery-diagonal
                      .gallery-row-bottom
                        .gallery-item
                          img.gallery-img(src=r1 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 1)`)
                        .gallery-item
                          img.gallery-img(src=r2 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 2)`)

                  //- 4 张图 — 1 张悬浮居中 + 3 张错落 + 左右切换
                  if imgTotal === 4
                    - var r0 = url_for(item.image[0]), r1 = url_for(item.image[1]), r2 = url_for(item.image[2]), r3 = url_for(item.image[3])
                    - var allUrls4Arr = '["' + item.image.map(function(x){return url_for(x)}).join('","') + '"]'
                    .moment-gallery.gallery-4(
                      data-all-urls=allUrls4Arr
                      data-main-idx="0"
                    )
                      .gallery-float-main
                        img.gallery-img(src=r0 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 0)`)
                        button.gallery-arrow.gallery-arrow-left(onclick=`MomentsApp.gallery4Prev(this)`)
                          i.anzhiyufont.anzhiyu-icon-chevron-left
                        button.gallery-arrow.gallery-arrow-right(onclick=`MomentsApp.gallery4Next(this)`)
                          i.anzhiyufont.anzhiyu-icon-chevron-right
                      .gallery-stagger-row
                        .gallery-item.gallery-skew-left
                          img.gallery-img(src=r1 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 1)`)
                        .gallery-item.gallery-skew-right
                          img.gallery-img(src=r2 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 2)`)
                        .gallery-item.gallery-skew-left
                          img.gallery-img(src=r3 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 3)`)

                  //- 5 张图 — 上横通栏斜切 + 下2×2
                  if imgTotal === 5
                    - var r0 = url_for(item.image[0]), r1 = url_for(item.image[1]), r2 = url_for(item.image[2]), r3 = url_for(item.image[3]), r4 = url_for(item.image[4])
                    .moment-gallery.gallery-5
                      .gallery-wide-top
                        img.gallery-img(src=r0 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 0)`)
                        .gallery-wide-skew
                      .gallery-grid-2x2
                        .gallery-item: img.gallery-img(src=r1 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 1)`)
                        .gallery-item: img.gallery-img(src=r2 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 2)`)
                        .gallery-item: img.gallery-img(src=r3 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 3)`)
                        .gallery-item: img.gallery-img(src=r4 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 4)`)

                  //- 超过5张 — 前5张展示，第5张毛玻璃遮罩
                  if imgTotal > 5
                    .moment-gallery.gallery-expand(data-expanded="false")
                      - var g0 = url_for(item.image[0]), g1 = url_for(item.image[1]), g2 = url_for(item.image[2]), g3 = url_for(item.image[3]), g4 = url_for(item.image[4])
                      .gallery-wide-top
                        img.gallery-img(src=g0 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 0)`)
                        .gallery-wide-skew
                      .gallery-grid-2x2
                        .gallery-item: img.gallery-img(src=g1 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 1)`)
                        .gallery-item: img.gallery-img(src=g2 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 2)`)
                        .gallery-item: img.gallery-img(src=g3 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 3)`)
                        .gallery-cell-frosted
                          img.gallery-img(src=g4 alt="image" loading="lazy")
                          .gallery-frosted-overlay(onclick=`MomentsApp.expandGallery(this)`)
                            i.anzhiyufont.anzhiyu-icon-angles-right
                            span= '+' + (imgTotal - 4)
                      //- 隐藏的剩余图片（手动 hardcode 索引 5-9）
                      .gallery-extra(style="display:none;")
                        if imgTotal >= 7
                          - var u6 = url_for(item.image[5])
                          .gallery-item: img.gallery-img(src=u6 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 5)`)
                        if imgTotal >= 8
                          - var u7 = url_for(item.image[6])
                          .gallery-item: img.gallery-img(src=u7 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 6)`)
                        if imgTotal >= 9
                          - var u8 = url_for(item.image[7])
                          .gallery-item: img.gallery-img(src=u8 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 7)`)
                        if imgTotal >= 10
                          - var u9 = url_for(item.image[8])
                          .gallery-item: img.gallery-img(src=u9 alt="image" loading="lazy" onclick=`MomentsApp.openLightbox('${imgUrls}', 8)`)

                //- 视频嵌入
                if item.video && item.video.length
                  - var vidCount = item.video.length
                  - var showVidLimit = 1
                  each vid, vidIdx in item.video
                    .moment-video(class=(vidIdx >= showVidLimit ? 'moment-video-collapsed' : ''))
                      if vid.includes('player.bilibili.com')
                        iframe(
                          src=vid
                          scrolling="no"
                          border="0"
                          frameborder="no"
                          framespacing="0"
                          allowfullscreen="true"
                        )
                      else if vid.includes('youtube.com') || vid.includes('youtu.be')
                        iframe(src=vid allowfullscreen)
                      else
                        video(src=url_for(vid) controls)
                  if vidCount > showVidLimit
                    button.moment-expand-videos-btn(
                      onclick=`MomentsApp.toggleVideos(this, ${vidCount})`
                    )
                      i.anzhiyufont.anzhiyu-icon-play
                      span= '展开更多视频（' + (vidCount - showVidLimit) + '个）'

                //- APlayer 音乐
                if item.aplayer
                  .moment-music
                    meting-js(
                      id=item.aplayer.id
                      server=item.aplayer.server
                      type="song"
                      mutex="true"
                      preload="none"
                      theme="var(--anzhiyu-main)"
                      data-lrctype="0"
                      order="list"
                    )

                //- 底部信息栏
                .moment-meta
                  .moment-meta-left
                    time.moment-time(datetime=item.date)
                      i.anzhiyufont.anzhiyu-icon-clock
                      span= item.date
                    - var addr = item.address || '佛山'
                    span.moment-location
                      i.anzhiyufont.anzhiyu-icon-location-dot
                      span= addr
                    - var dev = item.from || 'Redmi K90'
                    span.moment-device
                      i.anzhiyufont.anzhiyu-icon-gear
                      span= dev
                    if item.link
                      a.moment-link(href=url_for(item.link) title="查看详情")
                        i.anzhiyufont.anzhiyu-icon-link
                        span 链接

                  .moment-meta-right
                    button.moment-action.like-btn(
                      data-id=item.date
                      onclick=`MomentsApp.toggleLike(this, '${item.date}')`
                    )
                      i.anzhiyufont.anzhiyu-icon-heartbeat
                      span.like-count 0
                    button.moment-action.comment-btn(
                      data-id=item.date
                      data-path=momentPath
                      onclick=`MomentsApp.openComment('${idx}', '${momentPath}')`
                    )
                      i.anzhiyufont.anzhiyu-icon-comments
                      span 评论
                    button.moment-action.share-btn(
                      onclick=`MomentsApp.shareMoment('${item.content ? item.content.slice(0,30) : ''}')`
                    )
                      i.anzhiyufont.anzhiyu-icon-paper-plane

                //- 独立的 Twikoo 评论区
                .moment-comments-twikoo(
                  id='moment-comments-' + idx
                  style="display:none;"
                  data-inited="false"
                  data-path=momentPath
                )

  //- ========== Lightbox ==========
  .moments-lightbox#momentsLightbox(style="display:none;")
    .lightbox-overlay(onclick="MomentsApp.closeLightbox()")
    .lightbox-content
      img.lightbox-img#lightboxImg(src="" alt="")
      button.lightbox-prev(onclick="MomentsApp.lightboxNav(-1)")
        i.anzhiyufont.anzhiyu-icon-chevron-left
      button.lightbox-next(onclick="MomentsApp.lightboxNav(1)")
        i.anzhiyufont.anzhiyu-icon-chevron-right
      button.lightbox-close(onclick="MomentsApp.closeLightbox()")
        i.anzhiyufont.anzhiyu-icon-times
      .lightbox-counter#lightboxCounter

  //- 加载 Twikoo JS（只加载一次）
  script(src=url_for(theme.asset.twikoo))
  script.
    window.__twikooEnvId = '!{theme.twikoo.envId}';
    window.__twikooRegion = '!{theme.twikoo.region || ""}';
  script(src=url_for("/js/moments.js"))

```

> 完整 CSS 文件共 776 行。

#### 2.5 新建 JS 脚本文件

在 `\themes\anzhiyu\source\js\` 中新建 `moments.js`：

```javascript
/**
 * ============================================================
 * Hexo Anzhiyu 主题 - 朋友圈/动态页面脚本
 * 路径：themes/anzhiyu/source/js/moments.js
 * 说明：所有函数挂载在 window.MomentsApp 命名空间下，完全隔离
 * ============================================================
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'anzhiyu_moments_interact';

  // ========== 数据读写 ==========
  function loadInteract() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function saveInteract(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // ========== 点赞 ==========
  // 点赞计数存储在 localStorage 中，点击切换 liked 状态
  // 点赞时触发心形放大动画 + 5个 ❤️ 粒子扩散效果

  // ========== 评论 ==========
  // openComment(idx, path): 展开/收起 Twikoo 评论区
  // 首次点击时延迟初始化 twikoo.init()
  // 评论超过3条时自动折叠，底部显示"展开更多评论"按钮

  // ========== 视频折叠 ==========
  // toggleVideos(btn, total): 展开/收起多余视频（多于1个时）

  // ========== 图片画廊展开 ==========
  // expandGallery(overlay): 6张+图片时点击毛玻璃遮罩展开隐藏图片

  // ========== 4图轮播 ==========
  // gallery4Prev/gallery4Next: 切换主图 + 自动更新下方3张错落图
  // 使用 data-all-urls 和 data-main-idx 属性存储状态

  // ========== 分享 ==========
  // shareMoment(text): 复制动态内容到剪贴板

  // ========== Lightbox ==========
  // openLightbox / lightboxNav / closeLightbox: 全屏图片查看
  // 支持键盘 ←→ 切换，ESC 关闭

  // ========== 挂载到全局命名空间 ==========
  window.MomentsApp = {
    toggleLike: toggleLike,
    openComment: openComment,
    toggleVideos: toggleVideos,
    expandGallery: expandGallery,
    gallery4Prev: gallery4Prev,
    gallery4Next: gallery4Next,
    shareMoment: shareMoment,
    openLightbox: openLightbox,
    lightboxNav: lightboxNav,
    closeLightbox: closeLightbox
  };

  // DOM 加载完成后自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

如果您不想要我这样的样式，可以按照我的标注去修改即可，剩下的东西都是ai帮我总结的 可看可不看， 到这里其实就已经结束了，您可以根据自己的需求去修改。祝早日有自己满意的博客~


## 三、文件清单

| 文件 | 作用 | 状态 |
|------|------|------|
| `source/moments/index.md` | Hexo 页面入口 | 新建 |
| `source/_data/moments.yml` | 动态数据文件 | 新建 |
| `themes/anzhiyu/layout/moments.pug` | 页面模板（Pug） | 新建 |
| `themes/anzhiyu/source/css/moments.css` | 页面样式 | 新建 |
| `themes/anzhiyu/source/js/moments.js` | 页面脚本 | 新建 |
| `_config.anzhiyu.yml` → `menu` | 添加菜单项 | 修改 |
| `themes/anzhiyu/_config.yml` → `menu` | 添加菜单项 | 修改 |

## 四、图片画廊布局说明

| 图片数量 | 布局 | 特殊效果 |
|---------|------|---------|
| 1张 | 16:9 通栏 | 标准圆角 |
| 2张 | 上下等分，各 16:9 | 简洁纵向排列 |
| 3张 | 上1通底 + clip-path 斜切分割 + 下2并排 | 斜切分割线 |
| 4张 | 1张悬浮居中（shadow）+ 下方3张 clip-path 错落 | 左右箭头切换主图 |
| 5张 | 上横通栏斜切 + 下2×2方格 | 底部斜切边 |
| 6-9张 | 同5张布局，第5格毛玻璃遮罩 + 点击展开 | blur(4px) 毛玻璃 |

## 五、核心交互功能

1. **点赞** — localStorage 存储计数，心形放大动画 + ❤️ 粒子扩散
2. **评论** — 每条动态独立 Twikoo，首次点击懒加载，超3条自动折叠
3. **视频** — 超过1个时折叠，点击展开/收起
4. **图片查看** — 全屏 Lightbox，键盘 ←→ 切换、ESC 关闭
5. **4图切换** — 左右箭头轮播主图，下方3张自动替换
6. **6+图展开** — 点击毛玻璃遮罩展示所有图片
7. **默认值** — 地址为空→"佛山"，设备为空→"Redmi K90"
8. **暗色模式** — 通过 `[data-theme="dark"]` 自动切换配色

## 六、如何使用

1. 在 `source/_data/moments.yml` 中编辑动态内容
2. 运行 `hexo clean && hexo generate && hexo server` 三联重新构建
3. 看看你的网站有评论区的地方看看效果就知道了
4. 评论功能依赖 `_config.anzhiyu.yml` 中已配置的 Twikoo envId



CSS/JS 均在 `moments.pug` 模板内通过 `<link>` 和 `<script>` 直接引入，完全不侵入主题现有文件。

### 八、最后
  <span style="color: rgba(252, 142, 2, 1)">愿君安康，平安同乐！</span>