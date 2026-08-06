import { defineAppSetup } from 'valaxy'

export default defineAppSetup(({ isClient }) => {
  // 51LA 访问统计（迁移自 Hexo 安知鱼主题）
  if (isClient) {
    const script = document.createElement('script')
    script.src = 'https://sdk.51.la/js-sdk-pro.min.js'
    script.async = true
    script.onload = () => {
      // 51LA SDK 加载完成后注册全局 LA 对象
      ;(window as any).LA?.init({ id: '3QMSDLh40WIi9Wr4' })
    }
    document.head.appendChild(script)
  }
})
