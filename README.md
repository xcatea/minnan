# minnan.org — The Hokkien Heritage Project

静态站,GitHub Pages / Cloudflare Pages 直接托管。

## 部署(与 heishanshi.com 同流程)
1. 新建仓库 minnan-site(或 minnan.org),推送本目录
2. GitHub Pages:Settings → Pages → Deploy from branch (main, /root)
3. 自定义域:CNAME 文件写 minnan.org;Cloudflare DNS 加 CNAME @ → <user>.github.io(开启 proxy)
4. 域名在 Cloudflare Registrar,DNS 同面板直接配

## 结构
- index.html          首页(自包含 CSS)
- taste/lumpia-popiah.html  旗舰文章
- 后续板块目录:/roots /language /faith /taste /stories

## 视觉规范
- 配色:磚紅 #8E3B2F · 宣紙 #F2E9D8 · 墨青 #21343A · 鎏金 #B8863B · 印泥 #B3352B · 石灰 #A8A093
- 字体:Cormorant Garamond(EN display)/ Gentium Book Plus(正文,POJ 变音符号)/ Noto Serif TC(繁体)
- 签名元素:出磚入石 Hero 墙(SVG pattern)、燕尾脊分隔线、竖排对联、僑批红框+印章
- 汉字一律繁体(面向华侨)

## 待办
- [ ] 订阅表单接后端(Cloudflare Workers / Buttondown / formspree)
- [ ] Messenger 下单链接替换 href="#"
- [ ] 拆公共 CSS 到 assets/style.css(页面多了再拆)
- [ ] Google Search Console 提交 + sitemap.xml
