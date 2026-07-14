---
title: 混元模型免费用？如何使用
cover: https://yuumii.top/article/TencentHY3Free/hunYuanCover.png
categories: 工具推荐
tags:
  - 混元
  - AI
keywords: Trae,混元,AI编程,IDE,腾讯混元,免费模型
description: 
ai: >-
date: 2026-07-10 14:00:00
---

## 前言

有一段时间一直在用Trae+Deepseek编码，这个博客有些就是出自他们之手，这两天听说<span style="color: rgba(53, 163, 241, 1)">腾讯混元</span>有个限时免费活动，能到7.21，立马就去找了一下，满打满算还有一周多，快的话能写个好玩的小玩意出来了<span style="color: rgba(252, 142, 2, 1)">白嫖</span> 混元来写代码，我这边使用的是<span style="color: rgba(252, 142, 2, 1)">Trae Work</span> 来接入，其他的软件大差不差，操作都是差不多。
![Trae页面](https://yuumii.top/article/TencentHY3Free/Trae.png)

## 腾讯混元HY3啥来头

<span style="color: rgba(53, 163, 241, 1)">混元</span> 是腾讯自研的最新发布的大模型，于7.6号上线。然后最近腾讯搞了个活动，混元模型 <span style="color: rgba(52, 168, 83, 1)">免费调用</span>，对于个人开发者来说基本够用了。
以下参数来自官网：
| 参数 | 数值 |
|:---|:---|
| **架构** | MoE（混合专家模型） |
| **总参数** | 295B |
| **激活参数** | 21B |
| **上下文** | 256K |
| **最大输入** | 192K |
| **最大输出** | 128K |
| **API 调用名** | `hy3` |
| **版本更新** | 2026-07-06 |

---

## Trae接入混元

官网在这里：{% btn 'https://www.trae.com.cn/', 去Trae官网, anzhiyufont anzhiyu-icon-circle-arrow-right, larger %}


### 第一步：获取混元的 API Key

先去腾讯混元的官网接入，他其实会提示你去腾讯云的控制台搞一个或者是去OpenRouter，我这边选择的是<span style="color: rgba(66, 133, 244, 1)">OpenRouter </span>

这个是OpenRouter链接和腾讯混元的官网链接：
{% btn 'https://openrouter.ai/workspaces/default/keys', OpenRouter官网, anzhiyufont anzhiyu-icon-circle-arrow-right, larger %}

{% btn 'https://aistudio.tencent.com/', 腾讯混元官网, anzhiyufont anzhiyu-icon-circle-arrow-right, larger %}

先完成注册之后按照我下面的步骤操作：
首先在APIKey一栏New一个key，复制下来保存好。这个Key就是后续我们用来连接混元模型的凭证。
![OpenRouter添加Model](https://yuumii.top/article/TencentHY3Free/openRouter.png)

![Key](https://yuumii.top/article/TencentHY3Free/Key.png)
### 第二步：在Trae中添加自定义模型

打开 Trae，点击左下角的设置 → 找到模型设置：

1. 点击 <span style="color: rgba(66, 133, 244, 1)">添加模型</span>
2. 选择 <span style="color: rgba(52, 168, 83, 1)">模型服务商</span> 的方式
3. 往下翻找到 <span style="color: rgba(53, 163, 241, 1)">OpenRouter，选择其他其他</span>，然后模型id填入<span style="color: rgba(53, 163, 241, 1)">tencent/hy3:free</span>这个不能填错喔
![添加model](https://yuumii.top/article/TencentHY3Free/addModel.png)
4. 下面的凭证填上刚刚复制的 API Key
5. 保存即可

这样就配置好了，简单吧？

配置成功之后，在 Trae 的 AI 对话输入框右下角点击模型切换，就能看到混元了，直接选上就能用。

## 最后

<span style="color: rgba(187, 50, 241, 1)">愿君安康，平安同乐！</span>
