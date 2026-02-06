const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const BOUNTY_API = 'https://bounty.owockibot.xyz';

interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: string;
  tags: string[];
  status: string;
}

async function fetchBounties(status: string = 'open'): Promise<Bounty[]> {
  const response = await fetch(`${BOUNTY_API}/bounties`);
  const bounties = await response.json() as Bounty[];
  return bounties.filter(b => b.status === status);
}

function generateFrameHTML(params: {
  title: string;
  description: string;
  imageUrl: string;
  buttons: { label: string; action?: string; target?: string }[];
  postUrl?: string;
}): string {
  const { title, description, imageUrl, buttons, postUrl } = params;

  const buttonTags = buttons.map((btn, idx) => {
    const num = idx + 1;
    let tags = `<meta property="fc:frame:button:${num}" content="${btn.label}" />`;
    if (btn.action) {
      tags += `\n    <meta property="fc:frame:button:${num}:action" content="${btn.action}" />`;
    }
    if (btn.target) {
      tags += `\n    <meta property="fc:frame:button:${num}:target" content="${btn.target}" />`;
    }
    return tags;
  }).join('\n    ');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    ${postUrl ? `<meta property="fc:frame:post_url" content="${postUrl}" />` : ''}
    ${buttonTags}
    <style>
      body {
        margin: 0;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #0f0f0f;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
      }
      .container { max-width: 1200px; width: 100%; }
      h1 { margin-bottom: 10px; }
      .preview { margin: 20px 0; width: 100%; max-width: 1200px; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
      .preview img { width: 100%; height: auto; display: block; }
      .info { background: #1a1a1a; padding: 20px; border-radius: 10px; margin-top: 20px; }
      .buttons { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
      .btn { padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
      .btn:hover { background: #764ba2; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${title}</h1>
      <p>${description}</p>
      <div class="preview">
        <img src="${imageUrl}" alt="Bounty Preview">
      </div>
      <div class="info">
        <h3>🎯 This is a Farcaster Frame</h3>
        <p>View it properly in Warpcast or test at <a href="https://warpcast.com/~/developers/frames" style="color: #667eea;">Warpcast Playground</a></p>
        <div class="buttons">
          ${buttons.map(btn => `<a href="${btn.target || '#'}" class="btn">${btn.label}</a>`).join('')}
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function generateBountyImage(bounty: Bounty | null, index: number, total: number): string {
  if (!bounty) {
    return `<svg width="1200" height="628" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="628" fill="#1a1a2e"/>
  <text x="600" y="280" font-family="Arial" font-size="48" fill="#fff" text-anchor="middle" font-weight="bold">AI Bounty Board</text>
  <text x="600" y="350" font-family="Arial" font-size="32" fill="#aaa" text-anchor="middle">No open bounties</text>
</svg>`;
  }

  const reward = (parseFloat(bounty.reward) / 1_000_000).toFixed(2);
  return `<svg width="1200" height="628" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="628" fill="url(#grad)"/>
  <text x="50" y="70" font-family="Arial" font-size="32" fill="#fff" font-weight="bold">AI Bounty Board</text>
  <text x="1150" y="70" font-family="Arial" font-size="24" fill="#fff" text-anchor="end">${index + 1} / ${total}</text>
  <rect x="50" y="100" width="250" height="80" fill="#fff" rx="10"/>
  <text x="175" y="150" font-family="Arial" font-size="36" fill="#667eea" text-anchor="middle" font-weight="bold">${reward} USDC</text>
  <text x="50" y="240" font-family="Arial" font-size="42" fill="#fff" font-weight="bold">${bounty.title.substring(0, 40)}</text>
  <text x="50" y="300" font-family="Arial" font-size="24" fill="#eee">${bounty.description.substring(0, 60)}...</text>
  <text x="50" y="340" font-family="Arial" font-size="24" fill="#eee">${bounty.description.substring(60, 120)}...</text>
  <text x="50" y="420" font-family="Arial" font-size="20" fill="#ddd">Tags: ${bounty.tags.slice(0, 4).join(' · ')}</text>
  <text x="50" y="580" font-family="Arial" font-size="18" fill="#ccc">Status: ${bounty.status.toUpperCase()}</text>
  <text x="1150" y="580" font-family="Arial" font-size="18" fill="#ccc" text-anchor="end">bounty.owockibot.xyz</text>
</svg>`;
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    try {
      if (url.pathname === '/') {
        const bounties = await fetchBounties('open');
        return new Response(generateFrameHTML({
          title: 'AI Bounty Board',
          description: `Browse ${bounties.length} open bounties`,
          imageUrl: `${BASE_URL}/image/0`,
          buttons: [
            { label: '▶️ Next', action: 'post', target: `${BASE_URL}/action` },
            { label: '🔗 View All', action: 'link', target: 'https://bounty.owockibot.xyz' }
          ],
          postUrl: `${BASE_URL}/action`
        }), { headers: { 'Content-Type': 'text/html' } });
      }

      if (url.pathname.startsWith('/image/')) {
        const index = parseInt(url.pathname.split('/')[2] || '0');
        const bounties = await fetchBounties('open');
        const bounty = bounties[index] || bounties[0];
        return new Response(generateBountyImage(bounty, index, bounties.length), {
          headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'max-age=10' }
        });
      }

      if (url.pathname === '/action' && req.method === 'POST') {
        const body = await req.json() as any;
        const bounties = await fetchBounties('open');
        const currentIndex = parseInt(body?.untrustedData?.state || '0');
        const nextIndex = Math.min(currentIndex + 1, bounties.length - 1);

        return new Response(generateFrameHTML({
          title: bounties[nextIndex]?.title || 'AI Bounty Board',
          description: bounties[nextIndex]?.description.substring(0, 200) || '',
          imageUrl: `${BASE_URL}/image/${nextIndex}`,
          buttons: [
            { label: '◀️ Prev', action: 'post', target: `${BASE_URL}/action` },
            { label: '▶️ Next', action: 'post', target: `${BASE_URL}/action` },
            { label: '🔗 Claim', action: 'link', target: 'https://bounty.owockibot.xyz' }
          ],
          postUrl: `${BASE_URL}/action`
        }), { headers: { 'Content-Type': 'text/html' } });
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
});

console.log(`🚀 Farcaster Bounty Frame running on ${BASE_URL}`);
