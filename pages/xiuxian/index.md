---
title: 文字修仙
aside: false
---

<style>
  .xiuxian-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 20px;
    padding: 40px 20px;
  }
  .xiuxian-icon {
    font-size: 64px;
    animation: float 3s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .xiuxian-title {
    font-size: 24px;
    font-weight: bold;
    color: var(--va-c-primary);
  }
  .xiuxian-desc {
    color: var(--va-c-text-light);
    text-align: center;
    line-height: 1.8;
  }
  .xiuxian-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 30px;
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  .xiuxian-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }
</style>

<div class="xiuxian-container">
  <div class="xiuxian-icon">⚔️</div>
  <h2 class="xiuxian-title">文字修仙</h2>
  <p class="xiuxian-desc">前往修仙世界，开启你的修仙之旅！</p>
  <a class="xiuxian-btn" href="https://xiuxian.yuumii.top" target="_self">
    <span>踏入仙途</span>
    <span>→</span>
  </a>
</div>
