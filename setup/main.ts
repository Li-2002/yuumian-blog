import { defineAppSetup } from 'valaxy'

export default defineAppSetup(({ router, isClient }) => {
  if (!isClient)
    return

  // 分片加载失败兜底：重新部署后，仍停留在旧页面的浏览器会引用已删除的 hash 文件，
  // 导致动态导入失败（Failed to fetch dynamically imported module），此时自动刷新一次
  const reloadFlag = 'valaxy:chunk-load-error-reloaded'
  router.onError((error) => {
    const message = error?.message || ''
    const isChunkLoadError = /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk \S+ failed/i.test(message)
    if (!isChunkLoadError || sessionStorage.getItem(reloadFlag))
      return
    sessionStorage.setItem(reloadFlag, '1')
    location.reload()
  })
  // 页面正常加载后清除标记，保证下次部署仍能自动恢复
  router.afterEach(() => {
    sessionStorage.removeItem(reloadFlag)
  })

  // 51LA 访问统计（迁移自 Hexo 安知鱼主题）
  const laScript = document.createElement('script')
  laScript.src = 'https://sdk.51.la/js-sdk-pro.min.js'
  laScript.async = true
  laScript.onload = () => {
    ;(window as any).LA?.init({ id: '3QMSDLh40WIi9Wr4' })
  }
  document.head.appendChild(laScript)
})
