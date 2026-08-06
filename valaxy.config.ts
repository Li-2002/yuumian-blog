import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonTwikoo } from 'valaxy-addon-twikoo'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts
  // theme config see theme.config.ts

  theme: 'yun',
  themeConfig: {
    notice: {
      enable: true,
      hideInPages: false, // 是否在 /pages/[page] 中隐藏
      content: '欢迎来到雨眠碎碎念！',
    },
  },
  // 评论系统（Twikoo）
  addons: [
    addonTwikoo({
      envId: 'https://twikoo.yuumii.top/',
    }),
  ],
  unocss: { safelist },
})
