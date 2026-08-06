import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://blog.yuumii.top/',
  lang: 'zh-CN',
  subtitle: 'Own the moment.',
  title: '雨眠碎碎念',
  author: {
    name: '雨眠',
    avatar: 'https://yuumii.top/sys/avatar.ico',
    email: '642701893@qq.com',
    link: 'https://blog.yuumii.top/',
    status: {
    emoji: '🌧️',
    message: '今天也在摸鱼~',
  },

  },
  description: '欢迎来到雨眠碎碎念~',

  /**
   * 评论系统
   */
  comment: {
    enable: true,
  },
   /**
   * 摘要
   */
  excerpt: {
    type: 'html',
    auto: true,
    length: 450,
  },
   /**
   * 开启阅读统计
   */
  statistics: {
    enable: true,
    readTime: {
      /**
       * 阅读速度
       */
      speed: {
        cn: 300,
        en: 200,
      },
    },
  },
   /**
   * 代码块高度限制
   */
  codeHeightLimit: 300,


  

  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'QQ 群 1012119660',
      link: 'https://qun.qq.com/universal-share/share?ac=1&authKey=PbkGlxgS%2FEqj0MsysopaHl3fJ3oomRy7FIIpB8mzLLoebfnOrDesGEt3Z2GQ1cEQ&busi_data=eyJncm91cENvZGUiOiIxMDEyMTE5NjYwIiwidG9rZW4iOiI3aVQrVDhrL1FXV3l6MDBjNXluMUVTOUNWa2duUHppMW8xdDJIWjZuYzZ6ZTNwYkFzTXQxNU5ISU84S2RoL09TIiwidWluIjoiNjQyNzAxODkzIn0%3D&data=m9dm18JnLc85lvDCN7nG8TSBPdNf_WNGKJXRKlOuIzWTaJRZ6_pBYq8BUToEGdcfhyxAXvmAtLk_rGWO1EQsoA&svctype=4&tempid=h5_group_info',
      icon: 'i-ri-qq-line',
      color: '#12B7F5',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/Li-2002',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '网易云音乐',
      link: 'https://y.music.163.com/m/user?id=566373410',
      icon: 'i-ri-netease-cloud-music-line',
      color: '#C20C0C',
    },
    {
      name: 'E-Mail',
      link: 'mailto:642701893@qq.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
    {
      name: 'Travelling',
      link: 'https://www.travellings.cn/go.html',
      icon: 'i-ri-train-line',
      color: 'var(--va-c-text)',
    },
  ],

  search: {
    enable: false,
  },

  // sponsor: {
  //   enable: true,
  //   title: '我很可爱，请给我钱！',
  //   methods: [
  //     {
  //       name: '支付宝',
  //       url: 'https://cdn.yunyoujun.cn/img/donate/alipay-qrcode.jpg',
  //       color: '#00A3EE',
  //       icon: 'i-ri-alipay-line',
  //     },
  //     {
  //       name: 'QQ 支付',
  //       url: 'https://cdn.yunyoujun.cn/img/donate/qqpay-qrcode.png',
  //       color: '#12B7F5',
  //       icon: 'i-ri-qq-line',
  //     },
  //     {
  //       name: '微信支付',
  //       url: 'https://cdn.yunyoujun.cn/img/donate/wechatpay-qrcode.jpg',
  //       color: '#2DC100',
  //       icon: 'i-ri-wechat-pay-line',
  //     },
  //   ],
  // },
})
