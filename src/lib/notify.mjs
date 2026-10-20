// Send a short text to your phone when an order comes in.
// Set NOTIFY_WEBHOOK (a Cloudflare Pages secret) to one of:
//   WeCom group robot   https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=...
//   Feishu / Lark bot   https://open.feishu.cn/open-apis/bot/v2/hook/...
//   DingTalk robot      https://oapi.dingtalk.com/robot/send?access_token=...
//   Telegram bot        https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<CHAT_ID>
//   Anything else gets {"text": "..."} (Slack, Discord-compatible, etc.)
export function webhookBody(url, text) {
  const host = new URL(url).hostname;
  if (host.endsWith('qyapi.weixin.qq.com')) return { msgtype: 'text', text: { content: text } };
  if (host.endsWith('feishu.cn') || host.endsWith('larksuite.com')) return { msg_type: 'text', content: { text } };
  if (host.endsWith('dingtalk.com')) return { msgtype: 'text', text: { content: text } };
  if (host.endsWith('discord.com')) return { content: text };
  return { text };
}

export async function notify(env, text) {
  const url = env.NOTIFY_WEBHOOK;
  if (!url) return false;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(webhookBody(url, text)),
    });
    return r.ok;
  } catch (err) {
    console.error('notify failed', err);
    return false;
  }
}
