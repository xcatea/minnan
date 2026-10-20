# minnan.org v3

閩南 · The cultural home of the Hokkien world.
一句閩南話，行遍天下港。

- v2：网站从“手工上传 HTML”升级成“写 Markdown，自动生成整站”，首页所有空链接都有了真实页面。
- v3：加入 **回批 · The reply from home** 小店（乡愁礼盒 + 读批、寻根两项服务）、订单请求、手机通知、WhatsApp / WeChat / Messenger 入口，以及全站右下角的 **問 · Ask** 对话助手。

## 网站结构

| 网址 | 内容 |
|---|---|
| `/` | 首页（v1.4 设计，链接全部接通，“起讀”区自动显示最新文章） |
| `/roots/` `/tongue/` `/faith/` `/taste/` `/houses/` `/letters/` | 六个栏目页：根、音、信、味、厝、批 |
| `/tongue/#wordbook` | 闽南借词词簿，可按港口筛选、可搜索 |
| `/ports/philippines/` 等 5 个 | 港口页：呂宋、檳城、石叻、棉蘭、四海 |
| `/stories/` | 全部文章 |
| `/taste/lumpia-popiah/` | 文章页（网址 = 栏目/文件名） |
| `/about/` | 编辑原则与图片版权（自动读取 `src/data/image-rights.csv`） |
| `/shop/` | 回批小店：3 个礼盒 + 2 项服务 |
| `/shop/<商品>/` | 商品页，含订单请求表单 |
| `/shop/policy/` | 寄送、海关、退款说明 |
| `/contact/` | WhatsApp / WeChat / Messenger / 邮箱 |
| `/rss.xml` `/sitemap.xml` | 自动生成 |

## 文件在哪里

```
content/stories/      ← 文章（Markdown），日常只需要动这里
docs/story-template.md← 新文章模板
public/               ← 原样复制到网站的文件：图片、favicon、_headers、_redirects
src/data/site.mjs     ← 栏目和港口的名称、简介
src/data/words.json   ← 词簿里的词（问答助手也用它）
src/data/shop.mjs     ← 商品与服务：名称、价格、内容、状态 ← 上线前必改
src/data/site.mjs     ← 也放联系方式 CONTACT
src/data/image-rights.csv ← 图片版权登记
src/styles/site.css   ← 全站唯一的样式表
src/templates/        ← 页面模板
functions/api/subscribe.js ← 订阅表单的后端（Cloudflare Pages Function）
functions/api/order.js     ← 订单请求：存数据库 + 推送到你手机
functions/api/chat.js      ← 問 · Ask 对话助手
src/lib/notify.mjs         ← 企业微信 / 飞书 / 钉钉 / Telegram 通知
build.mjs             ← 生成网站的脚本
```

## 写一篇新文章

1. 复制 `docs/story-template.md` 到 `content/stories/`，改个英文文件名，比如 `misua-birthdays.md`
2. 填好开头 `---` 之间的字段，写正文
3. 删掉 `draft: true`，提交到 GitHub

GitHub Actions 会在两三分钟内自动重新生成并发布网站：文章页、栏目页、港口页、首页推荐、RSS、sitemap 全部自动更新。

在 GitHub 网页上就能完成：进入 `content/stories/` → Add file → Create new file。

## 在自己电脑上预览（可选）

需要 Node.js 20 或更新版本。

```bash
npm install
npm run dev      # 打开 http://localhost:4321 ，改文件会自动重新生成
npm run build    # 生成到 dist/
```

## 部署：GitHub Actions 自动发布到 Cloudflare Pages

`main` 每次有新提交，`.github/workflows/deploy.yml` 就会自动构建并部署到 Cloudflare Pages，一般两三分钟。第一次运行还会自动完成这些：

- 创建 Pages 项目 `minnan`
- 创建 D1 数据库 `minnan` 并执行 `schema.sql`（每次部署都会再执行一遍，不会删数据）
- 按 `wrangler.toml` 绑定数据库 `DB` 和 Workers AI `AI`
- 把 `minnan.org`、`www.minnan.org` 挂到 Pages，并删除原来指向 GitHub Pages 的 DNS 记录，改成指向 Pages

### 一次性准备：两个密钥

1. **Cloudflare API 令牌**：Cloudflare 后台右上角头像 → My Profile → API Tokens → Create Token → Create Custom Token，权限加这几行：
   - Account · Cloudflare Pages · Edit
   - Account · D1 · Edit
   - Account · Workers AI · Read
   - Zone · DNS · Edit
   - Zone · Zone · Read

   Zone Resources 选 Include · Specific zone · `minnan.org`，然后创建，复制令牌（只显示一次）。
2. **Account ID**：Cloudflare 后台打开 minnan.org 的 Overview 页面，右下角 API 区域有 Account ID。
3. 打开 GitHub 仓库 → Settings → Secrets and variables → Actions → **New repository secret**，添加：
   - `CLOUDFLARE_API_TOKEN` = 上面的令牌
   - `CLOUDFLARE_ACCOUNT_ID` = Account ID
4. 仓库 → Actions → Deploy to Cloudflare Pages → **Run workflow**（或者随便提交一次）。

运行完在 Actions 日志的最后一步可以看到 Pages 地址和 DNS 改动。确认 minnan.org 打开的是新网站后，到仓库 Settings → Pages 把 GitHub Pages 关掉。

### 网站用的变量和密钥

都在 GitHub 仓库 → Settings → Secrets and variables → Actions 里设置，下次部署生效（改完可以手动 Run workflow）：

- **Variables**（构建网页时用）：`CONTACT_WHATSAPP`、`CONTACT_WECHAT`、`CONTACT_WECHAT_QR`、`CONTACT_MESSENGER`、`CONTACT_EMAIL`、`CF_BEACON_TOKEN`
- **Secrets**（会同步给网站后端）：`NOTIFY_WEBHOOK`、`ANTHROPIC_API_KEY`、`CHAT_API_KEY`、`CHAT_API_URL`、`CHAT_MODEL`、`CHAT_PROVIDER`、`CHAT_HOURLY_LIMIT`、`CHAT_DAILY_LIMIT`、`CHAT_LOG_QUESTIONS`

数据库和 AI 的绑定写在 `wrangler.toml` 里，所以 Cloudflare 后台不能再手动改这两项绑定。

## 数据库

D1 数据库 `minnan` 由部署自动创建。查看数据：Cloudflare 后台 → Storage & Databases → D1 → `minnan` → Console。

常用查询（D1 Console 里执行）：

```sql
-- 新订单
SELECT ref, item, qty, name, email, im, country, message, created_at FROM orders WHERE status = 'new' ORDER BY created_at DESC;
-- 改订单状态：new → confirmed → paid → shipped → done（或 cancelled）
UPDATE orders SET status = 'paid', note = 'PayPal 1A2B3C' WHERE ref = 'MN261020-ABCD';
-- 订阅者
SELECT email, source, country, created_at FROM subscribers ORDER BY created_at DESC;
-- 访客在問里问了什么（每段对话只记第一句）
SELECT question, page, visitor_country, created_at FROM chat_questions ORDER BY created_at DESC LIMIT 100;
```

## 回批小店：上线前要做的

### 1. 改商品（`src/data/shop.mjs`）

**价格和礼盒内容现在都是草稿。** 拿到样品、供货价和物流报价后再改：

- `price` / `priceLabel` / `priceNote`：价格（美元，含运费）
- `contents`：盒子里有什么
- `status`：`available` 可下单 · `preorder` 预售 · `soon` 只展示不接单
- `paypal`：可选，填 PayPal 收款链接后，商品页会多一个“直接付款”按钮
- `SHOP.boxCountries`：包邮直发的国家（目前是新加坡、马来西亚、菲律宾）

### 2. 填联系方式

在 `src/data/site.mjs` 的 `CONTACT` 里填，或者在 GitHub 仓库 → Settings → Secrets and variables → Actions → **Variables** 里设置，不用改代码：

| 变量 | 例子 |
|---|---|
| `CONTACT_WHATSAPP` | `8613812345678`（国家码+号码，不要 + 和空格） |
| `CONTACT_WECHAT` | 微信号 |
| `CONTACT_WECHAT_QR` | `/assets/images/wechat-qr.png`（图片放进 `public/assets/images/`） |
| `CONTACT_MESSENGER` | Facebook 主页用户名 |
| `CONTACT_EMAIL` | `hello@minnan.org`（用 Cloudflare Email Routing 免费转发到你的邮箱） |

没填的渠道不会显示按钮。建议 WhatsApp 用 **WhatsApp Business** App（免费）：可设置自动问候语、快捷回复、商品目录和标签。

### 3. 订单推送到手机

在 GitHub 仓库 → Settings → Secrets and variables → Actions 加一个 **Secret**：`NOTIFY_WEBHOOK`，下次部署会同步给网站。

- 企业微信：建一个只有自己的群 → 群设置 → 添加群机器人 → 复制 Webhook 地址
- 飞书 / 钉钉：群设置 → 机器人 → 自定义机器人 → 复制 Webhook
- Telegram：`https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<你的ID>`

有人提交订单，手机马上收到：单号、商品、数量、金额、姓名、国家、邮箱、留言。

### 4. 收款：PayPal

1. 用身份证注册 PayPal 中国个人卖家账户
2. 确认订单后，在 PayPal 里给客户发付款链接或账单（客户可用信用卡、Apple Pay 付款，不需要 PayPal 账户）
3. 收到款后把订单状态改为 `paid`，发货后改为 `shipped`，并把物流单号发给客户

提现方式和费率以 PayPal 后台为准。

## 問 · Ask 对话助手

右下角的“問”按钮在每一页都有：回答闽南词语、习俗、礼盒、寄送问题；遇到下单、定制、投诉或客户自己的家族资料，就引导到 WhatsApp / 微信 / 邮箱找真人。

**不配置也能用**：会用网站自己的数据（商品、词簿、寄送规则）做固定回答。

**AI 默认已接上**：`wrangler.toml` 里绑定了 Workers AI（同一个 Cloudflare 账号，不用另外注册），默认模型是 `@cf/aisingapore/gemma-sea-lion-v4-27b-it`，专门针对东南亚语言（英语、中文、他加禄语、马来语、印尼语）调过。想换模型，加 GitHub Secret `CHAT_MODEL`。不想用 AI，加 `CHAT_PROVIDER` = `off`。

也可以接其它服务（填了就优先用，都加在 GitHub Secrets 里）：

- 任何 OpenAI 兼容接口（DeepSeek、通义千问国际版等）：`CHAT_API_URL`、`CHAT_API_KEY`（Secret）、`CHAT_MODEL`
- Claude：`ANTHROPIC_API_KEY`（Secret），默认模型 `claude-haiku-5-5`

用量保护（需要数据库）：每位访客每小时最多 30 句（`CHAT_HOURLY_LIMIT`），全站每天最多 800 句（`CHAT_DAILY_LIMIT`），超出后自动改回固定回答。对话内容不保存，只记录每段对话的第一个问题，方便你了解大家想要什么；不想记录就设 `CHAT_LOG_QUESTIONS=0`。

助手的规则写在 `functions/api/chat.js` 的 `systemPrompt` 里：不编造客户家族、宗族、祖籍的信息；价格和内容只引用 `shop.mjs`；不承诺通关；不收地址和付款。

发信可以先手动导出邮箱，用 Buttondown / Resend 等服务发送；也可以把 `https://minnan.org/rss.xml` 接到支持 RSS 转邮件的服务，每发一篇文章自动寄出。

## 真实访客统计（可选）

Cloudflare 后台 → Analytics & Logs → Web Analytics → 添加 `minnan.org`，复制 token，
在 GitHub 仓库的 Actions **Variables** 里加 `CF_BEACON_TOKEN` = 这个 token，重新部署即可。不用 cookie，不需要弹窗。

## 安全设置建议（处理域名页上的 7 条安全见解）

在 Cloudflare 的 minnan.org 域名下检查：

- SSL/TLS → 模式选 **Full (strict)**；Edge Certificates → 打开 **Always Use HTTPS**
- DNS → Settings → 打开 **DNSSEC**（按提示到域名注册商处添加 DS 记录）
- 如果这个域名不收发邮件，添加 SPF `v=spf1 -all` 和 DMARC `v=DMARC1; p=reject;` 两条 TXT 记录，防止被冒用发垃圾邮件

`public/_headers` 已经加了常用的安全响应头（HSTS、nosniff 等）。

## 编辑原则

- 每个说法都有出处；学界有争议的写明有争议
- 每份文献保留真实来源；不把潮汕文献标为闽南
- 每张图片登记在 `src/data/image-rights.csv`，并在页面上署名
- 闽南语用繁体字 + 白話字（Pe̍h-ōe-jī）
