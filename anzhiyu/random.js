var posts=["2026/06/09/content/","2026/06/02/hello-world/","2026/06/09/博客上线啦！博客诞生的心路历程/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };