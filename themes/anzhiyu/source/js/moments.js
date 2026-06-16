/**
 * ============================================================
 * Hexo Anzhiyu 主题 - 朋友圈/动态页面脚本
 * 路径：themes/anzhiyu/source/js/moments.js
 * 说明：交互逻辑（点赞/评论/lightbox），数据存储于 localStorage
 *       data-id=item.date 唯一标识每条动态
 * ============================================================
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'anzhiyu_moments_interact';

  // ========== 数据读写 ==========
  function loadInteract() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveInteract(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // ========== 点赞 ==========
  function toggleLike(btn, momentId) {
    var data = loadInteract();
    var key = 'like_' + momentId;
    if (!data[key]) data[key] = { liked: false, count: 0 };

    data[key].liked = !data[key].liked;
    data[key].count += data[key].liked ? 1 : -1;
    if (data[key].count < 0) data[key].count = 0;

    saveInteract(data);

    // 更新 UI
    btn.classList.toggle('liked', data[key].liked);
    var span = btn.querySelector('.like-count');
    if (span) span.textContent = data[key].count;

    // 点赞动画
    if (data[key].liked) {
      btn.classList.add('like-animating');
      spawnParticles(btn);
      setTimeout(function () { btn.classList.remove('like-animating'); }, 400);
    }
  }

  function spawnParticles(btn) {
    var rect = btn.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    for (var i = 0; i < 5; i++) {
      var p = document.createElement('span');
      p.className = 'like-particle';
      p.textContent = '\u2764\uFE0F';
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.setProperty('--px', (Math.random() * 50 - 25) + 'px');
      p.style.setProperty('--py', (Math.random() * -50 - 10) + 'px');
      document.body.appendChild(p);
      setTimeout(function (el) { return function () { el.remove(); }; }(p), 700);
    }
  }

  // 初始化所有点赞状态
  function initLikes() {
    var data = loadInteract();
    var btns = document.querySelectorAll('.like-btn');
    for (var i = 0; i < btns.length; i++) {
      var btn = btns[i];
      var momentId = btn.getAttribute('data-id');
      var key = 'like_' + momentId;
      if (data[key] && data[key].liked) {
        btn.classList.add('liked');
        var span = btn.querySelector('.like-count');
        if (span) span.textContent = data[key].count;
      }
    }
  }

  // ========== 评论（按需初始化 Twikoo） ==========
  function openComment(idx, path) {
    var container = document.getElementById('moment-comments-' + idx);
    if (!container) return;

    // 切换显示/隐藏
    var isHidden = container.style.display === 'none';
    if (!isHidden) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';

    // 延迟初始化 Twikoo（首次点击时才加载）
    if (container.getAttribute('data-inited') === 'false') {
      container.setAttribute('data-inited', 'true');
      setTimeout(function () {
        twikoo.init({
          el: '#moment-comments-' + idx,
          envId: window.__twikooEnvId,
          region: window.__twikooRegion || undefined,
          path: path
        });
        // 监听 Twikoo 渲染完成后折叠评论
        watchAndCollapseComments(container);
      }, 100);
    }

    // 滚动到评论区
    setTimeout(function () {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  }

  /** 监听 Twikoo 渲染完毕后，折叠前3条之外的评论 */
  function watchAndCollapseComments(container) {
    var attempts = 0;
    var timer = setInterval(function () {
      attempts++;
      var items = container.querySelectorAll('.tk-comments > .tk-comment');
      if (items.length > 3) {
        clearInterval(timer);
        collapseComments(container, items);
      } else if (attempts > 20) {
        clearInterval(timer);
      }
    }, 500);
  }

  function collapseComments(container, items) {
    // 隐藏第4条及之后的评论
    for (var i = 3; i < items.length; i++) {
      items[i].classList.add('moment-comment-collapsed');
    }
    // 插入"展开更多"按钮
    var btn = document.createElement('button');
    btn.className = 'moment-expand-comments-btn';
    btn.textContent = '展开更多评论（' + (items.length - 3) + '条）';
    btn.onclick = function () {
      var all = container.querySelectorAll('.tk-comments > .tk-comment');
      for (var j = 0; j < all.length; j++) {
        all[j].classList.remove('moment-comment-collapsed');
      }
      btn.style.display = 'none';
      // 插入"收起"按钮
      var collapseBtn = container.querySelector('.moment-collapse-btn');
      if (!collapseBtn) {
        collapseBtn = document.createElement('button');
        collapseBtn.className = 'moment-expand-comments-btn moment-collapse-btn';
        collapseBtn.textContent = '收起评论';
        collapseBtn.onclick = function () {
          var all2 = container.querySelectorAll('.tk-comments > .tk-comment');
          for (var k = 3; k < all2.length; k++) {
            all2[k].classList.add('moment-comment-collapsed');
          }
          collapseBtn.style.display = 'none';
          btn.style.display = '';
        };
        container.appendChild(collapseBtn);
      } else {
        collapseBtn.style.display = '';
      }
    };
    container.appendChild(btn);
  }

  // ========== 视频折叠/展开 ==========
  function toggleVideos(btn, total) {
    var card = btn.closest('.moment-card');
    if (!card) return;
    var collapsed = card.querySelectorAll('.moment-video-collapsed');
    var isExpanding = btn.getAttribute('data-expanded') !== 'true';

    for (var i = 0; i < collapsed.length; i++) {
      collapsed[i].style.display = isExpanding ? 'block' : 'none';
    }
    btn.setAttribute('data-expanded', isExpanding ? 'true' : 'false');
    btn.querySelector('span').textContent = isExpanding ? '收起视频' : '展开更多视频（' + (total - 1) + '个）';
  }

  // ========== 图片画廊展开 ==========
  function expandGallery(overlay) {
    var gallery = overlay.closest('.moment-gallery');
    if (!gallery) return;
    gallery.setAttribute('data-expanded', 'true');
    gallery.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ========== 4图轮播 ==========
  function gallery4Nav(btn, dir) {
    var gallery = btn.closest('.moment-gallery');
    if (!gallery) return;
    var allUrls = JSON.parse(gallery.getAttribute('data-all-urls') || '[]');
    if (allUrls.length < 4) return;
    var mainIdx = parseInt(gallery.getAttribute('data-main-idx') || '0');
    mainIdx = (mainIdx + dir + 4) % 4;
    gallery.setAttribute('data-main-idx', mainIdx);

    // 更新主图
    var mainImg = gallery.querySelector('.gallery-float-main .gallery-img');
    if (mainImg) {
      mainImg.src = allUrls[mainIdx];
      mainImg.setAttribute('onclick', "MomentsApp.openLightbox('" + allUrls.join(',') + "', " + mainIdx + ")");
    }

    // 更新下方3张图：取除 mainIdx 外的剩余3张
    var bottomImgs = gallery.querySelectorAll('.gallery-stagger-row .gallery-img');
    var remaining = [];
    for (var i = 0; i < 4; i++) {
      if (i !== mainIdx) remaining.push(i);
    }
    for (var j = 0; j < bottomImgs.length && j < remaining.length; j++) {
      var ri = remaining[j];
      bottomImgs[j].src = allUrls[ri];
      bottomImgs[j].setAttribute('onclick', "MomentsApp.openLightbox('" + allUrls.join(',') + "', " + ri + ")");
    }

    // 添加过渡动画
    gallery.classList.add('gallery-switching');
    setTimeout(function () { gallery.classList.remove('gallery-switching'); }, 350);
  }

  function gallery4Prev(btn) { gallery4Nav(btn, -1); }
  function gallery4Next(btn) { gallery4Nav(btn, 1); }

  // ========== 分享 ==========
  function shareMoment(text) {
    var fullText = (text || '查看动态') + ' - ' + window.location.origin + '/moments/';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(function () {
        showToast('已复制分享链接');
      }).catch(function () {});
    } else {
      showToast('长按手动复制链接分享吧~');
    }
  }

  function showToast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText =
      'position:fixed;bottom:60px;left:50%;transform:translateX(-50%);' +
      'background:rgba(66,90,239,0.9);color:#fff;padding:10px 24px;' +
      'border-radius:50px;font-size:0.85rem;z-index:99999;pointer-events:none;';
    document.body.appendChild(t);
    setTimeout(function () {
      t.style.opacity = '0';
      t.style.transition = 'opacity 0.4s';
    }, 1800);
    setTimeout(function () { t.remove(); }, 2300);
  }

  // ========== Lightbox ==========
  var lightboxImages = [];
  var lightboxIndex = 0;

  function openLightbox(imagesStr, index) {
    lightboxImages = imagesStr.split(',');
    lightboxIndex = index || 0;
    showLightboxImage();
    document.getElementById('momentsLightbox').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function showLightboxImage() {
    document.getElementById('lightboxImg').src = lightboxImages[lightboxIndex];
    document.getElementById('lightboxCounter').textContent =
      (lightboxIndex + 1) + ' / ' + lightboxImages.length;
  }

  function lightboxNav(dir) {
    lightboxIndex += dir;
    if (lightboxIndex < 0) lightboxIndex = lightboxImages.length - 1;
    if (lightboxIndex >= lightboxImages.length) lightboxIndex = 0;
    showLightboxImage();
  }

  function closeLightbox() {
    document.getElementById('momentsLightbox').style.display = 'none';
    document.body.style.overflow = '';
  }

  // ========== 键盘 ==========
  function onKeyDown(e) {
    var lb = document.getElementById('momentsLightbox');
    if (lb && lb.style.display === 'flex') {
      if (e.key === 'Escape') { closeLightbox(); return; }
      if (e.key === 'ArrowLeft') { lightboxNav(-1); return; }
      if (e.key === 'ArrowRight') { lightboxNav(1); return; }
    }
  }

  // ========== 初始化 ==========
  function init() {
    initLikes();
    document.addEventListener('keydown', onKeyDown);
    console.log(
      '%c\uD83C\uDF38 Anzhiyu Moments \u670B\u53CB\u5708 %c| %c\u6570\u636E\u6765\u6E90: _data/moments.yml',
      'color:#425AEF;font-weight:bold;', '', 'color:#99A9BF;'
    );
  }

  // ========== 挂载 ==========
  window.MomentsApp = {
    toggleLike: toggleLike,
    openComment: openComment,
    toggleVideos: toggleVideos,
    expandGallery: expandGallery,
    gallery4Prev: gallery4Prev,
    gallery4Next: gallery4Next,
    shareMoment: shareMoment,
    openLightbox: openLightbox,
    lightboxNav: lightboxNav,
    closeLightbox: closeLightbox
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
