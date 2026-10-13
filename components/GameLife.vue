<script setup lang="ts">
import { ref } from 'vue'

interface Game {
  id: string
  name: string
  spec: string
  category: string
  playTime: string
  desc: string
  image: string
  link: string
}

defineProps<{
  games: Game[]
  steam: string
}>()

const openGames = ref(new Set<string>())

function toggleGame(id: string) {
  if (openGames.value.has(id))
    openGames.value.delete(id)
  else
    openGames.value.add(id)
}
</script>

<template>
  <main class="game-life" aria-labelledby="game-life-title">
    <header class="game-life-header">
      <div>
        <h1 id="game-life-title">游戏人生</h1>
        <p>跟雨眠一起探索第九艺术。</p>
      </div>
      <a :href="steam" target="_blank" rel="noopener noreferrer" class="game-life-steam">
        <i class="i-ri-steam-line" aria-hidden="true" />
        Steam
        <i class="i-ri-arrow-right-up-line" aria-hidden="true" />
      </a>
    </header>

    <div class="game-shelf">
      <article v-for="game, index in games" :key="game.id" class="game-sleeve" :class="{ 'is-open': openGames.has(game.id) }">
        <div class="game-sleeve-trigger">
          <div class="game-cover">
            <img :src="game.image" :alt="`${game.name}封面`" :loading="index === 0 ? 'eager' : 'lazy'" width="240" height="240">
          </div>
          <div class="game-notes">
            <span class="game-category">{{ game.category }}</span>
            <h2>{{ game.name }}</h2>
            <p class="game-spec">{{ game.spec }}</p>
            <p class="game-description">{{ game.desc }}</p>
            <div class="game-note-footer">
              <span class="game-play-time">
                <i class="i-ri-time-line" aria-hidden="true" />
                游玩时间 {{ game.playTime }}
              </span>
              <span class="game-open-hint">
                <span class="game-hint-closed">展开感想</span>
                <span class="game-hint-open">收起感想</span>
                <i class="i-ri-add-line" aria-hidden="true" />
              </span>
            </div>
          </div>
          <button
            type="button"
            class="game-toggle"
            :aria-label="`${game.name}：${openGames.has(game.id) ? '收起' : '展开'}感想`"
            :aria-expanded="openGames.has(game.id)"
            :aria-controls="`game-reflection-${game.id}`"
            @click="toggleGame(game.id)"
          />
        </div>
        <div
          :id="`game-reflection-${game.id}`"
          class="game-reflection-collapse"
          role="region"
          :aria-label="`${game.name}的感想`"
          :aria-hidden="!openGames.has(game.id)"
          :inert="!openGames.has(game.id)"
        >
          <div class="game-reflection-clip">
            <div class="game-reflection">
              <div class="game-reflection-body markdown-body">
                <slot :name="game.id">
                  <p>感想待补。</p>
                </slot>
              </div>
              <a :href="game.link" target="_blank" rel="noopener noreferrer" class="game-original-link">
                了解这款游戏
                <i class="i-ri-arrow-right-up-line" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  </main>
</template>

<style scoped>
.game-life {
  width: calc(100% - 48px);
  max-width: var(--yun-post-card-max-width, 900px);
  margin: 100px auto 64px;
  color: var(--va-c-text);
}

.game-life-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgb(122 122 122 / 0.15);
}

.game-life-header h1 {
  margin: 0;
  padding: 0;
  border: 0;
  font-family: var(--va-font-serif);
  font-size: 32px;
  font-weight: 900;
  line-height: 1.4;
  letter-spacing: 0.08em;
}

.game-life-header p {
  margin: 10px 0 0;
  color: var(--va-c-text-light);
  font-size: 14px;
}

.game-life-steam,
.game-original-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  color: var(--va-c-text-light);
  font-size: 12px;
  text-decoration: none;
}

.game-life-steam:hover,
.game-original-link:hover {
  color: var(--va-c-primary);
}

.game-shelf {
  display: grid;
  gap: 32px;
}

.game-sleeve {
  min-width: 0;
}

.game-sleeve-trigger {
  position: relative;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  align-items: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.game-toggle {
  position: absolute;
  z-index: 3;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
}

.game-toggle:focus-visible {
  outline: 2px solid var(--va-c-primary);
  outline-offset: 8px;
  border-radius: 8px;
}

.game-cover {
  position: relative;
  z-index: 2;
  aspect-ratio: 1;
  padding: 7px;
  border: 1px solid rgb(122 122 122 / 0.16);
  border-radius: 4px;
  background: var(--va-c-bg);
  box-shadow: 2px 4px 12px rgb(0 0 0 / 0.1);
}

.game-cover::after {
  position: absolute;
  inset: 7px auto 7px 7px;
  width: 9px;
  border-right: 1px solid rgb(255 255 255 / 0.16);
  background: linear-gradient(90deg, rgb(0 0 0 / 0.2), transparent);
  content: '';
  pointer-events: none;
}

.game-cover img {
  display: block;
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  margin: 0;
  border-radius: 1px;
  object-fit: cover;
}

.game-notes {
  position: relative;
  min-width: 0;
  min-height: 210px;
  margin-left: -18px;
  padding: 22px 32px 20px 44px;
  border: 1px solid rgb(122 122 122 / 0.15);
  border-radius: 0 6px 6px 0;
  background: var(--va-c-bg);
  box-shadow: 4px 5px 16px rgb(0 0 0 / 0.035);
  transition: transform 240ms ease, box-shadow 240ms ease;
}

.game-notes::before {
  position: absolute;
  z-index: -1;
  inset: 5px -5px -5px 24px;
  border: 1px solid rgb(122 122 122 / 0.12);
  border-radius: 0 6px 6px 0;
  background: var(--va-c-bg-soft);
  content: '';
}

.game-category {
  color: var(--va-c-text-light);
  font-size: 11px;
  letter-spacing: 0.1em;
}

.game-notes h2 {
  margin: 8px 0 5px;
  padding: 0;
  border: 0;
  font-family: var(--va-font-serif);
  font-size: 25px;
  font-weight: 800;
  line-height: 1.4;
}

.game-spec {
  margin: 0;
  color: var(--va-c-text-light);
  font-size: 12px;
  line-height: 1.6;
}

.game-description {
  margin: 14px 0 16px;
  font-size: 14px;
  line-height: 1.8;
}

.game-note-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
}

.game-play-time {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--va-c-text-light);
  font-size: 11px;
  line-height: 1.6;
}

.game-play-time i {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

.game-open-hint {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--va-c-primary);
  font-size: 12px;
}

.game-open-hint i {
  width: 16px;
  height: 16px;
  transition: transform 240ms ease;
}

.game-hint-open,
.game-sleeve.is-open .game-hint-closed {
  display: none;
}

.game-sleeve.is-open .game-hint-open {
  display: inline;
}

.game-sleeve.is-open .game-open-hint i {
  transform: rotate(45deg);
}

.game-reflection-collapse {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transform: translateY(-6px);
  transition: grid-template-rows 360ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 240ms ease, transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

.game-sleeve.is-open .game-reflection-collapse {
  grid-template-rows: 1fr;
  opacity: 1;
  transform: translateY(0);
}

.game-reflection-clip {
  min-height: 0;
  overflow: hidden;
}

.game-reflection {
  margin: 20px 0 0 240px;
  padding: 22px 28px 12px;
  border-left: 2px solid color-mix(in srgb, var(--va-c-primary) 25%, transparent);
  background: var(--va-c-bg-opacity);
}

.game-reflection-body {
  font-size: 14px;
  line-height: 1.9;
  overflow-wrap: anywhere;
}

.game-reflection-body :deep(p) {
  margin: 0 0 16px;
}

.game-reflection-body :deep(img) {
  max-width: 100%;
  height: auto;
}

@media (hover: hover) {
  .game-sleeve-trigger:hover .game-notes {
    transform: translateX(6px);
    box-shadow: 4px 8px 20px rgb(0 0 0 / 0.07);
  }
}

@media (width < 640px) {
  .game-life {
    width: calc(100% - 32px);
    margin: 76px auto 40px;
  }

  .game-life-header {
    gap: 12px;
    margin-bottom: 28px;
    padding-bottom: 18px;
  }

  .game-life-header h1 {
    font-size: 26px;
  }

  .game-life-header p {
    font-size: 12px;
  }

  .game-shelf {
    gap: 24px;
  }

  .game-sleeve-trigger {
    grid-template-columns: 38% minmax(0, 1fr);
  }

  .game-cover {
    padding: 4px;
  }

  .game-cover::after {
    inset: 4px auto 4px 4px;
    width: 5px;
  }

  .game-notes {
    min-height: 170px;
    margin-left: -10px;
    padding: 14px 12px 12px 22px;
  }

  .game-category {
    font-size: 10px;
    letter-spacing: 0;
  }

  .game-notes h2 {
    margin-top: 6px;
    font-size: 18px;
  }

  .game-spec {
    overflow: hidden;
    font-size: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .game-description {
    margin: 10px 0 12px;
    font-size: 12px;
    line-height: 1.7;
  }

  .game-reflection {
    margin: 20px 0 0;
    padding: 18px 16px 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .game-notes,
  .game-open-hint i {
    transition: none;
  }

  .game-reflection-collapse {
    transform: none;
    transition: grid-template-rows 180ms ease, opacity 180ms ease;
  }

  .game-sleeve-trigger:hover .game-notes {
    transform: none;
  }
}
</style>
