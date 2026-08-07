import { defineThemeConfig } from 'valaxy-theme-yun'

export default defineThemeConfig({
  banner: {
    enable: true,
    title: '雨眠碎碎念',
  },


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
