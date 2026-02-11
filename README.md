# scribbl scrobbl

**Scan it. Spin it. Scrobble it.**

Turn your physical music collection into Last.fm scrobbles. Point your camera at a CD or vinyl barcode, and scribbl scrobbl will log the entire album to your listening history — timed as if you're playing it right now.

## How It Works

1. Scan the barcode on your CD or vinyl
2. scribbl scrobbl looks up the album and its tracklist
3. Tracks are scrobbled sequentially to Last.fm, starting from the moment you scan
4. Each song is timestamped as if you listened to it in order — first track now, last track in the future

No more manually logging your physical media. Just scan and listen.

## Tech Stack

- **Frontend**: Svelte 5 + TypeScript + Vite
- **Hosting**: Cloudflare Pages
- **Package Manager**: Bun

## Development

### Prerequisites

You can set up the dev environment in two ways:

#### Option 1: Using Nix (Recommended)

If you have Nix with flakes enabled:

```bash
nix develop
```

This gives you Bun, Node.js, Wrangler, and all the tooling you need.

#### Option 2: Manual Setup

Make sure you have installed:
- [Bun](https://bun.sh/) (v1.0+)
- [Node.js](https://nodejs.org/) (v20+, for some tooling compatibility)

### Getting Started

```bash
# Navigate to the app directory
cd app

# Install dependencies
bun install

# Start the dev server
bun run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with hot reload |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build locally |
| `bun run check` | Run TypeScript and Svelte type checking |

### Deploying

Build and deploy to Cloudflare Pages:

```bash
bun run build
wrangler pages deploy dist
```

## License

MIT
