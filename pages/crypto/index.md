---
title: 加密小工具
aside: false
---

<style>
  .crypto-page {
    max-width: 680px;
    margin: 0 auto;
  }
  .crypto-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 2px solid var(--va-c-border, #e5e7eb);
  }
  .crypto-tab {
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    background: none;
    font-size: 15px;
    font-weight: 600;
    color: var(--va-c-text-light);
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: color 0.2s, border-color 0.2s;
  }
  .crypto-tab.active {
    color: var(--va-c-primary, #667eea);
    border-bottom-color: var(--va-c-primary, #667eea);
  }
  .crypto-tab:hover {
    color: var(--va-c-primary, #667eea);
  }
  .crypto-section {
    display: none;
    padding: 20px;
    background: var(--va-c-bg-soft, #f9fafb);
    border-radius: 12px;
    margin-bottom: 16px;
  }
  .crypto-section.active {
    display: block;
  }
  .algo-desc {
    padding: 14px 18px;
    background: var(--va-c-bg-mute, #f3f4f6);
    border-radius: 10px;
    margin-bottom: 16px;
    line-height: 1.9;
    font-size: 14px;
  }
  .algo-desc h4 {
    margin: 0 0 8px;
    font-size: 15px;
    color: var(--va-c-primary);
  }
  .algo-desc table {
    width: 100%;
    margin: 10px 0;
    font-size: 13px;
  }
  .algo-desc table th,
  .algo-desc table td {
    padding: 6px 10px;
    border: 1px solid var(--va-c-border, #e5e7eb);
    text-align: center;
  }
  .algo-desc table th {
    background: var(--va-c-primary, #667eea);
    color: #fff;
  }
  .algo-example {
    margin: 10px 0;
    padding: 10px 14px;
    background: rgba(102, 126, 234, 0.08);
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.8;
  }
  .crypto-input-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }
  .crypto-input-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--va-c-border, #e5e7eb);
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    min-height: 80px;
    background: var(--va-c-bg, #fff);
    color: var(--va-c-text);
    transition: border-color 0.2s;
  }
  .crypto-input-group textarea:focus {
    outline: none;
    border-color: var(--va-c-primary, #667eea);
  }
  .crypto-btns {
    display: flex;
    gap: 10px;
  }
  .crypto-btn {
    flex: 1;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
  }
  .crypto-btn:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }
  .btn-encrypt {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
  }
  .btn-decrypt {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: #fff;
  }
  .crypto-result {
    padding: 12px;
    background: var(--va-c-bg, #fff);
    border: 1px solid var(--va-c-border, #e5e7eb);
    border-radius: 8px;
    font-size: 14px;
    word-break: break-all;
    min-height: 40px;
    line-height: 1.8;
    color: var(--va-c-text);
  }
</style>

<div class="crypto-page">
  <div class="crypto-tabs">
    <button class="crypto-tab active" data-tab="waibibabo">歪比巴卜算法</button>
    <button class="crypto-tab" data-tab="daodun">刀盾算法</button>
  </div>

  <!-- ==================== 歪比巴卜算法 ==================== -->
  <div id="waibibabo" class="crypto-section active">
    <div class="algo-desc">
      <h4>算法说明</h4>
      <p>所有字符使用 <strong>UTF-8 编码</strong>，每个字节由四个汉字表示（<strong>"歪比巴卜"</strong>）。</p>
      <h4>转换规则</h4>
      <table>
        <tr><th>二进制</th><th>汉字</th></tr>
        <tr><td>00</td><td>歪</td></tr>
        <tr><td>01</td><td>比</td></tr>
        <tr><td>10</td><td>巴</td></tr>
        <tr><td>11</td><td>卜</td></tr>
      </table>
      <div class="algo-example">
        <strong>示例：</strong><br>
        字符 <code>a</code> (0x61) → 二进制 <code>01100001</code> → 分组 <code>01 10 00 01</code> → 密文 <strong>比巴歪比</strong><br>
        字符 <code>A</code> (0x41) → 二进制 <code>01000001</code> → 分组 <code>01 00 00 01</code> → 密文 <strong>比歪歪比</strong>
      </div>
    </div>

    <div class="crypto-input-group">
      <textarea id="wbb-input" placeholder="请输入要加密/解密的文本..."></textarea>
      <div class="crypto-btns">
        <button class="crypto-btn btn-encrypt" onclick="wbbEncrypt()">🔒 加密</button>
        <button class="crypto-btn btn-decrypt" onclick="wbbDecrypt()">🔓 解密</button>
      </div>
      <div id="wbb-result" class="crypto-result">等待输入...</div>
    </div>
  </div>

  <!-- ==================== 刀盾算法 ==================== -->
  <div id="daodun" class="crypto-section">
    <div class="algo-desc">
      <h4>算法说明</h4>
      <p>所有字符使用 <strong>UTF-8 编码</strong>，首两个字固定为<strong>"我的"</strong>，之后每两个二进制位为一组转换。</p>
      <h4>转换规则</h4>
      <table>
        <tr><th>二进制</th><th>文字</th></tr>
        <tr><td>00</td><td>刀刀</td></tr>
        <tr><td>01</td><td>刀盾</td></tr>
        <tr><td>10</td><td>盾刀</td></tr>
        <tr><td>11</td><td>盾盾</td></tr>
      </table>
      <div class="algo-example">
        <strong>示例：</strong><br>
        字符 <code>a</code> (0x61) → 二进制 <code>01100001</code> → 分组 <code>01 10 00 01</code> → 密文 <strong>我的刀盾盾刀刀刀刀盾</strong><br>
        字符 <code>A</code> (0x41) → 二进制 <code>01000001</code> → 分组 <code>01 00 00 01</code> → 密文 <strong>我的刀盾刀刀刀刀刀盾</strong>
      </div>
    </div>

    <div class="crypto-input-group">
      <textarea id="dd-input" placeholder="请输入要加密/解密的文本..."></textarea>
      <div class="crypto-btns">
        <button class="crypto-btn btn-encrypt" onclick="ddEncrypt()">🔒 加密</button>
        <button class="crypto-btn btn-decrypt" onclick="ddDecrypt()">🔓 解密</button>
      </div>
      <div id="dd-result" class="crypto-result">等待输入...</div>
    </div>
  </div>
</div>

<script>
// ===== 歪比巴卜算法 =====
const WBB_MAP = { '00': '歪', '01': '比', '10': '巴', '11': '卜' }
const WBB_REV = { '歪': '00', '比': '01', '巴': '10', '卜': '11' }

function wbbEncrypt() {
  const input = document.getElementById('wbb-input').value
  if (!input) { document.getElementById('wbb-result').textContent = '请输入内容'; return }

  const encoder = new TextEncoder()
  const bytes = encoder.encode(input)
  let result = ''
  for (const byte of bytes) {
    const bin = byte.toString(2).padStart(8, '0')
    for (let i = 0; i < 8; i += 2) {
      result += WBB_MAP[bin.substring(i, i + 2)]
    }
  }
  document.getElementById('wbb-result').textContent = result
}

function wbbDecrypt() {
  const input = document.getElementById('wbb-input').value.trim()
  if (!input) { document.getElementById('wbb-result').textContent = '请输入内容'; return }
  if (input.length % 4 !== 0) { document.getElementById('wbb-result').textContent = '密文长度必须是4的倍数'; return }

  let binary = ''
  for (let i = 0; i < input.length; i++) {
    const bit = WBB_REV[input[i]]
    if (bit === undefined) { document.getElementById('wbb-result').textContent = `非法字符：${input[i]}`; return }
    binary += bit
  }

  const bytes = []
  for (let i = 0; i < binary.length; i += 8) {
    bytes.push(parseInt(binary.substring(i, i + 8), 2))
  }

  const decoder = new TextDecoder()
  document.getElementById('wbb-result').textContent = decoder.decode(new Uint8Array(bytes))
}

// ===== 刀盾算法 =====
const DD_MAP = { '00': '刀刀', '01': '刀盾', '10': '盾刀', '11': '盾盾' }
const DD_REV = { '刀刀': '00', '刀盾': '01', '盾刀': '10', '盾盾': '11' }

function ddEncrypt() {
  const input = document.getElementById('dd-input').value
  if (!input) { document.getElementById('dd-result').textContent = '请输入内容'; return }

  const encoder = new TextEncoder()
  const bytes = encoder.encode(input)
  let result = '我的'
  for (const byte of bytes) {
    const bin = byte.toString(2).padStart(8, '0')
    for (let i = 0; i < 8; i += 2) {
      result += DD_MAP[bin.substring(i, i + 2)]
    }
  }
  document.getElementById('dd-result').textContent = result
}

function ddDecrypt() {
  let input = document.getElementById('dd-input').value.trim()
  if (!input) { document.getElementById('dd-result').textContent = '请输入内容'; return }
  if (!input.startsWith('我的')) { document.getElementById('dd-result').textContent = '密文必须以"我的"开头'; return }
  input = input.substring(2)

  let binary = ''
  for (let i = 0; i < input.length; i += 2) {
    const pair = input.substring(i, i + 2)
    const bit = DD_REV[pair]
    if (bit === undefined) { document.getElementById('dd-result').textContent = `非法词组：${pair}`; return }
    binary += bit
  }

  const bytes = []
  for (let i = 0; i < binary.length; i += 8) {
    bytes.push(parseInt(binary.substring(i, i + 8), 2))
  }

  const decoder = new TextDecoder()
  document.getElementById('dd-result').textContent = decoder.decode(new Uint8Array(bytes))
}

// ===== Tab 切换 =====
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.crypto-tab')
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab
      // 更新 tab 状态
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      // 切换内容
      document.querySelectorAll('.crypto-section').forEach(s => s.classList.remove('active'))
      document.getElementById(targetId).classList.add('active')
    })
  })
})
</script>
