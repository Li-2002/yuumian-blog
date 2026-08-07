import { defineThemeConfig } from 'valaxy-theme-yun'

export default defineThemeConfig({
  banner: {
    enable: true,
    title: '雨眠碎碎念',
  },


  nav: [
    { text: '博客文章', link: '/posts/', icon: 'i-ri-article-line' },
    { text: '我的小伙伴们', link: '/links/', icon: 'i-ri-genderless-line' },
    { text: '游戏人生', link: '/games/', icon: 'i-ri-game-line' },
    { text: '相册', link: '/albums/', icon: 'i-ri-image-line' },
  ],

  pages: [
    {
      name: '我的小伙伴们',
      url: '/links/',
      icon: 'i-ri-genderless-line',
      color: 'dodgerblue',
    },
    {
      name: '游戏人生',
      url: '/games/',
      icon: 'i-ri-game-line',
      color: 'hotpink',
    },
    {
      name: '相册',
      url: '/albums/',
      icon: 'i-ri-image-line',
      color: '#EC53B0',
    },
    {
      name: '文字修仙',
      url: 'https://xiuxian.yuumii.top',
      icon: 'i-ri-sword-line',
      color: '#a78bfa',
    },
    {
      name: '加密小工具',
      url: '/crypto/',
      icon: 'i-ri-lock-line',
      color: '#f59e0b',
    },
    {
      name: '便携小空调',
      url: '/air-conditioner/',
      icon: 'i-ri-snowy-line',
      color: '#38bdf8',
    },
  ],

  footer: {
    since: 2016,
    beian: {
      enable: false,
      icp: '苏ICP备17038157号',
      police: '苏公网安备xxxxxx号',
    },
  },
})
