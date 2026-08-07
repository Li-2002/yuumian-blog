<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Album {
  slug: string
  title: string
  description?: string
  cover: string
  photos: string[]
}

interface AlbumsData {
  albums: Album[]
}

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const albums = ref<Album[]>([])
const currentSlug = ref('')
const lightboxSrc = ref('')
const showLightbox = ref(false)

const currentAlbum = computed(() =>
  albums.value.find(a => a.slug === currentSlug.value)
)

function openAlbum(slug: string) {
  currentSlug.value = slug
  router.replace({ hash: `#${slug}` })
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

function closeAlbum() {
  currentSlug.value = ''
  router.replace({ hash: '' })
}

function openLightbox(src: string) {
  lightboxSrc.value = src
  showLightbox.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  showLightbox.value = false
  document.body.style.overflow = ''
  setTimeout(() => { lightboxSrc.value = '' }, 300)
}

function onLightboxOverlay(e: MouseEvent) {
  if (e.target === e.currentTarget) closeLightbox()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showLightbox.value) closeLightbox()
}

onMounted(async () => {
  document.addEventListener('keydown', onKeydown)

  try {
    const res = await fetch('/data/albums.json')
    if (!res.ok) throw new Error('加载失败')
    const data: AlbumsData = await res.json()
    albums.value = data.albums || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
    // 检查初始 hash
    const hash = route.hash?.replace('#', '')
    if (hash) currentSlug.value = hash
  }
})

// 监听浏览器 hash 变化（前进/后退）
watch(() => route.hash, (val) => {
  const slug = (val || '').replace('#', '')
  currentSlug.value = slug
})
</script>

<template>
  <div class="album-page">
    <!-- 列表视图 -->
    <div v-if="!currentSlug">
      <div v-if="loading" class="album-state">加载中...</div>
      <template v-else-if="albums.length === 0">
        <div class="album-state">暂无相册</div>
      </template>
      <template v-else>
        <div class="album-list-grid">
          <a
            v-for="album in albums"
            :key="album.slug"
            class="album-list-card"
            href="javascript:void(0)"
            @click="openAlbum(album.slug)"
          >
            <div class="album-list-cover">
              <img :src="album.cover" :alt="album.title" loading="lazy" />
            </div>
            <div class="album-list-body">
              <h3 class="album-list-title">{{ album.title }}</h3>
              <div class="album-list-meta">
                <span>{{ album.photos?.length || 0 }} 张照片</span>
                <span v-if="album.description">{{ album.description }}</span>
              </div>
            </div>
          </a>
        </div>
      </template>
    </div>

    <!-- 详情视图 -->
    <div v-else-if="currentAlbum">
      <div class="album-detail-header">
        <a class="album-back-btn" href="javascript:void(0)" @click="closeAlbum">&larr; 返回相册</a>
        <div class="album-detail-info">
          <img class="album-detail-cover" :src="currentAlbum.cover" :alt="currentAlbum.title" />
          <div>
            <h2 class="album-detail-title">{{ currentAlbum.title }}</h2>
            <p class="album-detail-count">{{ currentAlbum.photos?.length || 0 }} 张照片</p>
          </div>
        </div>
      </div>
      <div class="album-masonry">
        <div
          v-for="(src, i) in currentAlbum.photos"
          :key="i"
          class="photo-card"
          @click="openLightbox(src)"
        >
          <img :src="src" alt="" loading="lazy" />
        </div>
      </div>
    </div>

    <!-- 未找到 -->
    <div v-else class="album-state">相册不存在</div>
  </div>

  <!-- Lightbox -->
  <Teleport to="body">
    <Transition name="lb-fade">
      <div v-if="showLightbox" class="album-lightbox" @click="onLightboxOverlay">
        <span class="album-lightbox-close" @click="closeLightbox">&times;</span>
        <img :src="lightboxSrc" alt="" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.album-page {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

/* ===== 列表卡片 ===== */
.album-list-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.album-list-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  display: block;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease;
}
.album-list-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 36px rgba(0,0,0,0.10);
}
.album-list-cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  overflow: hidden;
}
.album-list-cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.album-list-card:hover .album-list-cover img {
  transform: scale(1.06);
}
.album-list-cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.48) 0%, transparent 55%);
  z-index: 1;
}
.album-list-body {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 48px 22px 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 100%);
}
.album-list-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
  line-height: 1.3;
}
.album-list-meta {
  font-size: 13px;
  color: rgba(255,255,255,0.75);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 14px;
}

/* ===== 详情视图 ===== */
.album-detail-header {
  margin-bottom: 28px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--va-c-border, rgba(128,128,128,0.12));
}
.album-back-btn {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: var(--va-c-text-light);
  opacity: 0.7;
  text-decoration: none;
  margin-bottom: 18px;
  cursor: pointer;
  transition: opacity 0.2s, color 0.2s;
}
.album-back-btn:hover {
  opacity: 1;
  color: var(--va-c-primary, #667eea);
}
.album-detail-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.album-detail-cover {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}
.album-detail-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--va-c-text);
  margin: 0 0 2px;
}
.album-detail-count {
  font-size: 13px;
  color: var(--va-c-text-light);
  opacity: 0.55;
  margin: 0;
}

/* ===== 瀑布流 ===== */
.album-masonry {
  column-count: 3;
  column-gap: 16px;
}
.photo-card {
  break-inside: avoid;
  margin-bottom: 16px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.35s ease;
}
.photo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.09);
}
.photo-card img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.photo-card:hover img {
  transform: scale(1.04);
}

/* ===== Lightbox ===== */
.album-lightbox {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0,0,0,0.93);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.album-lightbox img {
  max-width: 92vw;
  max-height: 92vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  user-select: none;
}
.album-lightbox-close {
  position: absolute;
  top: 20px;
  right: 30px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  z-index: 1;
  transition: color 0.2s;
  user-select: none;
}
.album-lightbox-close:hover {
  color: #fff;
}

/* Transition */
.lb-fade-enter-active,
.lb-fade-leave-active {
  transition: opacity 0.3s ease;
}
.lb-fade-enter-from,
.lb-fade-leave-to {
  opacity: 0;
}

/* State */
.album-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--va-c-text-light);
  opacity: 0.5;
  font-size: 15px;
}

/* Dark */
:global(html[data-theme="dark"]) .album-list-card:hover {
  box-shadow: 0 14px 36px rgba(0,0,0,0.4);
}
:global(html[data-theme="dark"]) .photo-card:hover {
  box-shadow: 0 8px 28px rgba(0,0,0,0.4);
}

/* Responsive */
@media screen and (max-width: 768px) {
  .album-list-grid {
    gap: 14px;
  }
  .album-list-body {
    padding: 40px 18px 16px;
  }
  .album-list-title {
    font-size: 17px;
  }
  .album-masonry {
    column-count: 2;
    column-gap: 10px;
  }
  .photo-card {
    margin-bottom: 10px;
    border-radius: 8px;
  }
}
@media screen and (max-width: 480px) {
  .album-list-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .album-masonry {
    column-count: 1;
  }
  .album-detail-info {
    gap: 12px;
  }
  .album-detail-cover {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }
  .album-detail-title {
    font-size: 18px;
  }
}
</style>
