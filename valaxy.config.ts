import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonTwikoo } from 'valaxy-addon-twikoo'
import { readdir, rename } from 'node:fs/promises'
import { join } from 'node:path'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * 修复 SSG 产物中，中文文件名被双重 URL 编码（%25 -> % -> 中文）的问题。
 * valaxy rc.3 生成的 HTML 文件名是双重编码（如 %25E5%25A4%25A7...html），
 * 导致 Vercel 等静态托管平台无法通过 URL 匹配到文件，中文文章链接 404。
 * 这里只重命名文件为中文原名，不改动内容，避免影响 SPA 路由。
 */
async function fixDoubleEncodedFilenames(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true })

  // 先递归处理子目录
  for (const entry of entries) {
    if (entry.isDirectory())
      await fixDoubleEncodedFilenames(join(dir, entry.name))
  }

  // 再重命名当前层含 %25 的文件
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.includes('%25'))
      continue
    const oldPath = join(dir, entry.name)
    try {
      const decoded = decodeURIComponent(decodeURIComponent(entry.name))
      if (decoded !== entry.name)
        await rename(oldPath, join(dir, decoded))
    }
    catch {
      // 不是标准的双重编码，跳过
    }
  }
}

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

  vite: {
    ssgOptions: {
      onFinished: async () => {
        await fixDoubleEncodedFilenames(join(process.cwd(), 'dist'))
      },
    },
  },
})
