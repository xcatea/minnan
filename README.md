# minnan.org v2

閩南 · The cultural home of the Hokkien world.
一句閩南話，行遍天下港。

这一版把网站从“手工上传 HTML”升级成“写 Markdown，自动生成整站”。外观沿用 v1.4 的设计，所有首页上的空链接都有了真实页面。

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
| `/rss.xml` `/sitemap.xml` | 自动生成 |

## 文件在哪里

```
content/stories/      ← 文章（Markdown），日常只需要动这里
docs/story-template.md← 新文章模板
public/               ← 原样复制到网站的文件：图片、favicon、_headers、_redirects
src/data/site.mjs     ← 栏目和港口的名称、简介
src/data/words.json   ← 词簿里的词
src/data/image-rights.csv ← 图片版权登记
src/styles/site.css   ← 全站唯一的样式表
src/templates/        ← 页面模板
functions/api/subscribe.js ← 订阅表单的后端（Cloudflare Pages Function）
build.mjs             ← 生成网站的脚本
```

## 写一篇新文章

1. 复制 `docs/story-template.md` 到 `content/stories/`，改个英文文件名，比如 `misua-birthdays.md`
2. 填好开头 `---` 之间的字段，写正文
3. 删掉 `draft: true`，提交到 GitHub

Cloudflare 会在一两分钟内自动重新生成网站：文章页、栏目页、港口页、首页推荐、RSS、sitemap 全部自动更新。

在 GitHub 网页上就能完成：进入 `content/stories/` → Add file → Create new file。

## 在自己电脑上预览（可选）

需要 Node.js 20 或更新版本。

```bash
npm install
npm run dev      # 打开 http://localhost:4321 ，改文件会自动重新生成
npm run build    # 生成到 dist/
```

## 部署到 Cloudflare Pages（一次性设置）

域名已经在 Cloudflare，所以直接用 Cloudflare Pages 托管最省事。

1. Cloudflare 后台 → Workers & Pages → Create → Pages → Connect to Git，选 `xcatea/minnan`
2. 构建设置：
   - Production branch：`main`
   - Build command：`npm run build`
   - Build output directory：`dist`
   - 环境变量 `NODE_VERSION` = `22`
3. 部署成功后会得到一个 `xxx.pages.dev` 地址，先在这里检查一遍
4. 项目 → Custom domains → 添加 `minnan.org` 和 `www.minnan.org`。Cloudflare 会自动改好 DNS
5. GitHub 仓库 → Settings → Pages → 关闭 GitHub Pages（避免两边同时托管）

其他分支（例如 `astro-v2`）推送后会自动生成预览地址，适合先看效果再合并。

## 开通订阅（春風周信）

订阅表单已经接好。数据库没开通前，访客提交会看到“Sign-ups open shortly”，不会丢失报错。

1. Cloudflare 后台 → Storage & Databases → D1 → Create，名字填 `minnan`
2. 打开这个数据库 → Console，把 `schema.sql` 的内容粘贴进去执行
3. Pages 项目 → Settings → Bindings → Add → D1 database，变量名填 `DB`，选 `minnan`
4. 重新部署一次（Deployments → Retry deployment）

查看订阅者：D1 Console 里执行 `SELECT email, source, country, created_at FROM subscribers ORDER BY created_at DESC;`

发信可以先手动导出邮箱，用 Buttondown / Resend 等服务发送；也可以把 `https://minnan.org/rss.xml` 接到支持 RSS 转邮件的服务，每发一篇文章自动寄出。

## 真实访客统计（可选）

Cloudflare 后台 → Analytics & Logs → Web Analytics → 添加 `minnan.org`，复制 token，
在 Pages 项目的环境变量里加 `CF_BEACON_TOKEN` = 这个 token，重新部署即可。不用 cookie，不需要弹窗。

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
