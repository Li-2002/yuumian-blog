---
title: Hexo博客怎么上线CloudFlare
top_img: https://yuumii.top/about/about6-yanyun.jpg
cover: https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/Logo.png
categories: 博客
tags: CloudFlare
keywords: 博客上线CloudFlare
description: 这是一个Hexo博客怎么上线CloudFlare的很简单的教程
---
# Hexo上线CloudFlare

## 安装Git
首先是安装Git，如果你是Win则安装Bash即可，之后所有的git命令都可以在这个bash里面完成，其他的不是git的命令可以使用CMD进行执行，我这边使用的是OpenCloudOS9，也就是腾讯云服务器的一个系统，Centos系统可以按照我这套直接跟着做。首先安装一下Git
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/%E4%BA%8B%E5%89%8D%E5%87%86%E5%A4%87.png)


``` 
yum install git
```

看到Complete!则是成功了
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/yum%E5%AE%89%E8%A3%85Git.png)

可以使用查看版本看看有没有版本输出
```
git --version
```

然后就开始配置姓名和邮箱，后续我们上传文件都是用的这个身份
```
# 配置用户名
git config --global user.name "Your Name"
# 配置邮箱
git config --global user.email "your.email@example.com"
#可以通过这个命令来检查是否成功 
git config -l

```
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/git%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E8%BA%AB%E4%BB%BD.png)

## 配置git公钥
然后配置公钥，这个是我们链接Github使用的，这个输入进去之后全部使用默认即可，也就是一直回车，直到提示成功了，如果你是Win的话应该默认是在C盘，如果你是跟我一样，我是OpenCloudOS9（也就是腾讯云的系统），那你可以使用第二个命令来直接查看密钥
```
#生成密钥
 ssh-keygen -t ed25519 -C "你的邮箱@qq.com"
#查看密钥
cat ~/.ssh/id_ed25519.pub

```

然后登录你的Github（没有就先创建一个），点击右上角的头像，右侧导航栏选择Setting，然后设置界面的左边导航栏选择SSH and GPG keys  在右侧新界面中选择New SSH key，这里面名字随便填，然后下面的key一栏填上我们刚刚的公钥，保存即可
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/github%E5%BC%80%E5%A7%8B%E9%85%8D%E7%BD%AE%E5%85%AC%E9%92%A5.png)
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/%E8%BF%87%E7%A8%8B%E9%85%8D%E7%BD%AE%E5%AF%86%E9%92%A5.png)
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/%E9%85%8D%E7%BD%AE%E5%A5%BD%E5%85%AC%E9%92%A5%E7%9A%84%E7%95%8C%E9%9D%A2.png)
配置完毕之后就可以回来测试了,
```
ssh -T git@github.com
```
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/%E6%B5%8B%E8%AF%95github%E9%93%BE%E6%8E%A5.png)

如果弹出一个问你是否要继续链接，输入yes即可，等到弹出以下提示则是已经成功，我们已经完成了环境配置Github的过程了，接下来就是着手上传事宜
```
Hi xxxx! You've successfully authenticated, but GitHub does not provide shell access.
```

## Github创建一个仓库
Github创建仓库用来存储我们的博客文件，可以作为版本管理或者是帮我们更新文章之类的
名称的话随意，下面的visibility 我选择的是Public，即是公开，这里选择是Private也是可以的
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/Github%E5%88%9B%E5%BB%BA%E4%BB%93%E5%BA%93.png)

创建完毕之后点开该仓库，中间就有仓库地址，我们需要把他复制一下，等会要用

![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/Github%E4%BB%93%E5%BA%93%E5%9C%B0%E5%9D%80.png)

## 创建博客模板
这里可以详细看一下我的另外一篇文章，有更详细的介绍 或者参考一下https://docs.anheyu.com/initall.html

## 将静态博客挂载到 GitHub Pages
要将静态博客挂载到 GitHub Pages，需要安装 hexo-deployer-git
```
npm install hexo-deployer-git --save
```
安装好了之后，在博客的根目录下的_config.yml，就是整个Hexo框架的配置文件了。可以在里面修改大部分的配置。详细可参考官方的配置，然后我们需要修改的是最后一行的将repository修改为你自己的github项目地址即可，还有分支要改为main代表主分支（注意缩进），这里最好是使用SSH格式 即是  repository: git@github.com:你的git名称/博客名称.git ， 否则可能会报错
```
deploy:
  type: git
  repository: git@github.com:Li-2002/yuumian-blog.git
  branch: main
```
ok配置完成之后我们就开始deploy一下，在终端中输入让hexo执行打包部署
```
hexo clean && hexo generate && hexo deploy  
```
出现 INFO  Deploy done: git 则是说明我们已经部署成功了 
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/%E9%83%A8%E7%BD%B2%E5%88%B0git%E6%88%90%E5%8A%9F.png)

## 部署到CloudFlare
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/CloudFlare%E9%A1%B5%E9%9D%A2.png)
在 Workers 和 Pages 中选择创建一个新的项目，然后选择Github图标的connect github
之后就是授权了，我这边是，授权所有项目，然后重新点开connect With github，就可以选择你的项目了。直接下一步即可，等到控制栏输出✨ Success! Build completed. 说明我们已经部署成功了
下面倒数第三栏会有一个链接，这个链接就是全球可以访问的你的项目的链接！恭喜你部署成功！
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/%E9%80%89%E6%8B%A9%E9%A1%B9%E7%9B%AE.png)
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/CloudFlare%E9%83%A8%E7%BD%B2%E8%BF%87%E7%A8%8B%E6%8E%A7%E5%88%B6%E6%A0%8F.png)
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/CloudFlare%E9%83%A8%E7%BD%B2%E6%88%90%E5%8A%9F.png)
如果你跟我一样有自己的域名的话，那你可以在worker&pages页面，点进去你的项目，在点到上面的Domains，可以Add Domain添加自己的域名解析
![](https://yuumii.top/article/DeployWithGitHubAndCLoudFlare/%E6%B7%BB%E5%8A%A0%E5%9F%9F%E5%90%8D%E8%A7%A3%E6%9E%90.png)


 ##  最后
  愿君安康，平安喜乐~