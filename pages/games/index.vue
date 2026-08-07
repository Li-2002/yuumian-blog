<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Game {
  name: string
  spec: string
  desc: string
  image: string
  link: string
}

interface Category {
  title: string
  description: string
  games: Game[]
}

interface GamesData {
  top_background?: string
  buttonText?: string
  buttonLink?: string
  categories: Category[]
}

const loading = ref(true)
const data = ref<GamesData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/data/games.json')
    if (!res.ok) throw new Error('加载失败')
    data.value = await res.json()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="games-page">
    <!-- 加载中 -->
    <div v-if="loading" class="games-loading">加载中...</div>

    <template v-if="data">
      <!-- Hero Banner -->
      <div v-if="data.top_background || data.buttonText" class="games-hero">
        <img v-if="data.top_background" class="games-hero-bg" :src="data.top_background" alt="" />
        <div class="games-hero-overlay">
          <span class="games-hero-title">游戏人生</span>
          <a
            v-if="data.buttonText && data.buttonLink"
            class="games-hero-btn"
            :href="data.buttonLink"
            target="_blank"
            rel="noopener"
          >{{ data.buttonText }}</a>
        </div>
      </div>

      <!-- 分类 -->
      <section v-for="(cat, ci) in data.categories" :key="ci" class="games-category">
        <div class="games-category-header">
          <h2 class="games-category-title">{{ cat.title }}</h2>
          <p v-if="cat.description" class="games-category-desc">{{ cat.description }}</p>
        </div>
        <div class="games-grid">
          <a
            v-for="(game, gi) in cat.games"
            :key="gi"
            class="game-card"
            :href="game.link || '#'"
            target="_blank"
            rel="noopener"
          >
            <div class="game-card-cover">
              <img :src="game.image" :alt="game.name" loading="lazy" />
              <span v-if="game.spec" class="game-card-spec">{{ game.spec }}</span>
            </div>
            <div class="game-card-body">
              <h3 class="game-card-name">{{ game.name }}</h3>
              <p v-if="game.desc" class="game-card-desc">{{ game.desc }}</p>
            </div>
          </a>
        </div>
      </section>

      <!-- 空状态 -->
      <div v-if="!data.categories || data.categories.length === 0" class="games-empty">
        暂无游戏
      </div>
    </template>
  </div>
</template>

<style scoped>
.games-page {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
}

/* Hero */
.games-hero {
  position: relative;
  width: 100%;
  height: 240px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.games-hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.45);
}
.games-hero-overlay {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.games-hero-title {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 20px rgba(0,0,0,0.5);
  letter-spacing: 6px;
}
.games-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 32px;
  border-radius: 24px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: 1px;
  transition: background 0.3s, transform 0.3s;
}
.games-hero-btn:hover {
  background: rgba(255,255,255,0.28);
  transform: translateY(-2px);
  color: #fff;
}

/* 分类 */
.games-category {
  margin-bottom: 48px;
}
.games-category:last-child {
  margin-bottom: 0;
}
.games-category-header {
  display: flex;
  align-items: baseline;
  gap: 18px;
  margin-bottom: 24px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--va-c-border, rgba(128,128,128,0.12));
}
.games-category-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--va-c-text);
  margin: 0;
  white-space: nowrap;
}
.games-category-desc {
  font-size: 14px;
  color: var(--va-c-text-light);
  opacity: 0.55;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Grid */
.games-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

/* Card */
.game-card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: var(--va-c-bg-soft, #f7f8fa);
  border: 1px solid transparent;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease, border-color 0.4s;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: column;
}
.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 38px rgba(0,0,0,0.10);
  border-color: var(--va-c-border, rgba(128,128,128,0.15));
}
.game-card-cover {
  position: relative;
  width: 100%;
  padding-top: 62.5%;
  overflow: hidden;
}
.game-card-cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.game-card:hover .game-card-cover img {
  transform: scale(1.06);
}
.game-card-cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 45%);
  opacity: 0;
  transition: opacity 0.4s;
  z-index: 1;
}
.game-card:hover .game-card-cover::after {
  opacity: 1;
}
.game-card-spec {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  padding: 3px 10px;
  border-radius: 10px;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  max-width: calc(100% - 16px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.game-card-body {
  padding: 16px 18px 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.game-card-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--va-c-text);
  margin: 0 0 8px;
  line-height: 1.3;
  transition: color 0.3s;
}
.game-card:hover .game-card-name {
  color: var(--va-c-primary, #667eea);
}
.game-card-desc {
  font-size: 13px;
  color: var(--va-c-text-light);
  opacity: 0.7;
  line-height: 1.8;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Loading / Empty */
.games-loading,
.games-empty {
  text-align: center;
  padding: 80px 20px;
  color: var(--va-c-text-light);
  opacity: 0.5;
  font-size: 15px;
}

/* Dark */
:global(html[data-theme="dark"]) .game-card {
  background: rgba(255,255,255,0.04);
}
:global(html[data-theme="dark"]) .game-card:hover {
  box-shadow: 0 14px 38px rgba(0,0,0,0.4);
}
:global(html[data-theme="dark"]) .games-hero-btn {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.12);
}

/* Responsive */
@media screen and (max-width: 768px) {
  .games-hero {
    height: 180px;
    border-radius: 16px;
    margin-bottom: 36px;
  }
  .games-hero-title {
    font-size: 26px;
    letter-spacing: 4px;
  }
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .games-category-title {
    font-size: 18px;
  }
}
@media screen and (max-width: 480px) {
  .games-hero {
    height: 150px;
    border-radius: 12px;
  }
  .games-hero-title {
    font-size: 22px;
    letter-spacing: 3px;
  }
  .games-grid {
    grid-template-columns: 1fr;
  }
  .games-category-header {
    flex-direction: column;
    gap: 4px;
    padding-bottom: 10px;
    margin-bottom: 16px;
  }
  .games-category-desc {
    white-space: normal;
  }
}
</style>
