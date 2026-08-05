---
title: TIFF图片格式详解
categories: 技术
tags:
  - 图片格式
  - TIFF
  - 学习笔记
keywords: TIFF,图片格式,无损压缩,图像处理,印刷
ai: >-
description: 关于TIFF图片格式的详细介绍
date: 2026-07-28 20:00:00
---
# TIFF 图片格式详解

{% p center logo large, 先说点 <span style="color: rgba(66, 133, 244, 1)">背景</span> %}

如果你接触过<span style="color: rgba(66, 133, 244, 1)">印刷、扫描、摄影后期或者是地图之类的</span>这些行业，那你大概率会经常看到一个后缀 `.tif` 或者 `.tiff` 的文件。这就是我们今天的主角——{% label TIFF blue %}。

TIFF 全称是 <span style="color: rgba(66, 133, 244, 1)">Tagged Image File Format</span>（标签图像文件格式），1986 年由 Aldus 公司推出，后来 Aldus 被 Adobe 收购，所以现在版权在 Adobe 手里。它从诞生到现在已经<span style="color: rgba(240, 110, 35, 1)">快 40 年</span>了，但是依然活跃在专业领域的一线，可以说是图片格式界的"老古董活化石"

---

{% p center logo large, TIFF 到底 <span style="color: rgba(66, 133, 244, 1)">有什么特点</span>%}

### 无损压缩

TIFF 最大的特点就是<span style="color: rgba(66, 133, 244, 1)">无损</span>。它支持两种存储方式：
- {% label 不压缩 blue %}：直接存原始像素数据，画质 100% 保留
- {% label LZW 压缩 blue %}：一种无损压缩算法，体积变小但画质完全不变

这意味着你把一张 TIFF 反复保存一万次，画质还是和第一次一模一样。而 JPEG 每保存一次就会损失一点细节，这就是所谓的<span style="color: rgba(240, 110, 35, 1)">"有损压缩"</span>。

### 恐怖的色深

普通图片一般是 8bit 色深，也就是每个颜色通道 256 个级别。TIFF 最高支持<span style="color: rgba(66, 133, 244, 1)">32bit 浮点</span>色深，也就是每个通道可以有几十亿个级别。

这就意味着在<span style="color: rgba(66, 133, 244, 1)">渐变色</span>特别多的场景（比如天空、雾霾、夜晚灯光），TIFF 不会出现那种明显的"色带断层"，而 8bit 的 JPEG 很容易看出来一圈圈的条纹。

### 支持图层和透明通道

TIFF 是支持<span style="color: rgba(66, 133, 244, 1)">图层的</span>！在 Photoshop 里你可以把 PSD 另存为 TIFF，图层信息会保留下来。这点对设计工作流来说非常友好。

而且它还支持 <span style="color: rgba(66, 133, 244, 1)">Alpha 透明通道</span>和 <span style="color: rgba(66, 133, 244, 1)">CMYK 色彩模式</span>——CMYK 是印刷行业的标配色彩空间，这也是为什么印刷厂都爱用 TIFF。

### 多页存储

TIFF 还能像 PDF 一样把一个文件里存<span style="color: rgba(240, 110, 35, 1)">多页内容</span>。扫描仪扫描一份几十页的合同，可以直接输出成一个多页 TIFF 文件，这功能在<span style="color: rgba(66, 133, 244, 1)">档案管理、传真、OCR</span>领域简直不要太实用。

---

{% p center logo large, TIFF 的 <span style="color: rgba(240, 110, 35, 1)">致命缺点</span> %}

说完了优点，也得说说它的缺点，毕竟世界上没有完美的格式。

### 文件体积巨大

这是 TIFF 最大的痛。一张 5000 万像素的照片存成 TIFF，体积轻松<span style="color: rgba(240, 110, 35, 1)">上百 MB</span>，存成不压缩的 TIFF 甚至能上 GB。对比一下，同样内容的 JPEG 可能只要 5-10MB。

### 浏览器支持差

你如果在浏览器里直接打开一个 `.tif` 文件，大概率只能看到一个下载提示框。主流浏览器（Chrome、Firefox、Edge）<span style="color: rgba(66, 133, 244, 1)">都不支持直接预览 TIFF</span>，必须借助第三方插件或者本地软件。

所以 TIFF 几乎不可能用于网页图片，这也是它被称为"专业格式"的原因之一。

### 兼容性偶尔翻车

虽然 TIFF 叫"标准格式"，但因为<span style="color: rgba(66, 133, 244, 1)">Tag 机制太灵活</span>，不同软件写出来的 TIFF 偶尔会不兼容——A 软件存的文件 B 软件打不开，这种破事在摄影圈经常被吐槽。

---







---

{% p center logo large, TIFF 在地图、导航行业的 <span style="color: rgba(66, 133, 244, 1)">妙用</span> %}

TIFF 在普通人的生活里存在感不高，但在<span style="color: rgba(66, 133, 244, 1)">地图、导航、测绘</span>这些行业里，它可是<span style="color: rgba(240, 110, 35, 1)">硬通货</span>般的存在，甚至可以说没有 TIFF 就没有今天的地图应用。

### GeoTIFF：会定位的 TIFF

普通 TIFF 只是一张图，但给它加上地理信息的标签之后，就变成了 <span style="color: rgba(66, 133, 244, 1)">GeoTIFF</span>——文件里每一个像素都绑定了真实世界的坐标。你拿到一张 GeoTIFF，软件可以直接告诉你"这个像素对应的经纬度是多少"（这里的"会定位"不是简单的坐标写在文件名里，而是每个像素都有严格的地理参照，可以直接和卫星定位数据对上）。

目前全球主流的<span style="color: rgba(66, 133, 244, 1)">卫星遥感影像</span>（比如 Landsat、哨兵系列）的分发格式就是 GeoTIFF，科研和商业用户下载下来直接就能用。

### 高程数据 DEM

地图上的海拔起伏怎么来的？很多就是靠 TIFF 存的 <span style="color: rgba(66, 133, 244, 1)">DEM（数字高程模型）</span>。它用 TIFF 的灰度值来表示地形：白色是高山、黑色是洼地，每个像素的值就是精确到米的真实海拔。

SRTM 全球高程数据、国内的测绘成果，基本都是这种格式。你在地图 App 里看到的等高线、山体阴影效果，背后都是它算出来的。

### 多波段遥感数据

TIFF 支持<span style="color: rgba(66, 133, 244, 1)">多波段</span>存储，一个文件里能同时塞下可见光、红外、近红外等好几个通道的数据。这个特性让它在<span style="color: rgba(240, 110, 35, 1)">农业监测、气象分析、森林火情预警</span>这些领域成了香饽饽——同一个区域，不同波段叠加起来分析，能看出很多东西。

### 高精地图与自动驾驶

现在地图应用和自动驾驶都在卷<span style="color: rgba(66, 133, 244, 1)">高精地图</span>，而高精地图的底层数据很多就是 GeoTIFF 格式。车道级导航、海拔起伏提示、桥梁隧道识别，背后都有 TIFF 家族在默默工作。

> 有意思的是，TIFF 的缺点（体积大）在别的领域是痛点，在地图行业反而是优点——因为测绘数据要求的就是<span style="color: rgba(240, 110, 35, 1)">无损、精确、不丢任何细节</span>，大就大吧，反正也不靠浏览器预览。

---

{% p center logo large, 最后总结 %}

TIFF 是一个<span style="color: rgba(66, 133, 244, 1)">为专业而生</span>的格式，它不追求小、不追求快，只追求一件事——<span style="color: rgba(240, 110, 35, 1)">最大程度保留画质</span>。在这个大家都在拼压缩率、拼体积的时代，TIFF 依然坚持"原汁原味"，还挺有态度的。

对普通人来说，你大概率用不上 TIFF，但如果你有<span style="color: rgba(66, 133, 244, 1)">扫描老照片、打印照片、专业修图</span>的需求，请记住这个格式——它能帮你守住每一份细节。

> 一句话：{% label 细节控专用格式 blue %}，大，但是值得。

## 最后

<span style="color: rgba(252, 142, 2, 1)">愿君安康，平安同乐！</span>
