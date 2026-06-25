---
title: 安知鱼接入腾讯位置服务实现访客IP定位
top_img: https://yuumii.top/sys/bakcgournd.png
categories: 博客
tags:
  - Hexo
  - 安知鱼
  - 腾讯位置服务
  - IP定位
keywords: 安知鱼,腾讯位置服务,IP定位,访客定位,card-welcome,JSONP
description: 教程：用腾讯位置服务 IP 定位 API 给安知鱼博客加上访客城市定位功能，显示访客城市、距离和专属问候语。
ai: 雨眠AI摘要帮您理解这篇文章~请提供您想要摘要的文章内容。
date: 2026-06-24 00:00:00
---

# 安知鱼主题接入腾讯位置服务实现访客IP定位

## 前言

前段时间在别的博主看到有这样一个功能：您当前的ip是xxx，距离博主xxx公里，欢迎来到我的博客！

我是一个对统计有着很固执的一个人，我想着所有东西我都想统计起来，这个东西加上我的侧边栏一直空空，所以就找一下实现的方法，安知鱼默认用的 IP 定位 API 全是海外的——<span style="color: rgba(247, 79, 79, 1)">ip.sb、ipapi.co、ipinfo.io</span>，在国内访问要么超时、要么被墙，成功率感人。我是死活访问不了，于是只能去百度，通过这位老师的博客，我仿照这位老师的做了一个类似的（因为老师提到的api已经过期，我只能另寻他路），

{% link 给主题侧边栏添加来访者卡片,[科技-刘](https://blog.zxlwq.dpdns.org/2025/04/13/%E7%BB%99%E4%B8%BB%E9%A2%98%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%B7%BB%E5%8A%A0%E6%9D%A5%E8%AE%BF%E8%80%85%E5%8D%A1%E7%89%87/),https://github.com/owen0o0/getFavicon %}


后续考虑过后，虽然没有现成的 但是根据老师的代码我可以换成<span style="color: rgba(53, 163, 241, 1)">腾讯位置服务</span>。腾讯在国内的节点又多又稳，几秒内就能拿到访客的省/市/经纬度，体验直接拉满。几波体验下来很丝滑很流畅，以下就是使用腾讯ip定位的方法

![腾讯定位结果](https://yuumii.top/article/tencentIp/TencentIpResult.png)

## 实现步骤

### 第一步：申请腾讯位置服务 Key

1. 打开 [lbs.qq.com](https://lbs.qq.com)，登录一下
2. 完成**开发者实名认证**（个人认证即可，有一定的免费额度，够我们博客使用了）
3. 进入 **控制台 → 应用管理 → 我的应用 → 创建应用**
4. 在应用下 **添加 Key**，配置如下：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| Key 名称 | 随便填，比如「博客IP定位」 |  |
| 启用产品 | <span style="color: rgba(247, 79, 79, 1)">勾选 WebServiceAPI</span> | IP 定位属于这个产品 |
| 域名白名单 | `https://你的域名/*` | Referer 防盗用，**可填可不填** |
| 签名校验(SN) | <span style="color: rgba(247, 79, 79, 1)">不勾选</span> |  |

<span style="color: rgba(53, 163, 241, 1)">Key 会暴露在前端 JS 里</span>，防盗用全靠腾讯控制台的 **Referer 白名单**。只要别人从别的域名发请求就会被拦截<span style="color: rgba(247, 79, 79, 1)">千万别开</span>。

如果本地 `hexo s` 预览，白名单里也加一条 `http://localhost:*`。

![腾讯定位Key](https://yuumii.top/article/tencentIp/Tencentip.png)

### 第二步：创建 card-welcome.js

在博客 `source/` 下新建 `static/` 文件夹，创建 `card-welcome.js`，完整代码如下：

```js
window.IP_CONFIG = {
	API_KEY: '你的腾讯Key', // 替换成你申请的 Key
	BLOG_LOCATION: {
		lng: 113.174398, // 你的经度（随便找一个经纬度查询网站查，推荐高德地图坐标拾取器）
		lat: 23.025356  // 你的纬度
	},
	CACHE_DURATION: 1000 * 60 * 60, // 可配置缓存时间(默认1小时)
	HOME_PAGE_ONLY: true, // 是否只在首页显示 开启后其它页面将不会显示这个容器
};

const insertAnnouncementComponent = () => {
	// 获取所有公告卡片
	const announcementCards = document.querySelectorAll('.card-widget.card-announcement');
	if (!announcementCards.length) return;

	if (IP_CONFIG.HOME_PAGE_ONLY && !isHomePage()) {
		announcementCards.forEach(card => card.remove());
		return;
	}

	if (!document.querySelector('#welcome-info')) return;
	fetchIpInfo();
};

const getWelcomeInfoElement = () => document.querySelector('#welcome-info');

// 腾讯 WebService API 不支持浏览器 CORS，需通过 JSONP 调用
const jsonp = (url, timeout = 5000) => new Promise((resolve, reject) => {
	const cbName = 'tencentIpCb_' + Date.now() + Math.floor(Math.random() * 1e4);
	const script = document.createElement('script');

	const cleanup = () => {
		clearTimeout(timer);
		delete window[cbName];
		if (script.parentNode) script.parentNode.removeChild(script);
	};

	const timer = setTimeout(() => {
		cleanup();
		reject(new Error('timeout'));
	}, timeout);

	window[cbName] = (data) => {
		cleanup();
		resolve(data);
	};

	script.onerror = () => {
		cleanup();
		reject(new Error('script error'));
	};

	script.src = `${url}${url.includes('?') ? '&' : '?'}output=jsonp&callback=${cbName}`;
	document.body.appendChild(script);
});

const fetchIpData = async () => {
	const url = `https://apis.map.qq.com/ws/location/v1/ip?key=${encodeURIComponent(IP_CONFIG.API_KEY)}`;
	const res = await jsonp(url);
	if (!res || res.status !== 0 || !res.result) {
		throw new Error((res && res.message) || '腾讯定位失败');
	}
	const r = res.result;
	const ad = r.ad_info || {};
	// 转换为下方渲染所需的数据结构
	return {
		ip: r.ip,
		data: {
			lng: r.location ? r.location.lng : null,
			lat: r.location ? r.location.lat : null,
			country: ad.nation,
			prov: ad.province,
			city: ad.city
		}
	};
};

const showWelcome = ({
	data,
	ip
}) => {
	if (!data) return showErrorMessage();

	const {
		lng,
		lat,
		country,
		prov,
		city
	} = data;
	const welcomeInfo = getWelcomeInfoElement();
	if (!welcomeInfo) return;

	const dist = calculateDistance(lng, lat);
	const ipDisplay = formatIpDisplay(ip);
	const pos = formatLocation(country, prov, city);

	welcomeInfo.style.display = 'block';
	welcomeInfo.style.height = 'auto';
	welcomeInfo.innerHTML = generateWelcomeMessage(pos, dist, ipDisplay, country, prov, city);
};

const calculateDistance = (lng, lat) => {
	const R = 6371; // 地球半径(km)
	const rad = Math.PI / 180;
	const dLat = (lat - IP_CONFIG.BLOG_LOCATION.lat) * rad;
	const dLon = (lng - IP_CONFIG.BLOG_LOCATION.lng) * rad;
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(IP_CONFIG.BLOG_LOCATION.lat * rad) * Math.cos(lat * rad) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);

	return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};
const formatIpDisplay = (ip) => ip && ip.includes(":") ? "<br>好复杂，咱看不懂~(ipv6)" : (ip || '未知');
const formatLocation = (country, prov, city) => {
	return country ? (country === "中国" ? `${prov} ${city}` : country) : '神秘地区';
};

const generateWelcomeMessage = (pos, dist, ipDisplay, country, prov, city) => `
    欢迎来自 <b>${pos}</b> 的小友💖<br>
    你当前距博主约 <b>${dist}</b> 公里！<br>
    你的IP地址：<b class="ip-address">${ipDisplay}</b><br>
    ${getTimeGreeting()}<br>
    Tip：<b>${getGreeting(country, prov, city)}🍂</b>
`;

const addStyles = () => {
	const style = document.createElement('style');
	style.textContent = `
        #welcome-info {
            user-select: none;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 212px;
            padding: 10px;
            margin-top: 5px;
            border-radius: 12px;
            background-color: var(--anzhiyu-background);
            outline: 1px solid var(--anzhiyu-card-border);
        }
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 3px solid var(--anzhiyu-main);
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .ip-address {
            filter: blur(5px);
            transition: filter 0.3s ease;
        }
        .ip-address:hover {
            filter: blur(0);
        }
        .error-message {
            color: #ff6565;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .error-message p {
            margin: 0;
        }
        .error-icon {
            font-size: 3rem;
        }
        #retry-button {
            margin: 0 5px;
            color: var(--anzhiyu-main);
            transition: transform 0.3s ease;
        }
        #retry-button:hover {
            transform: rotate(180deg);
        }
    `;
	document.head.appendChild(style);
};



const showLoadingSpinner = () => {
	const welcomeInfoElement = document.querySelector("#welcome-info");
	if (!welcomeInfoElement) return;
	welcomeInfoElement.innerHTML = '<div class="loading-spinner"></div>';
};

const IP_CACHE_KEY = 'ip_info_cache';
const getIpInfoFromCache = () => {
	const cached = localStorage.getItem(IP_CACHE_KEY);
	if (!cached) return null;

	const { data, timestamp } = JSON.parse(cached);
	if (Date.now() - timestamp > IP_CONFIG.CACHE_DURATION) {
		localStorage.removeItem(IP_CACHE_KEY);
		return null;
	}
	return data;
};
const setIpInfoCache = (data) => {
	localStorage.setItem(IP_CACHE_KEY, JSON.stringify({
		data,
		timestamp: Date.now()
	}));
};

const fetchIpInfo = async () => {
	showLoadingSpinner();

	const cachedData = getIpInfoFromCache();
	if (cachedData) {
		showWelcome(cachedData);
		return;
	}

	try {
		const data = await fetchIpData();
		setIpInfoCache(data);
		showWelcome(data);
	} catch (error) {
		console.error('获取IP信息失败:', error);
		showErrorMessage();
	}
};

const greetings = {
	"中国": {
		"北京市": "北——京——欢迎你~~~",
		"天津市": "讲段相声吧",
		"河北省": "山势巍巍成壁垒，天下雄关铁马金戈由此向，无限江山",
		"山西省": "展开坐具长三尺，已占山河五百余",
		"内蒙古自治区": "天苍苍，野茫茫，风吹草低见牛羊",
		"辽宁省": "我想吃烤鸡架！",
		"吉林省": "状元阁就是东北烧烤之王",
		"黑龙江省": "很喜欢哈尔滨大剧院",
		"上海市": "众所周知，中国只有两个城市",
		"江苏省": {
			"南京市": "这是我挺想去的城市啦",
			"苏州市": "上有天堂，下有苏杭",
			"其他": "散装是必须要散装的"
		},
		"浙江省": {
			"杭州市": "东风渐绿西湖柳，雁已还人未南归",
			"其他": "望海楼明照曙霞,护江堤白蹋晴沙"
		},
		"河南省": {
			"郑州市": "豫州之域，天地之中",
			"信阳市": "品信阳毛尖，悟人间芳华",
			"南阳市": "臣本布衣，躬耕于南阳此南阳非彼南阳！",
			"驻马店市": "峰峰有奇石，石石挟仙气嵖岈山的花很美哦！",
			"开封市": "刚正不阿包青天",
			"洛阳市": "洛阳牡丹甲天下",
			"其他": "可否带我品尝河南烩面啦？"
		},
		"安徽省": "蚌埠住了，芜湖起飞",
		"福建省": "井邑白云间，岩城远带山",
		"江西省": "落霞与孤鹜齐飞，秋水共长天一色",
		"山东省": "遥望齐州九点烟，一泓海水杯中泻",
		"湖北省": {
			"黄冈市": "红安将军县！辈出将才！",
			"其他": "来碗热干面~"
		},
		"湖南省": "74751，长沙斯塔克",
		"广东省": {
			"广州市": "看小蛮腰，喝早茶了嘛~",
			"深圳市": "今天你逛商场了嘛~",
			"潮州市": "欢迎来博主家乡玩~",
			"其他": "来两斤福建人~"
		},
		"广西壮族自治区": "桂林山水甲天下",
		"海南省": "朝观日出逐白浪，夕看云起收霞光",
		"四川省": "康康川妹子",
		"贵州省": "茅台，学生，再塞200",
		"云南省": "玉龙飞舞云缠绕，万仞冰川直耸天",
		"西藏自治区": "躺在茫茫草原上，仰望蓝天",
		"陕西省": "来份臊子面加馍",
		"甘肃省": "羌笛何须怨杨柳，春风不度玉门关",
		"青海省": "牛肉干和老酸奶都好好吃",
		"宁夏回族自治区": "大漠孤烟直，长河落日圆",
		"新疆维吾尔自治区": "驼铃古道丝绸路，胡马犹闻唐汉风",
		"台湾省": "我在这头，大陆在那头",
		"香港特别行政区": "永定贼有残留地鬼嚎，迎击光非岁玉",
		"澳门特别行政区": "性感荷官，在线发牌",
		"其他": "带我去你的城市逛逛吧！"
	},
	"美国": "Let us live in peace!",
	"日本": "よろしく、一緒に桜を見ませんか",
	"俄罗斯": "干了这瓶伏特加！",
	"法国": "C'est La Vie",
	"德国": "Die Zeit verging im Fluge.",
	"澳大利亚": "一起去大堡礁吧！",
	"加拿大": "拾起一片枫叶赠予你",
	"其他": "带我去你的国家逛逛吧"
};

const getGreeting = (country, province, city) => {
	const countryGreeting = greetings[country] || greetings["其他"];
	if (typeof countryGreeting === 'string') {
		return countryGreeting;
	}
	const provinceGreeting = countryGreeting[province] || countryGreeting["其他"];
	if (typeof provinceGreeting === 'string') {
		return provinceGreeting;
	}
	return provinceGreeting[city] || provinceGreeting["其他"] || countryGreeting["其他"];
};
const getTimeGreeting = () => {
	const hour = new Date().getHours();
	if (hour < 11) return "早上好🌤️ ，一日之计在于晨";
	if (hour < 13) return "中午好☀️ ，记得午休喔~";
	if (hour < 17) return "下午好🕞 ，饮茶先啦！";
	if (hour < 19) return "即将下班🚶‍♂️，记得按时吃饭~";
	return "晚上好🌙 ，夜生活嗨起来！";
};

const showErrorMessage = (message = '抱歉，无法获取信息') => {
	const welcomeInfoElement = document.getElementById("welcome-info");
	welcomeInfoElement.innerHTML = `
        <div class="error-message">
            <div class="error-icon">😕</div>
            <p>${message}</p>
            <p>请<i id="retry-button" class="fa-solid fa-arrows-rotate"></i>重试或检查网络连接</p>
        </div>
    `;

	document.getElementById('retry-button').addEventListener('click', fetchIpInfo);
};

const isHomePage = () => {
	return window.location.pathname === '/' || window.location.pathname === '/index.html';
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
	addStyles();
	insertAnnouncementComponent();
	document.addEventListener('pjax:complete', insertAnnouncementComponent);
});
```

### 第三步：配置主题文件

打开 `_config.anzhiyu.yml`（注意是安知鱼主题的配置文件，不是 Hexo 根目录那个），改两处。

**3.1 开启公告卡片并放入欢迎容器**

找到 `aside` → `card_announcement`，改成：

```yaml
  card_announcement:
    enable: true   # 必须开启
    content: <span>👋🏻 Hi，欢迎来到我的博客！</span><br>
             <span>❓ 如有问题欢迎评论区交流！</span><br>
             <span>😫 页面异常？尝试<kbd>Ctrl</kbd>+<kbd>F5</kbd></span><br>
             <div id="welcome-info"></div>   # ← 这个是必须的容器
```

**3.2 引入 JS**

找到 `inject` → `bottom`，加入：

```yaml
inject:
  head:
    # ...
  bottom:
    - <script src="/static/card-welcome.js"></script>
```


### 第四步：部署生效

```bash
hexo clean && hexo g && hexo s
```

打开 `http://localhost:4000`，你应该能看到公告卡片下方的欢迎区域先显示转圈动画，几秒后切换成访客位置信息。

## 代码是怎么工作的

整个流程非常直观，我把基础的原理写出来，大家可以参考一下：

```
页面加载 → 找到 #welcome-info 容器 → 显示加载动画
  → JSONP 调用腾讯 API（带上你的 Key）
  → 腾讯返回 { ip, ad_info: { nation, province, city }, location: { lat, lng } }
  → 字段映射 → 计算距离（Haversine 公式）
  → 匹配问候语文案（国家 → 省 → 市三级）
  → localStorage 缓存结果
  → 渲染 HTML
```

PJAX 切换页面时（安知鱼主题在站内切换页面不走整页刷新，用的是 PJAX），`insertAnnouncementComponent` 会重新跑一次：如果有缓存就直接从 `localStorage` 恢复，不会重复调 API。

## 最后

腾讯位置服务的 IP 定位每天有 1 万次免费调用额度，个人博客完全够用。如果你后续想加更多玩法——比如在地图上标出访客位置、统计访客城市分布之类——腾讯还提供了 JavaScript API GL 和静态图 API，有空我再写一篇。

有问题的话欢迎在评论区留言，看到会回复。

<span style="color: rgba(252, 142, 2, 1)">愿君安康，平安同乐！</span>
