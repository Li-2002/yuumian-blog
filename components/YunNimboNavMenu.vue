<script setup lang="ts">
import { useAppStore, useSiteConfig, useValaxyI18n } from 'valaxy'
import { useThemeConfig } from '../node_modules/valaxy-theme-yun/composables/config'
import { useYunAppStore } from '../node_modules/valaxy-theme-yun/stores/app'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const { $t } = useValaxyI18n()
const yunApp = useYunAppStore()
const app = useAppStore()
const siteConfig = useSiteConfig()
const themeConfig = useThemeConfig()
const route = useRoute()
const showMenu = ref(true)
const playAnimation = computed(() => yunApp.scrollY > 10)

const centerLinks = [
  { title: '分类', to: '/categories/', icon: 'i-ri-folder-2-line' },
  { title: '首页', to: '/', icon: 'i-ri-home-4-line' },
  { title: '游戏人生', to: '/game/', icon: 'i-ri-game-line' },
]

onMounted(() => {
  if (route.meta.layout === 'home') {
    showMenu.value = false
    setTimeout(() => {
      showMenu.value = true
    }, 600)
  }
})
</script>

<template>
  <Transition enter-active-class="animate-fade-in">
    <div
      v-if="showMenu"
      class="yun-nav-menu z-$yun-z-nav-menu fixed bg-transparent"
      :class="{ 'shadow play': playAnimation }"
    >
      <div class="inline-flex justify-start items-center flex-1">
        <ValaxyHamburger
          :active="yunApp.fullscreenMenu.isOpen"
          class="menu-btn sidebar-toggle leading-4 size-12 lg:hidden"
          inline-flex cursor="pointer"
          hover="bg-white/80 dark:bg-black/80"
          z="$yun-z-menu-btn"
          @click="yunApp.fullscreenMenu.toggle()"
        />
        <div class="hidden lg:contents">
          <YunNavMenuItem
            v-for="item, i in themeConfig.nav"
            :key="i"
            :icon="item.icon"
            :to="item.link"
            :title="$t(item.text)"
            :aria-label="$t(item.text)"
          />
        </div>
      </div>

      <nav class="yun-center-nav" aria-label="主要导航">
        <RouterLink
          v-for="link in centerLinks"
          :key="link.to"
          :to="link.to"
          :title="link.title"
          :aria-label="link.title"
          class="yun-center-nav-item"
        >
          <i :class="link.icon" aria-hidden="true" />
        </RouterLink>
      </nav>

      <div class="inline-flex-center justify-end items-center flex-1">
        <YunToggleLocale
          v-if="app.showToggleLocale"
          class="yun-nav-locale rounded-none! hidden sm:inline-flex"
        />
        <YunToggleDark class="rounded-none!" transition />
        <YunSearchTrigger v-if="siteConfig.search.enable" />
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.yun-nav-menu {
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: space-between;
  height: var(--yun-nav-height, 50px);
  transition: background-color var(--va-transition-duration-moderate),
    backdrop-filter var(--va-transition-duration-moderate),
    box-shadow var(--va-transition-duration-moderate);

  &.play {
    background-color: var(--yun-nav-bg-color);
    backdrop-filter: blur(var(--yun-nav-blur));
    -webkit-backdrop-filter: blur(var(--yun-nav-blur));
  }
}

.yun-center-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
}

.yun-center-nav-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  color: var(--va-c-text);
  opacity: 0.8;
  transition: color var(--va-transition-duration), background-color var(--va-transition-duration);

  i {
    width: 24px;
    height: 24px;
  }

  &:hover,
  &.router-link-exact-active {
    color: var(--va-c-primary);
    background-color: var(--va-c-bg-opacity);
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid var(--va-c-primary);
    outline-offset: 2px;
  }
}

@media (width < 640px) {
  .yun-nav-locale {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .yun-center-nav-item {
    transition: none;
  }
}
</style>
