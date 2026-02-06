# Farcaster Bounty Frame

A Farcaster Frame for browsing [AI Bounty Board](https://bounty.owockibot.xyz) bounties directly in your Warpcast feed.

**Live:** https://farcaster-bounty-frame.fly.dev/

## Preview

When viewed in a browser, the Frame displays:
- Beautiful gradient SVG images showing bounty details
- Bounty title, description, and reward amount
- Tags and status information
- Navigation buttons for browsing

In Farcaster/Warpcast, users can interact with buttons to browse bounties and navigate to the bounty board.

## Features

- 📋 **Browse Open Bounties** - Paginate through available work
- 💰 **See USDC Rewards** - Clearly displayed compensation
- 🎨 **Beautiful UI** - Purple gradient design with clean typography
- 🏷️ **Tag Display** - See bounty categories at a glance
- ⚡ **Fast Responses** - Meets Farcaster's <5s requirement
- 🔗 **Direct Links** - Click through to claim bounties

## Tech Stack

- **Runtime:** Bun
- **Server:** Native Bun.serve()
- **Images:** Dynamic SVG generation
- **Protocol:** Farcaster Frames v2 (vNext)
- **API:** Live integration with bounty.owockibot.xyz

## Quick Start

```bash
# Install (no dependencies needed!)
bun install

# Run locally
bun run index.ts

# Visit http://localhost:3000
```

## Testing

**In Browser:**
- Visit http://localhost:3000 to see the styled preview

**In Warpcast:**
1. Deploy to a public URL (Railway, Fly.io, etc.)
2. Go to [Warpcast Developer Playground](https://warpcast.com/~/developers/frames)
3. Paste your Frame URL
4. Test button interactions

## Deployment

**Railway (Recommended):**
```bash
railway up
```

**Fly.io:**
```bash
fly launch
```

Set `BASE_URL` environment variable to your deployed URL.

## How It Works

1. **Fetches** live bounty data from the AI Bounty Board API
2. **Filters** for open bounties
3. **Generates** SVG images with bounty details
4. **Serves** Frame-compliant HTML with meta tags
5. **Handles** button interactions for pagination

## Frame Structure

```typescript
// Frame metadata
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="..." />
<meta property="fc:frame:button:1" content="▶️ Next" />

// Dynamic SVG image shows:
- Bounty title
- Reward amount (USDC)
- Description preview
- Tags
- Pagination (1/5, etc.)
```

## API Endpoints

- `GET /` - Initial frame view
- `GET /image/:index` - Generate bounty SVG
- `POST /action` - Handle button clicks

## License

MIT
