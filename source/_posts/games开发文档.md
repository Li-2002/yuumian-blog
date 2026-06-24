---
title: 游戏人生(games)页面开发文档
top_img: https://yuumii.top/about/about6-yanyun.jpg
cover: https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/Logo.png
categories: 博客
tags: Hexo新页面
keywords: games
description: 游戏人生(games)页面开发文档
top: 99
ai: >-
  雨眠AI摘要帮您理解这篇文章~本文介绍了在Anzhiyu主题中开发游戏人生页面的步骤，包括修改PUG模板、新建页面和数据文件，实现游戏收藏卡片式分组展示，支持YAML管理数据与评论系统。
---

# 游戏人生(games)页面开发文档-Anzhiyu主题

## 一、功能概述

### 1、了解该页面
展示游戏收藏列表的独立页面，支持多分类分组展示。每个游戏以卡片形式呈现，包含封面图、名称、规格、描述和支持链接。数据通过 YAML 文件管理，支持评论系统。

- 页面路径：`/games/`
- 数据来源：`source/_data/games.yml`

### 2、查看效果

新增页面这种东西，肯定要先看看效果好不好再决定要不要啦！
<a href="/games/" target="_blank" style="display:inline-flex;align-items:center;gap:8px;padding:8px 24px;background:linear-gradient(135deg,#425AEF,#6C83F7);color:#fff;font-size:0.95rem;font-weight:600;border-radius:50px;text-decoration:none;position:relative;overflow:hidden;transition:all 0.35s cubic-bezier(0.25,0.8,0.25,1);box-shadow:0 4px 12px rgba(66,90,239,0.25);" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(66,90,239,0.4)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px rgba(66,90,239,0.25)';">
  <i class="anzhiyufont anzhiyu-icon-arrow-circle-right" style="font-size:1rem;transition:transform 0.35s ease;"></i>
  <span>游戏人生</span>
</a>

## 二、实现步骤

### 1、修改文件

在 `\themes\anzhiyu\layout\page.pug` 中新增以下内容：

```diff
      when 'equipment'
        include includes/page/equipment.pug
+     when 'games'
+       include includes/page/games.pug
      default
        include includes/page/default-page.pug
```




---

### 2、新建文件

#### 2.1 新建 PUG 页面文件

在 `\themes\anzhiyu\layout\includes\page\` 中新建 `games.pug` 并写入以下内容：

```pug
if site.data.games
    each i in site.data.games
      .author-content.author-content-item.GamesPage.single(style = `background: url(${i.top_background}) left 37% / cover no-repeat !important;`)
        .card-content
          .author-content-item-tips=i.class_name
          span.author-content-item-title=i.description
          .content-bottom
            .tips=i.tip
          .banner-button-group
            a.banner-button(href=i.buttonLink)
              i.anzhiyufont.anzhiyu-icon-arrow-circle-right(style='font-size: 1.3rem')
              span.banner-button-text=i.buttonText
      each item in i.good_games
        .goodgames-item
          h2.goodgames-title= item.title
          .goodgames-item-description= item.description
          .games-item
            .games-item-content
              each iten, indey in item.games_list
                .games-item-content-item
                  .games-item-content-item-cover
                    img.games-item-content-item-image(data-lazy-src=url_for(iten.image) onerror=`this.onerror=null;this.src='` + url_for(theme.error_img.flink) + `'` alt=iten.name)
                  .games-item-content-item-info
                    .games-item-content-item-name(onclick=`rm.rightmenuCopyText("${iten.name}");anzhiyu.snackbarShow("${_p('Snackbar.copy_games_name') + " 【" + iten.name + "】"}");` title=iten.name)= iten.name
                    .games-item-content-item-specification= iten.specification
                    .games-item-content-item-description= iten.description
                    .games-item-content-item-toolbar
                      if iten.link.includes('https://') || iten.link.includes('http://')
                        a.games-item-content-item-link(href= iten.link, target='_blank') 详情
                        .bber-reply(onclick="rm.rightMenuCommentText(" + `'${iten.name + " " + iten.specification + " " + iten.description}'` + ")")
                          i.anzhiyufont.anzhiyu-icon-message
                      else  
                        a.games-item-content-item-link(href= iten.link, target='_blank') 查看文章
                        .bber-reply(onclick="rm.rightMenuCommentText(" + `'${iten.name + " " + iten.specification + " " + iten.description}'` + ")")
                          i.anzhiyufont.anzhiyu-icon-message
```

#### 2.2 新建 YML 数据文件

在 `\source\_data\` 中新建 `games.yml` 并参考以下格式填写：

```yaml
- class_name: 游戏人生
  description: 我的游戏世界
  tip: 跟 雨眠 一起探索第九艺术
  top_background: https://th.bing.com/th/id/R.13a97ef4830efa5e0b87134d622719f3?rik=G7RaJFpxg5PtkA&riu=http%3a%2f%2fupload.techweb.com.cn%2fs%2f640%2f2019%2f0530%2f1559208230699.jpg&ehk=j1G8rMX98TRX52EkLgI5jW1p7lIQp4I8Si1nqEggFRs%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1
  buttonText: Steam
  buttonLink: https://steamcommunity.com/
  good_games:
    - title: 剧情超绝
      description: 只羡鸳鸯 不羡仙 
      games_list:
        - name: 艾尔登法环
          specification: Elden Ring.
          description: "即使引导早已破碎，也请您当上艾尔登之王"
          image: https://cdn.max-c.com/heybox/dailynews/img/94376ca41326836587a137d5999733e5.jpg
          link: https://www.xiaoheihe.cn/games/detail/582010
        - name: 燕云十六声
          specification: 松子糖.
          description: "苍生无言，侠为其声"
          image: https://cdn.max-c.com/heybox/dailynews/img/94376ca41326836587a137d5999733e5.jpg
          link: https://www.xiaoheihe.cn/games/detail/582010
        - name: 黑神话悟空
          specification: 只怕你聋了耳，又乱了心，越是贪图圆满，越是搜不干净.
          description: "小猴子你听，那风里传来的，都是求而不得的声音"
          image: https://cdn.max-c.com/heybox/dailynews/img/94376ca41326836587a137d5999733e5.jpg
          link: https://www.xiaoheihe.cn/games/detail/582010  

    - title: 武侠江湖
      description: 桃李春风一杯酒，江湖夜雨十年灯
      games_list:
        - name: 永劫无间
          specification: 武侠游戏之首
          description: 我身无拘 武道无穷
          image: https://imgheybox.max-c.com/heybox/game/header/271590_dXCCk.jpg
          link: https://www.xiaoheihe.cn/games/detail/271590

    - title: 风景超绝
      description: 万物都是自由诗
      games_list:
        - name: 地平线4
          specification: Xbox
          description: 你知道，我真的爱你，句句不轻易~
          image: https://imgheybox.max-c.com/heybox/game/header/271590_dXCCk.jpg
          link: https://www.xiaoheihe.cn/games/detail/271590
```

**字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `class_name` | 字符串 | 页面顶部大标题 |
| `description` | 字符串 | Banner 副标题 |
| `tip` | 字符串 | Banner 底部小字提示 |
| `top_background` | 字符串 | Banner 背景图片 URL |
| `buttonText` | 字符串 | Banner 右下角按钮文字 |
| `buttonLink` | 字符串 | Banner 按钮跳转链接 |
| `good_games` | 数组 | 游戏分组列表 |

**good_games 内字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | 字符串 | 分组标题 |
| `description` | 字符串 | 分组描述 |
| `games_list` | 数组 | 该分组下的游戏列表 |

**games_list 内字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | 字符串 | 游戏名称 |
| `specification` | 字符串 | 游戏规格/厂商信息 |
| `description` | 字符串 | 游戏描述 |
| `image` | 字符串 | 游戏封面图片 URL |
| `link` | 字符串 | 详情链接（http开头为外部链接，否则为站内文章） |

#### 2.3 新建 MD 页面文件

在 `\source\games\` 中新建 `index.md` 并按以下格式填写：

```markdown
---
title: 游戏人生
date: 2023-05-07 21:07:54
type: games
aside: false
comments: true
top_img: false
---
```

#### 2.4 新建 Stylus 样式文件

在 `\themes\anzhiyu\source\css\_page\` 中新建 `games.styl` 并写入以下内容：

```stylus
// 游戏世界
.goodgames-title
  margin: 1rem 0
  line-height: 1;
.games-item
  .games-item-content
    display: flex
    flex-direction: row
    flex-wrap: wrap
    margin: 0 -8px
    .games-item-content-item
      width: calc(25% - 12px)
      border-radius: 12px
      border: var(--style-border-always)
      overflow: hidden
      margin: 8px 6px
      background: var(--anzhiyu-card-bg)
      box-shadow: var(--anzhiyu-shadow-border)
      min-height: 400px
      position: relative
      +maxWidth1200()
        width: calc(50% - 12px)
      +maxWidth768()
        width: 100%
      
      .games-item-content-item-info
        padding: 8px 16px 16px 16px
        margin-top: 12px

      .games-item-content-item-name
        font-size: 18px
        font-weight: bold
        line-height: 1
        margin-bottom: 8px
        white-space: nowrap
        overflow: visable
        text-overflow: ellipsis
        width: fit-content
        cursor pointer
        &:hover
          color: var(--anzhiyu-main)

      .games-item-content-item-specification
        font-size: 12px
        color: var(--anzhiyu-secondtext)
        line-height: 16px
        margin-bottom: 5px
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis

      .games-item-content-item-description
        line-height: 20px
        color: var(--anzhiyu-secondtext)
        height: 60px
        display: -webkit-box
        overflow: hidden
        -webkit-line-clamp: 3
        -webkit-box-orient: vertical
        font-size: 14px

      a.games-item-content-item-link
        font-size: 12px
        background: var(--anzhiyu-gray-op)
        padding: 4px 8px
        border-radius: 8px
        cursor: pointer

        &:hover
          background: var(--anzhiyu-main)
          color: var(--anzhiyu-white)

      .games-item-content-item-cover
        width: 100%
        height: 200px
        background: var(--anzhiyu-secondbg)
        display: flex
        justify-content: center
        align-items: center;

      img.games-item-content-item-image
        object-fit: cover
        height: 100%
        width: 100%
       // border-radius: 0 
       // 若需要去除图片圆角可以将这里的注释去掉

      .games-item-content-item-toolbar
        display: flex
        justify-content: space-between
        position: absolute
        bottom: 12px
        left: 0
        width: 100%
        padding: 0 16px

// 页面背景和样式重置
body[data-type="games"] #web_bg
  background: var(--anzhiyu-background);
body[data-type="games"] #page
  border: 0;
  box-shadow: none !important;
  padding: 0 !important;
  background: 0 0 !important;
body[data-type="games"] #page .page-title
  display: none;
```

---

## 三、文件清单

| 文件 | 作用 | 状态 |
|------|------|------|
| `source/games/index.md` | Hexo 页面入口 | 新建 |
| `source/_data/games.yml` | 游戏数据文件 | 新建 |
| `themes/anzhiyu/layout/includes/page/games.pug` | 页面模板 | 新建 |
| `themes/anzhiyu/source/css/_page/games.styl` | 页面样式 | 新建 |
| `themes/anzhiyu/layout/page.pug` | 添加 `when 'games'` 分支 | 修改 |

## 四、响应式布局

| 屏幕宽度 | 每行卡片数 |
|---------|----------|
| > 1200px | 4 列 |
| 768px - 1200px | 2 列 |
| < 768px | 1 列 |

## 五、交互功能

- **点击游戏名称** — 复制游戏名到剪贴板并弹出 Snackbar 提示
- **点击消息图标** — 引用游戏信息到评论区
- **点击详情按钮** — 外部链接新窗口打开，站内链接跳转文章

## 六、如何使用

1. 在 `source/_data/games.yml` 中编辑游戏数据
2. 按 `good_games` → `games_list` 的层级结构组织游戏
3. 运行 `hexo generate` 重新构建
4. 访问 `https://你的域名/games/` 查看效果
5. 评论功能由主题配置的 `comments.use` 决定（Twikoo/Waline/Valine/Artalk）

## 七、注意事项

1. `games.yml` 中 YAML 缩进必须使用两个空格，不能使用 Tab
2. 游戏封面图片建议使用直链，避免跨域问题
3. `description` 字段超出 3 行会自动截断（`-webkit-line-clamp: 3`）
4. 页面标题（`page-title`）已被 `display: none` 隐藏，Banner 自带标题