---
title: Twikoo 评论区博主标识实现与 QQ 邮箱踩坑记录
tags:
  - Hexo
  - Twikoo
  - AnZhiYu
  - 评论系统
categories: 博客
description: >-
  记录在 AnZhiYu 主题中实现 Twikoo 评论区博主双标的过程，以及 QQ 邮箱导致 MASTER_EMAIL_HASH
  环境变量始终不生效的踩坑经历。
ai: >-
  雨眠AI摘要帮您理解这篇文章~本文解决了Twikoo评论区添加博主标识时，官方MASTER_EMAIL_HASH环境变量对QQ邮箱无效的问题，因为QQ邮箱绕过Gravatar
  MD5体系。作者改用前端JS双重匹配（昵称+网址）方案，并提供了CSS样式，实现博主标签显示，适合QQ邮箱博主参考。
date: 2026-06-17 00:00:00
---

## 前言

最近在给博客评论区添加博主标识，想在博主评论的昵称旁边显示「博主」和「雨眠」两个标，
本以为照着教程配个 `MASTER_EMAIL_HASH` 环境变量就完事了，结果踩了一下午坑，这里哪里查了查了半天都不生效。最后发现根本原因是**QQ 邮箱在 Twikoo 中不走 Gravatar 头像体系**，导致环境变量匹配流程完全失效。

这篇记录一下最终的方案和踩坑过程。

## 最终效果

博主评论的昵称区域会显示两个标签：

```
[博主] 雨眠 [雨眠]
 ↑蓝色     ↑橙金色
```

## 方案一：MASTER_EMAIL_HASH （这个对非 QQ 邮箱有效，对 QQ 邮箱无效）

### 1. 原理

Twikoo 提供了 `MASTER_EMAIL_HASH` 环境变量，将博主邮箱做MD5后填入，Twikoo后端在返回评论数据时会比对邮箱 MD5，匹配成功的评论会自动带上 `tk-master` class，前端只需要写 CSS 即可。

### 2. 配置步骤

在 Vercel 的 Twikoo 后端项目中添加环境变量：

| Key | Value |
|-----|-------|
| `MASTER_EMAIL_HASH` | 你的邮箱MD5值（小写） |

生成MD5值的命令：

```bash
echo -n "your_email@example.com" | md5sum | awk '{print $1}'
```

### 3. 为什么不生效？QQ 邮箱的坑

Twikoo 对邮箱头像的处理逻辑是：

- **非 QQ 邮箱**：走 Gravatar，头像 URL 包含邮箱 MD5，`MASTER_EMAIL_HASH` 可以直接匹配
- **QQ 邮箱**：Twikoo 检测到 QQ 邮箱后会**直接调用 QQ 头像接口**（`q.qlogo.cn`），完全绕过了 Gravatar 的 MD5 体系

这意味着 QQ 邮箱用户的头像 URL 中根本不会出现邮箱MD5值，`MASTER_EMAIL_HASH` 永远匹配不到，`tk-master` class 也永远不会被添加。

**这是 Twikoo 的设计特点，不是 bug，但对于使用 QQ 邮箱的博主来说就是个坑。** 不管你怎么设置、怎么 Redeploy，环境变量都不可能生效，因为后端压根不会走到 MD5 比对那一步。但是我又是一个一直用qq邮箱的，也不想换一个，所以就使用前端js 的方案

## 方案二：前端 JS 双重匹配（最终采用的方案）

既然后端环境变量对 QQ 邮箱无效，那就换思路，在前端用 JS 手动给博主评论打标。

### 1. 修改 twikoo.pug

找到主题的 `layout/includes/third-party/comments/twikoo.pug`，在 `onCommentLoaded` 回调中添加匹配逻辑：

```pug
- const { envId, region, option } = theme.twikoo
- const { use, lazyload, count } = theme.comments

script.
  (() => {
    const init = () => {
      twikoo.init(Object.assign({
        el: '#twikoo-wrap',
        envId: '!{envId}',
        region: '!{region}',
        onCommentLoaded: () => {
          anzhiyu.loadLightbox(document.querySelectorAll('#twikoo .tk-content img:not(.tk-owo-emotion)'))
          // 博主标识：昵称 + 网址双重匹配
          document.querySelectorAll('#twikoo .tk-comment').forEach(comment => {
            const nick = comment.querySelector('.tk-nick')?.textContent.trim()
            const link = comment.querySelector('.tk-link')?.getAttribute('href')
            //这里可以加上你自己的判断条件
            if (nick === '你的昵称' && link === 'https://你的博客域名') {
              comment.classList.add('tk-master')
            }
          })
        }
      }, !{JSON.stringify(option)}))
    }
    // ... 后续代码省略
  })()
```

这里做了**双重匹配**：既要昵称一致，又要评论时填写的网址和你博客域名一致，防止有人冒充昵称混到博主标。

### 2. 添加 CSS 样式

新建或修改 `source/css/_extra/twikoo-badge.css`（AnZhiYu 主题会自动引入 `_extra/` 下的所有 CSS）：

```css
/* 「博主」标识 — 昵称前面，蓝色 */
.tk-comment.tk-master .tk-nick::before {
  content: "博主";
  display: inline-block;
  margin-right: 6px;
  padding: 1px 8px;
  font-size: 0.68rem;
  font-weight: 500;
  background: linear-gradient(135deg, #4A90D9, #357ABD);
  color: #fff;
  border-radius: 10px;
  vertical-align: middle;
}

/* 「雨眠」标识 — 昵称后面，橙金色 */
.tk-comment.tk-master .tk-nick::after {
  content: "雨眠";
  display: inline-block;
  margin-left: 6px;
  padding: 1px 8px;
  font-size: 0.68rem;
  font-weight: 500;
  background: linear-gradient(135deg, #F2B94B, #FF8C42);
  color: #fff;
  border-radius: 10px;
  vertical-align: middle;
}
```

可以按自己喜欢修改颜色和文字。

### 最后
  <span style="color: rgba(252, 142, 2, 1)">愿君安康，平安同乐！</span>