var posts=["2026/06/16/博客上线啦！博客诞生的心路历程/","2026/06/16/games开发文档/","2026/06/24/安知鱼接入腾讯位置服务实现访客IP定位/","2026/06/17/Twikoo博主标识实现与QQ邮箱踩坑/","2026/06/16/安知鱼主题接入DeepSeek实现AI摘要/","2026/06/16/博客部署到CloudFlare和Github/","2026/06/16/moments开发文档/","2026/06/16/hello-world/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };