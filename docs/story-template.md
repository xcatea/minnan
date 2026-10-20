---
title: 文章英文标题（显示在页面上）
seoTitle: 可选：搜索引擎用的短标题，不写就用 title
description: 150 字符以内的英文摘要，含核心关键词，用于 Google 和社交分享
standfirst: 标题下面那一行斜体导语
summary: 可选：首页推荐卡片上的一两句话，不写就用 standfirst
tag: 潤餅考
pillar: taste
also: [tongue]
ports: [philippines, malaysia, singapore, indonesia]
date: 2026-10-20
draft: true
---

把这个文件复制到 content/stories/，改名为英文短网址，例如 misua-birthdays.md。
网址会自动变成 https://minnan.org/<pillar>/<文件名>/

字段说明（删掉这几段再发布）：
- pillar 只能是：roots, tongue, faith, taste, houses, letters（文章网址和所属栏目）
- also 可选：同时出现在哪些栏目页
- ports 可选：philippines, malaysia, singapore, indonesia, everywhere（出现在哪些港口页）
- draft: true 时不会发布；写完改成 false 或删掉这一行

## 字源 · 小标题这样写

二级标题写成「汉字 · English」，汉字会自动变成标题上方的金色小字。

> 引用块会变成砖红色左边框的“金句”。
> <span class="tc">潤餅 · lūn-piáⁿ</span>

正文用普通 Markdown：*斜体*、**粗体**、[链接](https://minnan.org/)。

| You say | In Hokkien | Meaning | Where |
|---|---|---|---|
| misua | 麵線 mī-sòaⁿ | wheat thread noodles | PH |

插图：先把图片（WebP 格式）放进 public/assets/images/，再这样引用，并写清出处：

<figure>
  <img src="/assets/images/your-image.webp" alt="图片内容的英文描述" loading="lazy">
  <figcaption>Photo: 作者 / 来源, 许可证. <a href="原图链接">Original source</a>.</figcaption>
</figure>

文章结尾会自动加上“知影你對佗位來”尾注、相关文章和订阅框，不用自己写。
