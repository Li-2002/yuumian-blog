---
title: MaixCamera 学习笔记一
cover: https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=a%20small%20AI%20camera%20module%20on%20a%20desk%20connected%20to%20a%20screen%20showing%20real-time%20object%20detection%20with%20bounding%20boxes%2C%20tech%20workspace%20style&image_size=landscape_16_9
categories:  MaixCam
tags:
  - MaixCamera
  - MaixPy
  - YOLOv5
keywords: MaixCamera,MaixPy,YOLOv5,目标检测
description: 
ai: >-
date: 2026-07-10 16:27:02
---

## 前言

** 更新中 **

这篇文章会存储MaixCam的一部分资料 
 

---

## 先说说这是个啥

<span style="color: rgba(66, 133, 244, 1)">MaixCamera</span> 是 Sipeed推出的一款 AI 视觉开发板，搭载了<span style="color: rgba(52, 168, 83, 1)">SG200X</span> 系列芯片，自带摄像头和屏幕，跑的是 <span style="color: rgba(53, 163, 241, 1)">MaixPy</span>——一个基于 MicroPython 的 AI 框架。

ok 官方话唠完 从基础开始

---

## 跑通第一个目标检测
怎么连接什么的交给官网文档了
{% btn 'https://wiki.sipeed.com/maixpy/doc/zh/index.html', 介绍, anzhiyufont anzhiyu-icon-circle-arrow-right, larger %}
{% btn 'https://wiki.sipeed.com/maixpy/', 教程文档, anzhiyufont anzhiyu-icon-circle-arrow-right, larger %}
惯例先来个 Hello World，<span style="color: rgba(66, 133, 244, 1)">YOLOv5 目标检测</span>。

### 完整代码

```python
from maix import camera, display, image, nn, app

detector = nn.YOLOv5(model="/root/models/yolov5s.mud")

cam = camera.Camera(detector.input_width(), detector.input_height(), detector.input_format())
dis = display.Display()

while not app.need_exit():
    img = cam.read()
    objs = detector.detect(img, conf_th=0.5, iou_th=0.45)
    for obj in objs:
        img.draw_rect(obj.x, obj.y, obj.w, obj.h, color=image.COLOR_PURPLE)
        msg = f'{detector.labels[obj.class_id]}:{obj.score:.2f}'
        img.draw_string(obj.x, obj.y, msg, color=image.COLOR_RED)
    dis.show(img)
```

### 逐行解析

后续的代码不会做逐行解析 有特别重要的于注释解释或者偶尔解析

#### 导入库

```python
from maix import camera, display, image, nn, app
```

`maix` 就是 MaixPy 的核心库，这里导入了五个模块：

| 模块 | 干啥的 |
|:---|:---|
| `camera` | 摄像头驱动，用来拍画面 |
| `display` | 屏幕显示，把画面渲染到LCD上 |
| `image` | 图像处理，画框、写字、调颜色= |
| `nn` | 神经网络，加载模型和推理的核心 |
| `app` | 应用控制，管理程序生命周期 |

#### 加载模型

```python
detector = nn.YOLOv5(model="/root/models/yolov5s.mud")
```

初始化一个 YOLOv5 检测器，模型文件是 `.mud` 格式的。这个 `.mud` 是 MaixPy 特有的模型格式，不是直接拿 PyTorch 训练出来的 `.pt` 文件就能用的，需要先转换成 `.mud`。

> 这里踩了个坑——一开始不知道要转模型，直接把 `.pt` 文件丢上去，报错了好久才发现。

#### 初始化摄像头和屏幕

```python
cam = camera.Camera(detector.input_width(), detector.input_height(), detector.input_format())
dis = display.Display()
```

摄像头的分辨率是 <span style="color: rgba(52, 168, 83, 1)">根据模型的输入尺寸</span> 来设置的。YOLOv5s 的输入一般是 320x320 或者 640x640，`detector.input_width()` 和 `detector.input_height()` 会自动从模型里读出来，不用自己记。

`display.Display()` 就是初始化屏幕，默认填满整个LCD。

#### 主循环

```python
while not app.need_exit():
```

`app.need_exit()` 是 MaixPy 提供的退出检测，按设备上的按键或者收到退出信号就会返回 `True`

#### 读取画面 + 检测

```python
img = cam.read()
objs = detector.detect(img, conf_th=0.5, iou_th=0.45)
```

`cam.read()` 从摄像头拿一帧画面。
`detector.detect()` 对这帧画面做目标检测，返回检测到的所有目标。

两个参数：
- `conf_th=0.5`：置信度阈值，只有超过 50% 把握的才算检测到
- `iou_th=0.45`：IOU 阈值，用来去重，两个框重叠超过 45% 就只保留一个

#### 画框和标签

```python
for obj in objs:
    img.draw_rect(obj.x, obj.y, obj.w, obj.h, color=image.COLOR_PURPLE)
    msg = f'{detector.labels[obj.class_id]}:{obj.score:.2f}'
    img.draw_string(obj.x, obj.y, msg, color=image.COLOR_RED)
```

遍历每个检测到的目标：
1. `draw_rect`：画一个<span style="color: rgba(171, 71, 188, 1)">紫色</span>的矩形框
2. `draw_string`：在框的左上角写上标签名和置信度，比如 `person:0.89`

这里 `detector.labels` 是模型自带的类别标签列表，YOLOv5s 默认是 COCO 数据集的 80 个类别。

#### 显示

```python
dis.show(img)
```

把画好框的画面送到屏幕上显示。

---

### 效果

跑起来之后，摄像头对着人、杯子、手机这些常见物体，就能看到框框跟着动，屏幕上实时显示检测结果。默认可以识别的80种物体
```markdown
person
bicycle
car
motorcycle
airplane
bus
train
truck
boat
traffic light
fire hydrant
stop sign
parking meter
bench
bird
cat
dog
horse
sheep
cow
elephant
bear
zebra
giraffe
backpack
umbrella
handbag
tie
suitcase
frisbee
skis
snowboard
sports ball
kite
baseball bat
baseball glove
skateboard
surfboard
tennis racket
bottle
wine glass
cup
fork
knife
spoon
bowl
banana
apple
sandwich
orange
broccoli
carrot
hot dog
pizza
donut
cake
chair
couch
potted plant
bed
dining table
toilet
tv
laptop
mouse
remote
keyboard
cell phone
microwave
oven
toaster
sink
refrigerator
book
clock
vase
scissors
teddy bear
hair drier
toothbrush
```
---
注意：区分设备文件系统和电脑文件系统

电脑文件系统：运行在电脑上，在 MaixVision 中打开文件或者工程都是打开的电脑里面的文件（比如 C 盘 D 盘等），保存也是自动保存到电脑的文件系统。
设备文件系统：程序运行时会将程序发送到设备上运行，所以代码里面读取的文件都是从设备文件系统读取。
比如你电脑保存了D:\data\a.jpg，然后在设备上使用这个文件img = image.load("D:\data\a.jpg")，这样当然是找不到文件的，因为设备上没有D:\data\a.jpg这个文件。

