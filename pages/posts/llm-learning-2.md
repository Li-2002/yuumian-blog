---
title: 大模型(2)-函数到神经网络
from: '/posts/大模型学习(二)'
cover: https://yuumii.top/article/20260716_LearningSpringAI/1784791739901-6a86d7f7-e607-4022-b91b-f0099ee78274.png
categories: 大模型
tags:
  - 大模型
  - 学习笔记
date: 2026-08-12
description: 从函数到神经网络，理解深度学习的基石
---

<code>依旧是Deepsleep深度睡眠镇楼</code>
![](https://yuumii.top/article/20260716_LearningSpringAI/1784791739901-6a86d7f7-e607-4022-b91b-f0099ee78274.png)

两个可能有用能够帮助到理解的网站
https://alexlenail.me/NN-SVG/

https://playground.tensorflow.org/

## [从函数到神经网络](https://www.bilibili.com/video/BV1NCgVzoEG9?spm_id_from=333.788.player.switch&vd_source=894a223b85ae44e61e16dcd1a7356db0&p=2)

让我们看一个生物是不是猫还是狗还是是一株草，对我们人类来说这就是再简单不过的事情，但是对于机器来说这个可能是一个**史诗级难题**，于是，人们开始使用这种<span style="color: rgba(66, 133, 244, 1)">**"函数"**</span>来尝试着解析这个问题，但是我们如何去找到这个"函数"呢？

![](https://yuumii.top/article/20260812_LearningSpringAI2/1786506025300-b5adb48e-7962-4940-a487-a0ac908ce6c1.png)

在数学物理亦或者是日常生活中，我们经常会使用到函数，最简单的y=x，y=ax+b这些都是比较常见的，如何去求一个简单函数这些我们在学校中已经有几个较为简单的解法了，有些甚至一眼就能看出来对应的函数是什么，比如给你三组（1,2）（2,4）（3,6），你能很自然就看出这个对应的函数是<span style="color: rgba(66, 133, 244, 1)">**y=2x**</span>，其实机器一开始也是这样的，是用猜测来找到对应的或者最接近的函数
比如现在先给你几组数字，机器会先<span style="color: rgba(240, 110, 35, 1)">**猜**</span>

![](https://yuumii.top/article/20260812_LearningSpringAI2/1786506199524-0a50551b-bf06-44ea-807e-07d63857eae4.png)
可以看到下图几个坐标点放在坐标系上了之后，靠着<code>y=wx+b</code>去找到这条最接近的线，然后尝试着慢慢调整参数来达到最吻合最接近的那一条线，于是就找到了对应的这个函数，只要以后执行这个任务，那就套用这条函数公式来得出结果
![](https://yuumii.top/article/20260812_LearningSpringAI2/1786506273875-3b5f48c6-3379-48db-b660-d29fa536867e.png)
但是有的时候并不会这么简单，有时候是找不到这条函数的，这时候就需要找到最接近的那一条就行，这就是现代人工智能的思路，<span style="color: rgba(240, 110, 35, 1)">**猜和简化问题**</span>（也就是摆烂了，不找了 差不多得了）

直到问题越来越复杂，我们需要开始用到<span style="color: rgba(54, 231, 172, 1)">**非线性函数**</span>了，怎么变成非线性呢，很简单，在原来的函数基础上套一个非线性的运算即可比如<code>f(x)=(wx+b)²</code>、<code>f(x)=sin(wx+b)</code>等等这些都是，即是<span style="color: rgba(231, 60, 208, 1)">**f(x)=g(wx+b) 激活函数**</span>，而且我们实际上不会只有一个x输入，可能会有很多个输入，所以可能会有多个x，每个x会对应一个w 即是
![](https://yuumii.top/article/20260812_LearningSpringAI2/1786506574249-b46d9709-7e55-4f59-be3e-0fa7762a426a.png)

甚至有的时候一层激活函数还不足以让大部分点都在线上，也就是说这条线还不够灵活 或者不够弯，我们还需要再<span style="color: rgba(236, 83, 44, 1)">**套一层激活函数**</span>，理论上可以无限的去套娃，来构建一条任意无限灵活的函数

![](https://yuumii.top/article/20260812_LearningSpringAI2/1786506631518-e1a47e44-d9db-4bf5-81bf-3dd837b75ef0.png)

## 神经网络
但是你看了不头大吗？我觉得看着都困了，所以我们来开始**简化**
我们把这个修改为<span style="color: rgba(66, 133, 244, 1)">**输入层和输出层**</span>，也就是下图，也叫做<span style="color: rgba(66, 133, 244, 1)">**神经元**</span>
![](https://yuumii.top/article/20260812_LearningSpringAI2/1786506694318-4dd32eba-6b7d-4adb-aaf6-1a023f6ded15.png)
如果我们有多个x，多个输入也就是

![](https://yuumii.top/article/20260812_LearningSpringAI2/1786506739371-7262a66a-9982-4db0-93df-1fc0c24d5f15.png)
如果我们刚刚说的，线不够灵活 还需要套一层函数，那则是多一层激活函数，可以看到在外层多了一个激活函数之后，其实就是在原来输入层和输出层中间多了一层变换，

![](https://yuumii.top/article/20260812_LearningSpringAI2/1786506787264-f2691766-cfff-4dc1-920e-e574f441dd27.png)

于是就可能会出现左边很多x输入，中间有多层变换的函数 的超级复杂函数

![](https://yuumii.top/article/20260812_LearningSpringAI2/1786506926421-d7d7c54c-3820-4ae4-99f4-3b84ad92c939.png)

还有一个知识点 就是我们在知道一个函数的情况下 使用它去求解其实就是带入x然后根据他的参数进行数学计算，得出最后的y，变成输入层和输出层的关系之后就是看起来像是从左到右依次，我们也叫他为
**<span style="color: #FF7242">前向传播</span>**
![](https://yuumii.top/article/20260812_LearningSpringAI2/1786506869375-987c3468-f4e0-49f7-a68d-1c8cd5e38c2c.png)

虽然到这里可能会非常复杂，但是其实我们的目标很明确，就是根据现在已经知道的x和y的值，（猜）找出对应的那条函数，并且让这条函数来为我们所用，如果你看了上一期，你就会觉得这个不就是我们一开始给他的输入还有标签嘛，<span style="color: rgba(66, 133, 244, 1)">**标签其实就是y，输入就是x**</span>，然后他找到这层关系了 就是知道函数了，以后就能够帮我们判断了。


如果想知道求参数的过程是怎么样的 可以看一下[飞天闪客](https://www.bilibili.com/video/BV1NCgVzoEG9?spm_id_from=333.788.videopod.sections&vd_source=894a223b85ae44e61e16dcd1a7356db0&p=2),这个比较麻烦，所以作为了解即可哈哈哈
最后再提一个概念，根据输入x计算出输出y，这样我们刚刚说是前向传播，反过来的，计算出每个损失函数（其实就是数学中求均方误差）关于每个参数的梯度这个就是<span style="color: rgba(66, 133, 244, 1)">反向传播</span>，每个参数都向着梯度的反方向变化一点点这个就构成了神经网络的依次训练，这样最后让损失函数足够小，越来越接近我们需要的那个函数，这个就是训练的过程

后面还会持续更新~

## 最后

<span style="color: rgba(252, 142, 2, 1)">愿君安康，平安同乐！</span>