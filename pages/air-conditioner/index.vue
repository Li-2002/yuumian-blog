<script setup lang="ts">
</script>

<template>
  <h2 class="ac-title">雨眠牌空调！</h2>
  <div class="ac-wrapper">
    <iframe src="https://air-conditioner-vue-six.vercel.app"></iframe>
  </div>
</template>

<style scoped>
.ac-title {
  color: var(--va-c-primary, #4259ef);
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  padding: 30px 0 10px;
}
.ac-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  background: transparent;
  border-radius: 12px;
  padding: 20px 0;
}
.ac-wrapper iframe {
  width: 100%;
  max-width: 420px;
  height: 740px;
  border: none;
  border-radius: 12px;
}
</style>
