<script setup lang="ts">
import { ref, watch, computed } from 'vue'

type Algo = 'waibibabo' | 'daodun'

const activeAlgo = ref<Algo>('waibibabo')
const inputText = ref('')
const outputText = ref('')
const showModal = ref(false)
const modalTab = ref<Algo>('waibibabo')

watch(activeAlgo, () => {
  inputText.value = ''
  outputText.value = ''
})

// ===== 歪比巴卜算法 =====
const WBB_MAP: Record<string, string> = { '00': '歪', '01': '比', '10': '巴', '11': '卜' }
const WBB_REV: Record<string, string> = { '歪': '00', '比': '01', '巴': '10', '卜': '11' }

function wbbEncrypt() {
  if (!inputText.value) { outputText.value = '请输入内容'; return }
  const bytes = new TextEncoder().encode(inputText.value)
  let r = ''
  for (const b of bytes) {
    const bin = b.toString(2).padStart(8, '0')
    for (let i = 0; i < 8; i += 2) r += WBB_MAP[bin.substring(i, i + 2)]
  }
  outputText.value = r
}

function wbbDecrypt() {
  const s = inputText.value.trim()
  if (!s) { outputText.value = '请输入内容'; return }
  if (s.length % 4 !== 0) { outputText.value = '密文长度必须是4的倍数'; return }
  let bin = ''
  for (const ch of s) {
    const b = WBB_REV[ch]
    if (b === undefined) { outputText.value = `非法字符：${ch}`; return }
    bin += b
  }
  const bytes: number[] = []
  for (let i = 0; i < bin.length; i += 8) bytes.push(parseInt(bin.substring(i, i + 8), 2))
  outputText.value = new TextDecoder().decode(new Uint8Array(bytes))
}

// ===== 刀盾算法 =====
const DD_MAP: Record<string, string> = { '00': '刀刀', '01': '刀盾', '10': '盾刀', '11': '盾盾' }
const DD_REV: Record<string, string> = { '刀刀': '00', '刀盾': '01', '盾刀': '10', '盾盾': '11' }

function ddEncrypt() {
  if (!inputText.value) { outputText.value = '请输入内容'; return }
  const bytes = new TextEncoder().encode(inputText.value)
  let r = '我的'
  for (const b of bytes) {
    const bin = b.toString(2).padStart(8, '0')
    for (let i = 0; i < 8; i += 2) r += DD_MAP[bin.substring(i, i + 2)]
  }
  outputText.value = r
}

function ddDecrypt() {
  let s = inputText.value.trim()
  if (!s) { outputText.value = '请输入内容'; return }
  if (!s.startsWith('我的')) { outputText.value = '密文必须以"我的"开头'; return }
  s = s.substring(2)
  let bin = ''
  for (let i = 0; i < s.length; i += 2) {
    const pair = s.substring(i, i + 2)
    const b = DD_REV[pair]
    if (b === undefined) { outputText.value = `非法词组：${pair}`; return }
    bin += b
  }
  const bytes: number[] = []
  for (let i = 0; i < bin.length; i += 8) bytes.push(parseInt(bin.substring(i, i + 8), 2))
  outputText.value = new TextDecoder().decode(new Uint8Array(bytes))
}

function doEncrypt() {
  activeAlgo.value === 'waibibabo' ? wbbEncrypt() : ddEncrypt()
}

function doDecrypt() {
  activeAlgo.value === 'waibibabo' ? wbbDecrypt() : ddDecrypt()
}

function swapIO() {
  const tmp = inputText.value
  inputText.value = outputText.value
  outputText.value = tmp
}

function openModal(algo: Algo) {
  modalTab.value = algo
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value = false
  document.body.style.overflow = ''
}

const algoImg = computed(() => activeAlgo.value === 'waibibabo'
  ? 'https://yuumii.top/sys/waibibabu.jpg'
  : 'https://yuumii.top/sys/wodedaodun.jpg')
</script>

<template>
  <div class="crypto-root">
    <!-- 算法切换栏 -->
    <div class="crypto-bar">
      <div class="crypto-tabs">
        <button
          class="crypto-tab"
          :class="{ active: activeAlgo === 'waibibabo' }"
          @click="activeAlgo = 'waibibabo'"
        >歪比巴卜</button>
        <button
          class="crypto-tab"
          :class="{ active: activeAlgo === 'daodun' }"
          @click="activeAlgo = 'daodun'"
        >刀盾算法</button>
      </div>
      <button class="crypto-algo-info" @click="openModal(activeAlgo)">算法原理</button>
    </div>

    <!-- 输入框 -->
    <div class="crypto-input-wrap">
      <span class="crypto-input-label">输入</span>
      <div class="crypto-input-box">
        <textarea
          v-model="inputText"
          class="crypto-input"
          :placeholder="activeAlgo === 'waibibabo' ? '请输入明文或密文（歪比巴卜）...' : '请输入明文或密文（刀盾算法）...'"
        ></textarea>
        <img class="crypto-input-img" :src="algoImg" alt="algo" loading="lazy">
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="crypto-actions">
      <button class="crypto-act encrypt" @click="doEncrypt">加密</button>
      <button class="crypto-act swap" @click="swapIO" title="交换输入输出">&#8645;</button>
      <button class="crypto-act decrypt" @click="doDecrypt">解密</button>
    </div>

    <!-- 输出框 -->
    <div class="crypto-output-wrap">
      <span class="crypto-input-label">输出</span>
      <textarea
        v-model="outputText"
        class="crypto-input crypto-output"
        placeholder="结果将显示在这里..."
        readonly
      ></textarea>
    </div>
  </div>

  <!-- 算法说明弹窗 -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-box">
          <div class="modal-header">
            <h3 class="modal-title">算法原理</h3>
            <button class="modal-x" @click="closeModal">&times;</button>
          </div>

          <div class="modal-tabs">
            <button
              class="modal-tab"
              :class="{ active: modalTab === 'waibibabo' }"
              @click="modalTab = 'waibibabo'"
            >歪比巴卜</button>
            <button
              class="modal-tab"
              :class="{ active: modalTab === 'daodun' }"
              @click="modalTab = 'daodun'"
            >刀盾算法</button>
          </div>

          <div v-if="modalTab === 'waibibabo'" class="modal-content">
            <p>将文本以 <strong>UTF-8</strong> 编码为字节，每个字节的 8 个二进制位按每 2 位一组，映射到 <strong>"歪比巴卜"</strong> 四个汉字。</p>
            <h4>映射表</h4>
            <table>
              <thead><tr><th>二进制</th><th>00</th><th>01</th><th>10</th><th>11</th></tr></thead>
              <tbody><tr><td>汉字</td><td>歪</td><td>比</td><td>巴</td><td>卜</td></tr></tbody>
            </table>
            <h4>示例</h4>
            <p class="example"><code>a</code> (0x61 → <code>01100001</code>) → <code>01 10 00 01</code> → <strong>比巴歪比</strong></p>
          </div>

          <div v-if="modalTab === 'daodun'" class="modal-content">
            <p>将文本以 <strong>UTF-8</strong> 编码为字节，密文以 <strong>"我的"</strong> 开头标记，之后每 2 个二进制位映射到二字词组。</p>
            <h4>映射表</h4>
            <table>
              <thead><tr><th>二进制</th><th>00</th><th>01</th><th>10</th><th>11</th></tr></thead>
              <tbody><tr><td>词组</td><td>刀刀</td><td>刀盾</td><td>盾刀</td><td>盾盾</td></tr></tbody>
            </table>
            <h4>示例</h4>
            <p class="example"><code>a</code> (0x61 → <code>01100001</code>) → <code>01 10 00 01</code> → <strong>我的刀盾盾刀刀刀刀盾</strong></p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.crypto-root {
  width: 100%;
}

/* =============================================
   算法切换栏
   ============================================= */
.crypto-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.crypto-tabs {
  display: flex;
  gap: 2px;
  border-radius: 10px;
  background: var(--va-c-bg-soft, #f3f4f6);
  padding: 3px;
}
.crypto-tab {
  padding: 7px 22px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: var(--va-c-text-light);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.crypto-tab.active {
  background: var(--va-c-bg, #fff);
  color: var(--va-c-text);
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.crypto-tab:hover:not(.active) {
  color: var(--va-c-text);
}
.crypto-algo-info {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border: 1px solid var(--va-c-border, rgba(128,128,128,0.15));
  border-radius: 10px;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--va-c-text-light);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.crypto-algo-info::before {
  content: '?';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4A6CF7;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}
.crypto-algo-info:hover {
  border-color: #4A6CF7;
  color: #4A6CF7;
}

/* =============================================
   输入框 / 输出框
   ============================================= */
.crypto-input-wrap {
  position: relative;
}
.crypto-input-label {
  position: absolute;
  top: -10px;
  left: 16px;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #4A6CF7;
  background: var(--va-c-bg, #fff);
  border-radius: 4px;
  letter-spacing: 1px;
  z-index: 1;
}

/* 输入框容器（flex 布局，textarea + 图片） */
.crypto-input-box {
  display: flex;
  align-items: stretch;
  border: 1.5px solid var(--va-c-border, rgba(128,128,128,0.18));
  border-radius: 14px;
  background: var(--va-c-bg, #fff);
  overflow: hidden;
  transition: border-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.crypto-input-box:focus-within {
  border-color: #4A6CF7;
  box-shadow: 0 0 0 4px rgba(74,108,247,0.08);
}

.crypto-input {
  flex: 1;
  min-height: 220px;
  padding: 24px 20px;
  border: none;
  border-radius: 0;
  font-size: 15px;
  font-family: var(--va-font-serif, inherit);
  line-height: 1.9;
  background: transparent;
  color: var(--va-c-text);
  resize: vertical;
  box-sizing: border-box;
}
.crypto-input:focus {
  outline: none;
}
.crypto-input::placeholder {
  color: var(--va-c-text-light);
  opacity: 0.35;
}

/* 输入框内右侧图片 */
.crypto-input-img {
  height: 100%;
  width: auto;
  max-height: 260px;
  object-fit: contain;
  flex-shrink: 0;
  align-self: center;
  padding: 12px 16px 12px 0;
  opacity: 0.85;
  transition: opacity 0.3s;
  box-sizing: border-box;
}

.crypto-output-wrap {
  position: relative;
  margin-top: 4px;
}
.crypto-output {
  width: 100%;
  background: var(--va-c-bg-soft, #f8f9fb);
  cursor: default;
  min-height: 160px;
  border: 1.5px solid var(--va-c-border, rgba(128,128,128,0.18));
  border-radius: 14px;
  box-sizing: border-box;
}
.crypto-output:focus {
  border-color: var(--va-c-border, rgba(128,128,128,0.18));
  box-shadow: none;
  outline: none;
}

/* =============================================
   操作按钮
   ============================================= */
.crypto-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 20px 0;
}
.crypto-act {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 36px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 加密：深沉蓝 */
.crypto-act.encrypt {
  background: #4A6CF7;
  color: #fff;
  box-shadow: 0 2px 8px rgba(74,108,247,0.25);
}
.crypto-act.encrypt:hover {
  background: #3D5FE5;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(74,108,247,0.32);
}

/* 解密：靛蓝偏青 */
.crypto-act.decrypt {
  background: #5E81AC;
  color: #fff;
  box-shadow: 0 2px 8px rgba(94,129,172,0.25);
}
.crypto-act.decrypt:hover {
  background: #4C6F9A;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(94,129,172,0.32);
}

/* 交换按钮 */
.crypto-act.swap {
  width: 46px;
  height: 46px;
  padding: 0;
  border-radius: 50%;
  background: var(--va-c-bg-soft, #f3f4f6);
  color: var(--va-c-text-light);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  border: 1px solid var(--va-c-border, rgba(128,128,128,0.1));
}
.crypto-act.swap:hover {
  background: #EFF2FE;
  color: #4A6CF7;
  border-color: rgba(74,108,247,0.2);
}

/* =============================================
   弹窗
   ============================================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10001;
  background: rgba(15,23,42,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(6px);
}
.modal-box {
  position: relative;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--va-c-bg, #fff);
  border-radius: 18px;
  padding: 0;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 28px 0;
}
.modal-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--va-c-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.modal-title::before {
  content: '';
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: #4A6CF7;
  display: inline-block;
}
.modal-x {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--va-c-bg-soft, #f3f4f6);
  color: var(--va-c-text-light);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.modal-x:hover {
  background: #EFF2FE;
  color: #4A6CF7;
}

.modal-tabs {
  display: flex;
  gap: 0;
  margin: 18px 28px 0;
  border-bottom: 1.5px solid var(--va-c-border, rgba(128,128,128,0.12));
}
.modal-tab {
  padding: 10px 22px 12px;
  border: none;
  background: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--va-c-text-light);
  border-bottom: 2px solid transparent;
  margin-bottom: -1.5px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.modal-tab.active {
  color: #4A6CF7;
  border-bottom-color: #4A6CF7;
}
.modal-tab:hover:not(.active) {
  color: var(--va-c-text);
}

.modal-content {
  padding: 22px 28px 28px;
  font-size: 14px;
  line-height: 2;
  color: var(--va-c-text);
}
.modal-content h4 {
  margin: 22px 0 10px;
  font-size: 13px;
  font-weight: 700;
  color: #4A6CF7;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.modal-content p {
  margin: 0 0 10px;
  opacity: 0.85;
}
.modal-content table {
  width: 100%;
  margin: 10px 0 18px;
  font-size: 13px;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--va-c-border, rgba(128,128,128,0.12));
}
.modal-content th,
.modal-content td {
  padding: 10px 14px;
  text-align: center;
}
.modal-content thead th {
  background: #F0F4FF;
  color: #4A6CF7;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.5px;
}
.modal-content tbody td {
  border-top: 1px solid var(--va-c-border, rgba(128,128,128,0.08));
  font-size: 14px;
  font-weight: 500;
}
.modal-content tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}
.modal-content tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
}
.modal-content .example {
  padding: 14px 16px;
  border-radius: 10px;
  background: #F0F4FF;
  font-size: 13px;
  line-height: 2;
  border: 1px solid rgba(74,108,247,0.1);
}
.modal-content .example strong {
  color: #4A6CF7;
}
.modal-content .example code {
  background: rgba(74,108,247,0.06);
  color: #4A6CF7;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
}

/* modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-box {
  transform: scale(0.94) translateY(12px);
}
.modal-leave-to .modal-box {
  transform: scale(0.94) translateY(12px);
}

/* =============================================
   暗色模式
   ============================================= */
:global(html[data-theme="dark"]) .crypto-input-box {
  background: rgba(255,255,255,0.03);
  border-color: rgba(255,255,255,0.08);
}
:global(html[data-theme="dark"]) .crypto-output {
  background: rgba(255,255,255,0.02);
}
:global(html[data-theme="dark"]) .crypto-input-label {
  background: var(--va-c-bg);
}
:global(html[data-theme="dark"]) .modal-content .example {
  background: rgba(74,108,247,0.08);
  border-color: rgba(74,108,247,0.15);
}
:global(html[data-theme="dark"]) .modal-content thead th {
  background: rgba(74,108,247,0.12);
}

/* =============================================
   移动端
   ============================================= */
@media screen and (max-width: 500px) {
  .crypto-input {
    min-height: 160px;
    padding: 18px 14px;
    font-size: 14px;
  }
  .crypto-output {
    min-height: 120px;
  }
  .crypto-act {
    padding: 12px 24px;
    font-size: 13px;
    border-radius: 10px;
  }
  .crypto-act.swap {
    width: 40px;
    height: 40px;
  }
  .modal-box {
    border-radius: 14px;
    max-width: calc(100vw - 32px);
  }
  .modal-header {
    padding: 18px 18px 0;
  }
  .modal-tabs {
    margin: 14px 18px 0;
  }
  .modal-content {
    padding: 16px 18px 22px;
  }
  .crypto-tab {
    padding: 6px 16px;
    font-size: 13px;
  }
  .crypto-input-img {
    max-height: 100px;
    padding: 8px 10px 8px 0;
  }
}
</style>
