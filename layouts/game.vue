<template>
  <div class="game-layout">
    <RouterView />
    <YunFooter />
  </div>
</template>

<style scoped>
.game-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
