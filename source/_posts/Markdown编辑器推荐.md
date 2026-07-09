---
title: Markdown编辑器推荐
cover: https://obsidian.md/images/obsidian-logo-gradient.svg
categories: 工具推荐
tags:
  - Markdown
keywords: Markdown编辑器,Typora,Notion,Obsidian,IMA,腾讯ima,在线Markdown
description: 
ai: >-

date: 2026-07-09 14:00:00
---

## 前言

MD编辑器一直找不到一款心满意足的，主要是我需要一款可以支持上传图片到<span style="color: rgba(66, 133, 244, 1)">R2</span>的工具，以前一直用的<span style="color: rgba(53, 163, 241, 1)">Typora</span>（破解版），最近想找一下有没有更好的<span style="color: rgba(66, 133, 244, 1)">MD编辑器</span> 推荐，于是就去网上搜罗了一番，找了几款还可以的，其中有已经很出名的好用的几个软件，也体验了一些个人开源的MD编辑器，总体体验下来各有花样，不过既然都这样了，那就写篇文章推荐一下几个，也好以后看看用不用得上的Markdown

这段时间前前后后换了不知道多少个编辑器，最后挑出几款觉得还可以的，各有各的侧重点，也各有各的不可替代性。

---

## Typora — 最纯粹的写作体验

<span style="color: rgba(53, 163, 241, 1)">Typora</span>应该是我接触Markdown的第一款编辑器。如果你稍微有接触Markdown格式的文件，相信你一定听过这个软件，它最大的特点就是 <span style="color: rgba(53, 163, 241, 1)">**所见即所得**</span>，写着很舒服，<span style="color: rgba(66, 133, 244, 1)">沉浸感</span>很强，而且界面也<span style="color: rgba(52, 168, 83, 1)">简洁</span>，知名度其实已经很高了不需要我过多推荐

### 优点

| 方面 | 体验 |
|:---|:---|
| **编辑体验** | <span style="color: rgba(52, 168, 83, 1)">极简</span>，纯粹就是为了写作而生的|
| **实时预览** | <span style="color: rgba(66, 133, 244, 1)">原生支持</span>|
| **支持格式** | 几乎全覆盖，表格、代码块、数学公式、流程图，基本上该有的都有 |
| **图片处理** | 支持图片拖入并自动复制到指定目录，配合自定义脚本可以实现<span style="color: rgba(52, 168, 83, 1)">图床上传</span> |

对，<span style="color: rgba(52, 168, 83, 1)">图床上传</span>这个需要说一下。Typora本身是支持<span style="color: rgba(52, 168, 83, 1)">自定义命令</span>的，你写文章的时候直接把图片拖进去，它会自动调用你配置的上传脚本把图片传到图床，然后把本地路径替换成远程链接。配合<span style="color: rgba(66, 133, 244, 1)">PicGo</span>或者自己写个脚本，一套流程下来基本不用手动管图片的事情。

### 缺点

- 虽然是免费的，但是严格来说是<span style="color: rgba(234, 67, 53, 1)">收费软件</span>（$14.9 买断），不过国内早期版本还能用
- 没有<span style="color: rgba(234, 67, 53, 1)">云同步</span>，不支持多端协作
- 干净也就意味着没有过多的功能 有些图床还得靠工具才能上传


---

## md.openwrite.cn — 在线编辑的惊喜

![openwrite](https://yuumii.top/article/MDToolsShare/openwrite%E7%95%8C%E9%9D%A2.png)


openwrite这个是我以前就用过一段时间的，网址是<span style="color: rgba(66, 133, 244, 1)">md.openwrite.cn</span>。这是<span style="color: rgba(53, 163, 241, 1)">WeWe-RSS</span> 开发团队做的一个在线 Markdown 编辑器，刚用的时候确实给我带来了惊喜，<span style="color: rgba(52, 168, 83, 1)">网页编辑</span>、<span style="color: rgba(66, 133, 244, 1)">实时预览</span>、支持多个<span style="color: rgba(52, 168, 83, 1)">图床上传</span>、导出格式等。方便了很多，如果你是写<span style="color: rgba(100, 100, 100, 1)">微信公众号</span>文章，用这个会有很大的惊喜喔~

### 优点

| 方面 | 体验 |
|:---|:---|
| **编辑体验** | 超级超级超级干净的<span style="color: rgba(66, 133, 244, 1)">双栏布局</span>，左边写右边预览 |
| **实时预览** | <span style="color: rgba(52, 168, 83, 1)">肯定是支持的</span>|
| **图床上传** | 内置了图床上传功能，支持<span style="color: rgba(52, 168, 83, 1)">多种图床</span>，配置好了粘贴即上传 |
| **便捷性** | 浏览器打开就能用，不需要安装，适合<span style="color: rgba(66, 133, 244, 1)">临时</span>写东西 |

最让我惊喜的是它的<span style="color: rgba(52, 168, 83, 1)">图床上传体验</span>，内置了多种图床方案，配置一次之后截图粘贴就能自动上传，<span style="color: rgba(252, 142, 2, 1)">神了</span>。

### 缺点

- 毕竟是 Web 应用，<span style="color: rgba(234, 67, 53, 1)">离线不可用</span>（我对于软件有一种莫名的固执其实，我不是很喜欢网页端干活） 但是这并不影响他成为我这次体验下来<span style="color: rgba(66, 133, 244, 1)">最好的MD编辑器</span>。

---


## Obsidian 

<span style="color: rgba(171, 71, 188, 1)">Obsidian</span>这款是我最近体验下来最给我<span style="color: rgba(171, 71, 188, 1)">眼前一亮</span>的，首先这个<span style="color: rgba(66, 133, 244, 1)">图标</span>的设计我就特别喜欢，这里我要专门贴张图片出来哈哈哈，然后功能也是应有尽有，特别是那个<span style="color: rgba(171, 71, 188, 1)">关系链</span>，我也是第一次体验到，很多没想到的功能都有，有一种<span style="color: rgba(252, 142, 2, 1)">原来还能这样玩</span>的感觉。

![Obsidian](https://obsidian.md/images/obsidian-logo-gradient.svg)

![Obsidian](https://yuumii.top/article/MDToolsShare/obsidian.png)



### 原生体验


- **<span style="color: rgba(171, 71, 188, 1)">关系图谱</span>**：这是Obsidian最大的特色，你能看到所有笔记之间的链接关系，像一个<span style="color: rgba(66, 133, 244, 1)">知识网络</span>一样铺开，而且我是第一次体验这个功能，真的给我眼前一亮
- **<span style="color: rgba(52, 168, 83, 1)">双向链接</span>**：输入 `[[双链]]` 就能把笔记串起来，形成知识之间的关联
- **<span style="color: rgba(66, 133, 244, 1)">本地优先</span>**：所有数据都在本地，是一个个 `.md` 文件，不存在跑路风险
- **<span style="color: rgba(252, 142, 2, 1)">标签 + 文件夹</span>**：双重分类体系，既有层级又有标签系统

### 插件生态

Obsidian的<span style="color: rgba(66, 133, 244, 1)">插件市场</span>已经有很多很好用的插件了，对我来说目前这些插件很多是用不上的，体验也体验不完其实，但是确实有这个插件功能给了Obsidian<span style="color: rgba(171, 71, 188, 1)">无限的可能性</span>。
但我想说的是——<span style="color: rgba(53, 163, 241, 1)">即使不装任何插件</span>，光是原生Obsidian就已经足够好用了。插件只是<span style="color: rgba(52, 168, 83, 1)">锦上添花</span>~
因为我这次主要是奔着<span style="color: rgba(52, 168, 83, 1)">图床</span>来的，我不知道是没有配置对，还是因为图床的问题，我的图片始终上传不了<span style="color: rgba(66, 133, 244, 1)">R2</span>，，，，，还得再研究一下

### 缺点

- <span style="color: rgba(66, 133, 244, 1)">同步功能</span>是收费的，$5/月
- 功能多，插件多就容易<span style="color: rgba(234, 67, 53, 1)">眼花缭乱</span>，也就是上手门槛还是高点的

适合场景：<span style="color: rgba(171, 71, 188, 1)">写笔记、建个人知识库、长期积累写作内容</span>，Obsidian 是目前最让我觉得"笔记真的能积累成体系"的工具。

---

## IMA 

<span style="color: rgba(233, 30, 99, 1)">IMA</span>，可能很多人还没用过，但它是<span style="color: rgba(233, 30, 99, 1)">腾讯</span>出品的一款 <span style="color: rgba(233, 30, 99, 1)">AI的MD编辑器</span>，集笔记、<span style="color: rgba(66, 133, 244, 1)">知识库</span>、<span style="color: rgba(52, 168, 83, 1)">AI 问答</span>于一体。我也是最近才开始用的。

IMA 不是单纯的 Markdown 编辑器，它是一个 <span style="color: rgba(66, 133, 244, 1)">AI + 知识库 + 笔记</span> 的结合体。你可以把它理解为：
- 一个有 AI 加持的 <span style="color: rgba(100, 100, 100, 1)">Notion</span>
- 一个自带知识库的 <span style="color: rgba(171, 71, 188, 1)">Obsidian</span>
- 一个能跟你对话的笔记软件

还有<span style="color: rgba(52, 168, 83, 1)">多端同步</span>，<span style="color: rgba(66, 133, 244, 1)">共享知识库</span>等等

![IMA](https://yuumii.top/article/MDToolsShare/ima.png)

---

### Markdown 编辑体验

IMA 的笔记功能是原生支持 <span style="color: rgba(52, 168, 83, 1)">Markdown 语法</span>的，标题、列表、代码块、表格这些都属基础了，编辑界面非常<span style="color: rgba(52, 168, 83, 1)">简洁干净</span>，我用着觉得还是挺舒服的。写笔记的时候直接输语法就能<span style="color: rgba(66, 133, 244, 1)">实时渲染</span>，体验跟Typora有点像，但多了一个<span style="color: rgba(66, 133, 244, 1)">侧边栏</span>来管理笔记结构。

### AI 

IMA内置了<span style="color: rgba(66, 133, 244, 1)">多种AI</span>，你也可以<span style="color: rgba(52, 168, 83, 1)">自定义AI</span>，写博客的话 有些时候让ai给你搭一个框架写起来还是特别舒服的，而且 体验一下有以下这些我觉得还是很有帮助的

| 功能 | 体验 |
|:---|:---|
| **智能问答** | 基于你<span style="color: rgba(66, 133, 244, 1)">知识库</span>的内容回答问题 |
| **AI写作** | 给个主题就能生成文章，还能选择写作框架 <span style="color: rgba(252, 142, 2, 1)">写博客利器</span>说是 |
| **文档解读** | 上传PDF/Word 文档，AI帮你总结要点 这个我觉得<span style="color: rgba(52, 168, 83, 1)">特别好用</span> |
| **图片识别** | 截图提问，跟上面文档一样，属于是<span style="color: rgba(171, 71, 188, 1)">亮点功能</span>了 |

### 知识库功能

IMA的核心就是 <span style="color: rgba(66, 133, 244, 1)">个人知识库</span>。你可以把文档、公众号文章、网页内容统统丢进去，然后基于这些内容向 AI 提问。比如你丢几十篇博客进去，问"这些博客里的写作风格是怎么样的，帮我设计一个新的关于xx文章框架"，AI就能从你的知识库里提取信息，并且帮你完成。
而且<span style="color: rgba(52, 168, 83, 1)">微信公众号</span>文章可以直接<span style="color: rgba(66, 133, 244, 1)">一键导入</span>到知识库


### 缺点

部分功能还是有点<span style="color: rgba(234, 67, 53, 1)">限制</span>，只能说好用挺好用，多尝试一下吧

适合场景：想搭建<span style="color: rgba(66, 133, 244, 1)">个人知识库</span>这个几乎是最好的。

---

## Notion —

<span style="color: rgba(100, 100, 100, 1)">Notion</span> 其实已经不能单纯叫 Markdown 编辑器了，它更像是一个<span style="color: rgba(100, 100, 100, 1)">团队的工作台</span>。笔记、文档、数据库、看板、项目管理什么都能做。（但是其实我<span style="color: rgba(234, 67, 53, 1)">用不习惯</span>这个,体验的时间不长）

![Notion](https://yuumii.top/article/MDToolsShare/notion.png)

### 优点

| 方面 | 体验 |
|:---|:---|
| **编辑体验** | 块编辑器，<span style="color: rgba(66, 133, 244, 1)">拖拽排版</span>非常爽，支持 Markdown 快捷语法 |
| **实时预览** | 本身就是渲染模式，<span style="color: rgba(52, 168, 83, 1)">所见即所得</span> |
| **数据库** | 支持创建自定义数据库，每个数据库可以有多个表格视图、看板视图、画廊视图等 |
| **协作分享** | <span style="color: rgba(52, 168, 83, 1)">多人协作</span>很强，分享链接就能让对方查看或编辑 |
| **跨平台** | 全平台支持，Web / 桌面 / 移动端体验一致 |

### 缺点

- 网络问题……<span style="color: rgba(234, 67, 53, 1)">国内访问略慢</span>，有时候加载半天
- Markdown听说导出到其他平台会有<span style="color: rgba(234, 67, 53, 1)">格式问题</span>
- 不支持本地存储，全部在云端，<span style="color: rgba(234, 67, 53, 1)">离线功能有限</span>
- 没有真正的图床功能，图片上传后存在 Notion 自己的 CDN，迁移时图片链接会失效
- 而且免费版上传图片有<span style="color: rgba(234, 67, 53, 1)">大小限制</span>

适合场景：<span style="color: rgba(100, 100, 100, 1)">做项目文档、团队协作、个人知识库</span>

---

## 最后

<span style="color: rgba(252, 142, 2, 1)">愿君安康，平安同乐！</span>
