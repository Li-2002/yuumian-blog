---
title: MaixCamera 学习笔记一
from: '/posts/MaixCamera学习笔记'
cover: https://yuumii.top/article/MaixCam2Learning/maxicamcover.png
categories: MaixCam
tags:
  - MaixCamera
  - MaixPy
  - YOLOv5
date: 2026-07-10
description: 关于maixcamera的学习笔记

---
## 前言

**更新中**

这篇文章会存储MaixCam的一部分资料，以及相关的一些<span style="color: rgba(66, 133, 244, 1)">笔记记录</span>
 



## 先说说这是个啥

<span style="color: rgba(66, 133, 244, 1)">MaixCamera</span> 是 Sipeed推出的一款 AI 视觉开发板，搭载了<span style="color: rgba(52, 168, 83, 1)">SG200X</span> 系列芯片，自带摄像头和屏幕，跑的是 <span style="color: rgba(53, 163, 241, 1)">MaixPy</span>——一个基于 MicroPython 的 AI 框架。

ok <span style="color: rgba(245, 40, 217, 1)">官方话</span>唠完 <span style="color: rgba(52, 168, 83, 1)">从基础开始</span>



## 基础操作

下面记一些基础操作，方便以后写代码的时候直接翻。

### 获取摄像头图像

```python
from maix import camera

cam = camera.Camera(640, 480)

while 1:
    img = cam.read()
    print(img)
```

`cam.read()` 返回的就是当前帧的图像对象，打印出来能看到分辨率、格式这些信息。

### 设置分辨率

初始化的时候直接指定宽高就行：

```python
from maix import camera
cam = camera.Camera(width=640, height=480)
```

也可以初始化之后再改：

```python
from maix import camera
cam = camera.Camera()
cam.set_resolution(width=640, height=480)
```

### 设置帧率

MaixPy 支持手动指定帧率，不过分辨率高了帧率会自动降：

```python
from maix import camera

cam = camera.Camera(640, 480, fps=30)    # 30帧
cam = camera.Camera(640, 480, fps=60)    # 60帧
cam = camera.Camera(640, 480, fps=80)    # 80帧
```

分辨率高于 1280x720 的时候会自动锁定到 30 帧，低于的话默认能到 80 帧。

### 跳过开头几帧

摄像头刚初始化的时候画面可能还没稳定，可以用 `skip_frames` 跳过：

```python
cam = camera.Camera(640, 480)
cam.skip_frames(30)  # 跳过前30帧
```

### 显示图像

MaixPy 的 `display` 模块用来在设备屏幕上显示内容：

```python
from maix import camera, display

cam = camera.Camera(640, 480)
disp = display.Display()

while 1:
    img = cam.read()
    disp.show(img)
```

### 显示图片和文字

不光能显示摄像头画面，也能加载本地图片或者画文字：

```python
from maix import image, display

disp = display.Display()
img = image.load("/root/dog.jpg")
disp.show(img)
```

或者自己画一个：

```python
from maix import image, display

disp = display.Display()
img = image.Image(320, 240)
img.draw_rect(0, 0, disp.width(), disp.height(), color=image.Color.from_rgb(255, 0, 0), thickness=-1)
img.draw_rect(10, 10, 100, 100, color=image.Color.from_rgb(255, 0, 0))
img.draw_string(10, 10, "Hello MaixPy!", color=image.Color.from_rgb(255, 255, 255))
disp.show(img)
```

### 显示到 MaixVision

如果你没有接屏幕，或者单纯想在电脑上看画面，MaixVision 也支持接收图像显示。不用初始化屏幕，直接用 `display.send_to_maixvision` 就行：

```python
from maix import image, display

img = image.Image(320, 240)
disp = display.Display()

img.draw_rect(0, 0, img.width(), img.height(), color=image.Color.from_rgb(255, 0, 0), thickness=-1)
img.draw_rect(10, 10, 100, 100, color=image.Color.from_rgb(255, 0, 0))
img.draw_string(10, 10, "Hello MaixPy!", color=image.Color.from_rgb(255, 255, 255))
display.send_to_maixvision(img)
```

这样在 MaixVision 的界面里就能看到画面了，调试的时候挺方便的。

### 录制 H265 视频

MaixPy 支持直接录制成 H265 格式的视频，保存到设备上：

```python
from maix import video, image, camera, app, time

cam = camera.Camera(640, 480, image.Format.FMT_YVU420SP)
e = video.Encoder(width=cam.width(), height=cam.height())
f = open('/root/output.h265', 'wb')

record_ms = 5000
start_ms = time.ticks_ms()
while not app.need_exit():
    img = cam.read()
    frame = e.encode(img)
    print(frame.size())
    f.write(frame.to_bytes())

    if time.ticks_ms() - start_ms > record_ms:
        app.set_exit_flag(True)
```

几个要点说一下：

- Encoder 目前只支持 <span style="color: rgba(66, 133, 244, 1)">NV21 格式</span>，所以摄像头初始化的时候要指定 `image.Format.FMT_YVU420SP`
- 默认编码 <span style="color: rgba(52, 168, 83, 1)">H265</span>，想用 H264 的话改一下初始化参数：`video.Encoder(type=video.VideoType.VIDEO_H264_CBR)`
- <span style="color: rgba(234, 67, 53, 1)">同时只能存在一个编码器</span>，不能同时编两路
- 编码完记得调用 `frame.to_bytes()` 转成 bytes 再写入文件
- 示例里设置了 5 秒自动退出，实际用的时候改 `record_ms` 就行

## 推流

MaixCamera 支持多种推流方式，可以把摄像头画面实时推到其他设备上看。

### RTSP 推流

RTSP 适合局域网内看实时画面，用 VLC 或者其他播放器就能拉流：

```python
from maix import time, rtsp, camera, image

cam = camera.Camera(2560, 1440, image.Format.FMT_YVU420SP)
server = rtsp.Rtsp()
server.bind_camera(cam)
server.start()

print(server.get_url())

while True:
    time.sleep(1)
```

注意点：

- RTSP 模块只支持 <span style="color: rgba(66, 133, 244, 1)">NV21 格式</span>，摄像头初始化要指定 `image.Format.FMT_YVU420SP`
- `bind_camera` 之后原来的 Camera 对象就不能再用了
- 默认播放地址是 `rtsp://设备IP:8554/live`，可以用 VLC（3.0.20 以上）打开

如果需要同时推音频：

```python
from maix import time, rtsp, camera, image, audio

cam = camera.Camera(640, 480, image.Format.FMT_YVU420SP)
audio_recorder = audio.Recorder()

server = rtsp.Rtsp()
server.bind_camera(cam)
server.bind_audio_recorder(audio_recorder)
server.start()

print(server.get_url())

while True:
    time.sleep(1)
```

注：音频推流需要 MaixPy v4.7.8 之后的版本。

### RTMP 推流

RTMP 适合推到公网直播平台，比如 Bilibili：

```python
from maix import camera, time, rtmp, image

cam = camera.Camera(640, 480, image.Format.FMT_YVU420SP)

host = '192.168.0.30'
port = 1935
app = 'live'
stream = 'stream'
bitrate = 1000_000
r = rtmp.Rtmp(host, port, app, stream, bitrate)
r.bind_camera(cam)
r.start()

while True:
    time.sleep(1)
```

几个参数说明：
- `host`：RTMP 服务器地址或域名
- `port`：端口，默认 1935
- `app`：服务器上的应用名
- `stream`：流名称，也可以作为推流密钥

加音频也是类似的，多一个 `bind_audio_recorder`：

```python
from maix import camera, time, app, rtmp, image, audio

cam = camera.Camera(640, 480, image.Format.FMT_YVU420SP)
audio_recorder = audio.Recorder()

host = "192.168.0.63"
port = 1935
app_name = "live"
stream_name = "stream"
client = rtmp.Rtmp(host, port, app_name, stream_name)
client.bind_camera(cam)
client.bind_audio_recorder(audio_recorder)
client.start()

print(f"rtmp://{host}:{port}/{app_name}/{stream_name}")
while not app.need_exit():
    time.sleep(1)
```

```python
from maix import camera, rtmp, image,display

host = '192.168.60.11'
port = 1935
app = 'live'
stream_name = 'maixcam'
bitrate = 1000_000

sign = 'xxxx' 

# sign = hashlib.md5(push_key.encode()).hexdigest()

stream = f'{stream_name}?sign={sign}'

cam = camera.Camera(640, 480, image.Format.FMT_YVU420SP)

disp = display.Display()

r = rtmp.Rtmp(host, port, app, stream, bitrate)
r.bind_camera(cam)
r.start()

print(f"开始推流到: rtmp://{host}:{port}/{app}/{stream}")

while True:
    img = cam.read()
    disp.show(img)
```


#### 推流到 Bilibili

想推到 B 站直播的话，先去 B 站开播设置里拿到推流地址，格式一般是：

```
rtmp://live-push.bilivideo.com/live-bvc/?streamname=live_xxx&key=xxx&schedule=rtmp&pflag=1
```

拆开来填：

```python
from maix import camera, time, rtmp, image

cam = camera.Camera(640, 480, image.Format.FMT_YVU420SP)

host = 'live-push.bilivideo.com'
port = 1935
app = 'live-bvc'
stream = '?streamname=live_xxxx&key=1fbfxxxxxxxxxxxxxffe0&schedule=rtmp&pflag=1'
bitrate = 1000_000
r = rtmp.Rtmp(host, port, app, stream, bitrate)
r.bind_camera(cam)
r.start()

while True:
    time.sleep(1)
```

运行之后去直播间就能看到 MaixCamera 的画面了。如果没显示，试试先关掉直播间再重新打开。

### WebRTC 推流

WebRTC 的优势是浏览器直接看，不用装额外软件：

```python
from maix import time, webrtc, camera, image

cam = camera.Camera(640, 480, image.Format.FMT_YVU420SP)
server = webrtc.WebRTC()
server.bind_camera(cam)
server.start()

print(server.get_url())

while True:
    time.sleep(1)
```

同样是 NV21 格式要求，`bind_camera` 之后原 Camera 对象失效。用 Chrome 浏览器访问打印出来的 URL 就能看到画面了。



## Modbus 通信

Modbus 是一个工业上常用的总线协议，支持一主多从，基于 UART 或 TCP 传输。MaixPy 适配了 Modbus 协议，主机从机模式都支持。

### Modbus 从机模式

把 MaixCAM 当作从机，暴露几组寄存器给主机读写：

```python
from maix.comm import modbus
from maix import app, err

slave = modbus.Slave(
    modbus.Mode.RTU,
    "/dev/ttyS0",
    0x00, 10,
    0x00, 10,
    0x00, 10,
    0x00, 10,
    115200, 1,
    0, False
)

# 读取 input registers
old_ir = slave.input_registers()
print("old ir: ", old_ir)

# 写入数据
data = [0x22, 0x33, 0x44]
slave.input_registers(data, 2)
new_ir = slave.input_registers()
print("new ir:", new_ir)

while not app.need_exit():
    if err.Err.ERR_NONE != slave.receive(2000):
        continue

    rtype = slave.request_type()
    if rtype == modbus.RequestType.READ_HOLDING_REGISTERS:
        print("master read hr")
        hr = slave.holding_registers()
        print("now hr: ", hr)
        hr = [x+1 for x in hr]
        print("update hr")
        slave.holding_registers(hr)

    slave.reply()
```

如果要走 TCP 模式，把 `Mode.RTU` 改成 `Mode.TCP`，串口号留空，后面填端口号就行。

### Modbus 主机模式

作为主机时可以主动读写从机的数据：

```python
from maix import pinmap, app, err, time
from maix.comm import modbus

REGISTERS_START_ADDRESS = 0x00
REGISTERS_NUMBER = 10
RTU_SLAVE_ID = 1
RTU_BAUDRATE = 115200

pinmap.set_pin_function("A19", "UART1_TX")
pinmap.set_pin_function("A18", "UART1_RX")

master = modbus.MasterRTU("/dev/ttyS1", RTU_BAUDRATE)

while not app.need_exit():
    hr = master.read_holding_registers(
        RTU_SLAVE_ID,
        REGISTERS_START_ADDRESS,
        REGISTERS_NUMBER,
        2000
    )
    if len(hr) == 0:
        continue
    print("Master read hr: ", hr)
    time.sleep(1)
```



## 寻线功能

用 `image` 模块的 `get_regression` 可以快速找到画面中的直线，适合做小车寻线之类的项目：

```python
from maix import camera, display, image

cam = camera.Camera(320, 240)
disp = display.Display()

thresholds = [[0, 80, -120, -10, 0, 30]]  # 绿色的阈值

while 1:
    img = cam.read()

    lines = img.get_regression(thresholds, area_threshold=100)
    for a in lines:
        img.draw_line(a.x1(), a.y1(), a.x2(), a.y2(), image.COLOR_GREEN, 2)
        theta = a.theta()
        rho = a.rho()
        if theta > 90:
            theta = 270 - theta
        else:
            theta = 90 - theta
        img.draw_string(0, 0, "theta: " + str(theta) + ", rho: " + str(rho), image.COLOR_BLUE)

    disp.show(img)
```

几个要点：
- `thresholds` 要按实际环境颜色调参数，代码里的是绿色的
- `area_threshold` 用来过滤小面积的干扰
- `a.theta()` 获取直线角度，`a.rho()` 获取直线到原点的距离
- 调好参数之后可以拿这些数据控制小车方向





## 跑通第一个目标检测
怎么<span style="color: rgba(66, 133, 244, 1)">连接</span>什么的交给官网文档了
[介绍](https://wiki.sipeed.com/maixpy/doc/zh/index.html)
[教程文档](https://wiki.sipeed.com/maixpy/)
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

初始化一个 YOLOv5 检测器，模型文件是 <span style="color: rgba(66, 133, 244, 1)">`.mud`</span> 格式的。这个 `.mud` 是 MaixPy 特有的模型格式，不是直接拿 PyTorch 训练出来的 `.pt` 文件就能用的，需要先转换成 `.mud`。

> 这里<span style="color: rgba(234, 67, 53, 1)">踩了个坑</span>——一开始不知道要转模型，直接把 `.pt` 文件丢上去，报错了好久才发现。

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
- `conf_th=0.5`：<span style="color: rgba(52, 168, 83, 1)">置信度阈值</span>，只有超过 50% 把握的才算检测到
- `iou_th=0.45`：<span style="color: rgba(171, 71, 188, 1)">IOU 阈值</span>，用来去重，两个框重叠超过 45% 就只保留一个

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

这里 `detector.labels` 是模型自带的类别标签列表，YOLOv5s 默认是 <span style="color: rgba(66, 133, 244, 1)">COCO 数据集</span> 的 80 个类别。

#### 显示

```python
dis.show(img)
```

把画好框的画面送到屏幕上显示。

---

### 效果

跑起来之后，摄像头对着人、杯子、手机这些常见物体，就能看到框框跟着动，屏幕上实时显示检测结果。默认可以识别 <span style="color: rgba(52, 168, 83, 1)">80 种物体</span>
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
注意：<span style="color: rgba(234, 67, 53, 1)">区分设备文件系统和电脑文件系统</span>

<span style="color: rgba(66, 133, 244, 1)">电脑文件系统</span>：运行在电脑上，在 MaixVision 中打开文件或者工程都是打开的电脑里面的文件（比如 C 盘 D 盘等），保存也是自动保存到电脑的文件系统。
<span style="color: rgba(53, 163, 241, 1)">设备文件系统</span>：程序运行时会将程序发送到设备上运行，所以代码里面读取的文件都是从设备文件系统读取。
比如你电脑保存了D:\data\a.jpg，然后在设备上使用这个文件img = image.load("D:\data\a.jpg")，这样当然是找不到文件的，因为设备上没有D:\data\a.jpg这个文件。

