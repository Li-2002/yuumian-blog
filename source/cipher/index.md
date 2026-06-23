---
title: 加密小工具
date: 2026-06-22 00:00:00
type: "page"
comments: false
aside: false
top_img: false
---

> 自娱自乐的两套小算法，纯本地运行、不上传任何内容。支持「歪比巴卜」与「刀盾」两种密文，任选其一加密 / 解密。

<div class="cipher-app">
  <div class="cipher-row cipher-tabs">
    <span class="cipher-label">算法</span>
    <div class="cipher-seg">
      <button class="cipher-tab active" data-algo="wbbb" onclick="cipherSetAlgo('wbbb',this)">歪比巴卜</button>
      <button class="cipher-tab" data-algo="dao" onclick="cipherSetAlgo('dao',this)">刀盾</button>
    </div>
  </div>
  <div class="cipher-row cipher-modes">
    <span class="cipher-label">模式</span>
    <div class="cipher-seg">
      <button class="cipher-mode active" data-mode="enc" onclick="cipherSetMode('enc',this)">加密</button>
      <button class="cipher-mode" data-mode="dec" onclick="cipherSetMode('dec',this)">解密</button>
    </div>
  </div>
  <div class="cipher-input-wrap">
    <textarea class="cipher-input" id="cipherInput" placeholder="在此输入要加密的文字…"></textarea>
    <img class="cipher-input-img" id="cipherInputImg" src="https://yuumii.top/sys/waibibabu.jpg" alt="algo" loading="lazy">
  </div>
  <div class="cipher-actions">
    <button class="cipher-btn primary" onclick="cipherRun()">转换</button>
    <button class="cipher-btn" onclick="cipherSwap()">结果↑输入 互换</button>
    <button class="cipher-btn" onclick="cipherClear()">清空</button>
    <button class="cipher-btn ghost" onclick="cipherOpenHelp()">📖 算法详解</button>
  </div>
  <div class="cipher-output-wrap">
    <textarea class="cipher-output" id="cipherOutput" readonly placeholder="结果将显示在这里…"></textarea>
    <button class="cipher-copy" type="button" title="复制" onclick="cipherCopy(this)">复制</button>
  </div>
</div>

<div class="cipher-modal" id="cipherModal" onclick="cipherCloseHelp(event)">
  <div class="cipher-modal-box" onclick="event.stopPropagation()">
    <div class="cipher-modal-head">
      <span class="cipher-modal-title">📖 算法详解</span>
      <button class="cipher-modal-close" type="button" onclick="cipherCloseHelp()">×</button>
    </div>
    <div class="cipher-modal-body">
      <p class="cipher-modal-intro">所有字符先转为 <b>UTF-8</b> 编码（二进制），再按下列规则换成汉字。仅供娱乐，并非真正安全的加密。</p>

      <div class="cipher-algo-block">
        <div class="cipher-algo-name"><span class="cipher-dot wbbb"></span>歪比巴卜算法</div>
        <p class="cipher-algo-desc">每个字节（8 位）按「<b>两位一组</b>」拆成 4 组，每组换 1 个字。</p>
        <div class="cipher-map">
          <div class="cipher-map-item"><span class="bin">00</span><span class="arrow">→</span><span class="ch wbbb">歪</span></div>
          <div class="cipher-map-item"><span class="bin">01</span><span class="arrow">→</span><span class="ch wbbb">比</span></div>
          <div class="cipher-map-item"><span class="bin">10</span><span class="arrow">→</span><span class="ch wbbb">巴</span></div>
          <div class="cipher-map-item"><span class="bin">11</span><span class="arrow">→</span><span class="ch wbbb">卜</span></div>
        </div>
        <div class="cipher-example">
          <span class="ex-label">示例</span>
          <code>a</code> = <code>01 10 00 01</code> →
          <span class="ch wbbb sm">比</span><span class="ch wbbb sm">巴</span><span class="ch wbbb sm">歪</span><span class="ch wbbb sm">比</span>
        </div>
      </div>

      <div class="cipher-algo-block">
        <div class="cipher-algo-name"><span class="cipher-dot dao"></span>刀盾算法</div>
        <p class="cipher-algo-desc">密文固定以「<b>我的</b>」开头；其后每位：<b>0 → 刀</b>、<b>1 → 盾</b>，按「两个一组」阅读。</p>
        <div class="cipher-map">
          <div class="cipher-map-item"><span class="bin">00</span><span class="arrow">→</span><span class="ch dao">刀刀</span></div>
          <div class="cipher-map-item"><span class="bin">01</span><span class="arrow">→</span><span class="ch dao">刀盾</span></div>
          <div class="cipher-map-item"><span class="bin">10</span><span class="arrow">→</span><span class="ch dao">盾刀</span></div>
          <div class="cipher-map-item"><span class="bin">11</span><span class="arrow">→</span><span class="ch dao">盾盾</span></div>
        </div>
        <div class="cipher-example">
          <span class="ex-label">示例</span>
          <code>a</code> = <code>01 10 00 01</code> →
          <span class="ch dao sm">我的</span><span class="ch dao sm">刀盾</span><span class="ch dao sm">盾刀</span><span class="ch dao sm">刀刀</span><span class="ch dao sm">刀盾</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.cipher-app{margin:1.2rem 0;padding:1.2rem;border-radius:12px;background:var(--anzhiyu-card-bg,var(--anzhiyu-secondbg,#f7f7f9));border:1px solid var(--anzhiyu-card-border,rgba(0,0,0,.08))}
.cipher-row{display:flex;align-items:center;margin-bottom:.9rem}
.cipher-label{flex:none;width:48px;font-size:.9rem;font-weight:bold;color:var(--anzhiyu-secondtext,#888)}
.cipher-seg{display:inline-flex;padding:3px;border-radius:10px;background:var(--anzhiyu-background,#eee)}
.cipher-seg button{padding:5px 18px;font-size:.9rem;font-weight:bold;color:var(--anzhiyu-secondtext,#888);background:transparent;border:none;border-radius:7px;cursor:pointer;transition:all .2s}
.cipher-seg button.active{color:#fff;background:var(--anzhiyu-main,#3b82f6)}
.cipher-input,.cipher-output{width:100%;min-height:110px;padding:.8rem 1rem;border-radius:10px;border:1px solid var(--anzhiyu-card-border,rgba(0,0,0,.12));background:var(--anzhiyu-background,#fff);color:var(--anzhiyu-fontcolor,#1f2328);font-size:1rem;line-height:1.8;resize:vertical;box-sizing:border-box;font-family:inherit}
.cipher-input:focus,.cipher-output:focus{outline:none;border-color:var(--anzhiyu-main,#3b82f6)}
.cipher-input-wrap{position:relative}
.cipher-input-wrap .cipher-input{padding-right:108px}
.cipher-input-img{position:absolute;top:50%;right:14px;transform:translateY(-50%);width:84px;height:84px;object-fit:cover;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.15);pointer-events:none;opacity:.95}
.cipher-actions{display:flex;flex-wrap:wrap;gap:10px;margin:.9rem 0}
.cipher-btn{padding:7px 20px;font-size:.9rem;font-weight:bold;color:var(--anzhiyu-fontcolor,#333);background:var(--anzhiyu-background,#fff);border:1px solid var(--anzhiyu-card-border,rgba(0,0,0,.12));border-radius:8px;cursor:pointer;transition:all .2s}
.cipher-btn:hover{border-color:var(--anzhiyu-main,#3b82f6);color:var(--anzhiyu-main,#3b82f6)}
.cipher-btn.primary{color:#fff;background:var(--anzhiyu-main,#3b82f6);border-color:var(--anzhiyu-main,#3b82f6)}
.cipher-btn.primary:hover{filter:brightness(.95);color:#fff}
.cipher-output-wrap{position:relative}
.cipher-output{background:var(--anzhiyu-secondbg,#f2f3f5)}
.cipher-copy{position:absolute;top:10px;right:10px;padding:3px 12px;font-size:.8rem;color:var(--anzhiyu-secondtext,#888);background:var(--anzhiyu-background,#fff);border:1px solid var(--anzhiyu-card-border,rgba(0,0,0,.12));border-radius:6px;cursor:pointer;opacity:.85;transition:all .2s}
.cipher-copy:hover{opacity:1;color:var(--anzhiyu-main,#3b82f6);border-color:var(--anzhiyu-main,#3b82f6)}
.cipher-copy.copied{color:#fff;background:#4caf50;border-color:#4caf50}
.cipher-btn.ghost{margin-left:auto;color:var(--anzhiyu-main,#3b82f6);border-color:var(--anzhiyu-main,#3b82f6);background:transparent}
.cipher-btn.ghost:hover{color:#fff;background:var(--anzhiyu-main,#3b82f6)}
.cipher-modal{position:fixed;inset:0;z-index:1001;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.5);backdrop-filter:blur(3px)}
.cipher-modal.show{display:flex;animation:cipherFade .25s ease}
@keyframes cipherFade{from{opacity:0}to{opacity:1}}
.cipher-modal-box{width:100%;max-width:560px;max-height:86vh;overflow:hidden;display:flex;flex-direction:column;border-radius:16px;background:var(--anzhiyu-card-bg,var(--anzhiyu-background,#fff));box-shadow:0 20px 60px rgba(0,0,0,.3);animation:cipherPop .3s cubic-bezier(.2,.9,.3,1.3)}
@keyframes cipherPop{from{opacity:0;transform:translateY(20px) scale(.96)}to{opacity:1;transform:none}}
.cipher-modal-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--anzhiyu-card-border,rgba(0,0,0,.08));background:linear-gradient(135deg,var(--anzhiyu-main,#3b82f6),#8b5cf6)}
.cipher-modal-title{font-size:1.1rem;font-weight:bold;color:#fff}
.cipher-modal-close{width:30px;height:30px;line-height:1;font-size:1.4rem;color:#fff;background:rgba(255,255,255,.2);border:none;border-radius:50%;cursor:pointer;transition:background .2s}
.cipher-modal-close:hover{background:rgba(255,255,255,.4)}
.cipher-modal-body{padding:20px;overflow-y:auto}
.cipher-modal-intro{margin:0 0 1.2rem;font-size:.9rem;line-height:1.7;color:var(--anzhiyu-secondtext,#888)}
.cipher-algo-block{margin-bottom:1.4rem;padding:1rem 1.1rem;border-radius:12px;background:var(--anzhiyu-secondbg,#f7f7f9)}
.cipher-algo-block:last-child{margin-bottom:0}
.cipher-algo-name{display:flex;align-items:center;gap:8px;font-size:1.02rem;font-weight:bold;color:var(--anzhiyu-fontcolor,#1f2328)}
.cipher-dot{width:10px;height:10px;border-radius:50%}
.cipher-dot.wbbb{background:#ff9e28}
.cipher-dot.dao{background:#3b82f6}
.cipher-algo-desc{margin:.5rem 0 .9rem;font-size:.88rem;line-height:1.7;color:var(--anzhiyu-secondtext,#888)}
.cipher-map{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:.9rem}
.cipher-map-item{display:flex;align-items:center;gap:8px;padding:7px 12px;border-radius:9px;background:var(--anzhiyu-background,#fff);border:1px solid var(--anzhiyu-card-border,rgba(0,0,0,.06))}
.cipher-map-item .bin{font-family:Consolas,Monaco,monospace;font-size:.95rem;font-weight:bold;letter-spacing:2px;color:var(--anzhiyu-fontcolor,#333);background:rgba(125,125,125,.12);padding:2px 8px;border-radius:5px}
.cipher-map-item .arrow{color:var(--anzhiyu-secondtext,#aaa)}
.ch{display:inline-flex;align-items:center;justify-content:center;font-weight:bold;color:#fff;border-radius:6px;padding:2px 10px;font-size:.95rem}
.ch.wbbb{background:#ff9e28}
.ch.dao{background:#3b82f6}
.ch.sm{padding:1px 7px;font-size:.85rem;margin:0 1px}
.cipher-example{padding:9px 12px;border-radius:9px;background:var(--anzhiyu-background,#fff);border:1px dashed var(--anzhiyu-card-border,rgba(0,0,0,.12));font-size:.9rem;line-height:2;color:var(--anzhiyu-fontcolor,#333)}
.cipher-example .ex-label{display:inline-block;margin-right:8px;padding:1px 8px;font-size:.78rem;font-weight:bold;color:#fff;background:var(--anzhiyu-secondtext,#aaa);border-radius:5px}
.cipher-example code{font-family:Consolas,Monaco,monospace;background:rgba(125,125,125,.12);padding:1px 6px;border-radius:4px}
</style>
<script>
(function(){
  var WBBB=['歪','比','巴','卜'];
  var WBBB_MAP={'歪':0,'比':1,'巴':2,'卜':3};
  function enc8(text){return new TextEncoder().encode(text);}
  function dec8(bytes){return new TextDecoder('utf-8',{fatal:true}).decode(bytes);}
  function wbbbEncrypt(text){var bytes=enc8(text),out='';for(var k=0;k<bytes.length;k++){var b=bytes[k];out+=WBBB[(b>>6)&3]+WBBB[(b>>4)&3]+WBBB[(b>>2)&3]+WBBB[b&3];}return out;}
  function wbbbDecrypt(text){var chars=Array.from(text).filter(function(c){return c in WBBB_MAP;});if(chars.length===0||chars.length%4!==0)throw new Error('密文格式不正确（应为「歪比巴卜」且长度为4的倍数）');var bytes=new Uint8Array(chars.length/4);for(var i=0;i<bytes.length;i++){bytes[i]=(WBBB_MAP[chars[i*4]]<<6)|(WBBB_MAP[chars[i*4+1]]<<4)|(WBBB_MAP[chars[i*4+2]]<<2)|WBBB_MAP[chars[i*4+3]];}return dec8(bytes);}
  function daoEncrypt(text){var bytes=enc8(text),out='我的';for(var k=0;k<bytes.length;k++){var b=bytes[k];for(var i=7;i>=0;i--){out+=((b>>i)&1)?'盾':'刀';}}return out;}
  function daoDecrypt(text){var s=text;if(s.indexOf('我的')===0)s=s.slice(2);var chars=Array.from(s).filter(function(c){return c==='刀'||c==='盾';});if(chars.length===0||chars.length%8!==0)throw new Error('密文格式不正确（应以「我的」开头，后接「刀/盾」且长度为8的倍数）');var bytes=new Uint8Array(chars.length/8);for(var i=0;i<bytes.length;i++){var b=0;for(var j=0;j<8;j++){b=(b<<1)|(chars[i*8+j]==='盾'?1:0);}bytes[i]=b;}return dec8(bytes);}
  var state={algo:'wbbb',mode:'enc'};
  function setActive(group,el){var nodes=document.querySelectorAll(group);for(var i=0;i<nodes.length;i++)nodes[i].classList.remove('active');el.classList.add('active');}
  var ALGO_IMG={wbbb:'https://yuumii.top/sys/waibibabu.jpg',dao:'https://yuumii.top/sys/wodedaodun.jpg'};
  window.cipherSetAlgo=function(algo,el){state.algo=algo;setActive('.cipher-tab',el);var img=document.getElementById('cipherInputImg');if(img&&ALGO_IMG[algo])img.src=ALGO_IMG[algo];};
  window.cipherSetMode=function(mode,el){state.mode=mode;setActive('.cipher-mode',el);var inp=document.getElementById('cipherInput');if(inp)inp.placeholder=mode==='enc'?'在此输入要加密的文字…':'在此粘贴要解密的密文…';};
  window.cipherRun=function(){var inp=document.getElementById('cipherInput'),out=document.getElementById('cipherOutput');if(!inp||!out)return;var text=inp.value;if(!text){out.value='';return;}try{var r;if(state.mode==='enc'){r=state.algo==='wbbb'?wbbbEncrypt(text):daoEncrypt(text);}else{r=state.algo==='wbbb'?wbbbDecrypt(text):daoDecrypt(text);}out.value=r;}catch(e){out.value='⚠ '+(e&&e.message?e.message:'转换失败，请检查输入');}};
  window.cipherSwap=function(){var inp=document.getElementById('cipherInput'),out=document.getElementById('cipherOutput');if(!inp||!out)return;inp.value=out.value;out.value='';};
  window.cipherClear=function(){var inp=document.getElementById('cipherInput'),out=document.getElementById('cipherOutput');if(inp)inp.value='';if(out)out.value='';};
  window.cipherCopy=function(b){var out=document.getElementById('cipherOutput');if(!out||!out.value)return;var done=function(){b.classList.add('copied');var o=b.textContent;b.textContent='已复制';setTimeout(function(){b.classList.remove('copied');b.textContent=o;},1500);};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(out.value).then(done).catch(function(){});}else{out.select();try{document.execCommand('copy');}catch(e){}done();}};
  window.cipherOpenHelp=function(){var m=document.getElementById('cipherModal');if(m)m.classList.add('show');};
  window.cipherCloseHelp=function(){var m=document.getElementById('cipherModal');if(m)m.classList.remove('show');};
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){var m=document.getElementById('cipherModal');if(m)m.classList.remove('show');}});
})();
</script>

## 算法说明

点击工具区右侧的「📖 算法详解」按钮，查看两套算法的二进制对照表与示例。

