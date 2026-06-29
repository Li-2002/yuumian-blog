(function() {
    // 当文档加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        // 查找所有带有live-photo类的元素
        var livePhotoElements = document.querySelectorAll('.live-photo');

        if (livePhotoElements.length > 0) {
        // 如果页面上有实况照片元素，才加载LivePhotosKit.js
        var script = document.createElement('script');
        script.src = 'https://cdn.apple-livephotoskit.com/lpk/1/livephotoskit.js';
        script.onload = function() {
            // LivePhotosKit.js加载完成后，初始化所有实况照片
            initializeLivePhotos(livePhotoElements);
        };
        document.head.appendChild(script);
        }
    });

    // 初始化所有实况照片元素
    function initializeLivePhotos(elements) {
        elements.forEach(function(element) {
        // 获取照片和视频的URL
        var photoSrc = element.getAttribute('data-photo-src');
        var videoSrc = element.getAttribute('data-video-src');

        if (photoSrc && videoSrc) {
            // 创建LivePhotosKit播放器
            var player = LivePhotosKit.Player(element);

            // 设置照片和视频源
            player.photoSrc = photoSrc;
            player.videoSrc = videoSrc;

            // 添加鼠标悬停事件来播放实况照片
            element.addEventListener('mouseenter', function() {
            player.play();
            });

            element.addEventListener('mouseleave', function() {
            player.pause();
            });

            // 添加触摸事件支持（移动设备）
            element.addEventListener('touchstart', function() {
            player.play();
            });

            element.addEventListener('touchend', function() {
            player.pause();
            });

            // 添加样式
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.style.display = 'inline-block';
        }
        });
    }
    })();