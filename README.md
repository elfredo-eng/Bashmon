# BASHMONS

A clean, minimal Web3 product website with Profile, Collection, Leaderboard, and
Tasks pages, light/dark mode, a responsive sidebar/mobile drawer, and wallet
connect via any EVM-compatible injected wallet (MetaMask, Rabby, Coinbase
Wallet, etc).

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
bashmons/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx        # React entry point
    ├── index.css       # global reset
    └── App.jsx         # the entire BASHMONS app (nav, pages, wallet hook, theme)
```

Everything — navigation, theming, the wallet hook, and all four pages — lives
in `src/App.jsx` as a set of small components, so it's easy to split into
separate files later if the project grows.

## Before you launch

Open `src/App.jsx` and update the `CONFIG` object near the top:

```js
const CONFIG = {
  projectName: "BASHMONS",
  openSeaUrl: "https://opensea.io/collection/bashmons",     // real collection URL
  contractAddress: "0x0000000000000000000000000000000000dEaD", // real NFT contract
  social: {
    discord: "https://discord.gg/bashmons",
    telegram: "https://t.me/bashmons",
    x: "https://x.com/bashmons",
    instagram: "https://instagram.com/bashmons",
  },
};
```

There are a few places intentionally left as stubs, marked with `TODO`
comments in the code, since they need real backend/API wiring:

- **NFT fetching** — `App.jsx` simulates fetching a connected wallet's NFTs.
  Replace this with a call to an indexer (Alchemy, Moralis, or the OpenSea
  API) filtered by the wallet address and `CONFIG.contractAddress`.
- **X OAuth / Discord OAuth / Email verification** — the Profile and Tasks
  pages show "Connect" buttons for these. Wire `handleConnectAccount` and
  `handleTaskAction` in `App.jsx` up to your real OAuth/verification flows.
- **Points and Rank** — currently static placeholder values. Fetch these
  from your backend once a user is signed in.
- **Task completion / point awarding** — must be verified server-side before
  a task shows as complete or a user's points increase. The current buttons
  only open the relevant connect flow; they don't award points on click.

## Wallet connection

Wallet connect uses the browser's standard [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)
provider API (`window.ethereum`) directly — no external wallet SDK is
required. It works with any injected EVM wallet extension. If no wallet
extension is installed, the Connect Wallet button will show an inline error
message.

## Tech

- React 18 + Vite 5
- [lucide-react](https://lucide.dev) for UI icons
- Plain CSS (inline style tokens for light/dark theming) — no CSS framework
  dependency, so there's nothing extra to configure
