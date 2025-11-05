# RVM Web3 Payment PWA

A Progressive Web App enabling secure cryptocurrency payments via Web3 across multiple blockchain networks.

## Features

- 🔐 **Multi-Wallet Support**: Connect with Privy (embedded), MetaMask, WalletConnect, and more
- 🌐 **Multi-Chain**: Support for Ethereum, Polygon, and more (Arbitrum, Optimism, Base, BSC in Phase 2)
- 💳 **Payment Processing**: Send cryptocurrency payments securely
- 🔄 **Token Swap**: Exchange tokens seamlessly
- 🛒 **Marketplace**: Browse and purchase items with crypto
- 📱 **PWA**: Installable Progressive Web App with offline support
- 🎨 **Modern UI**: Built with Tailwind CSS and responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi + viem
- **Wallets**: Privy + Reown/WalletConnect
- **State Management**: Zustand
- **PWA**: next-pwa

## 📚 Documentation

Comprehensive documentation is available in the [`/docs`](./docs/) directory:

- **[Setup & Configuration](./docs/setup/)** - Initial setup, Privy config, environment variables
- **[Development](./docs/development/)** - Development guidelines and verification reports
- **[Architecture](./docs/architecture/)** - System design, API specs, components
- **[Product & Planning](./docs/product/)** - Product strategy, roadmap, requirements
- **[Design](./docs/design/)** - Design system, wireframes, user flows
- **[Infrastructure](./docs/infrastructure/)** - DevOps, CI/CD, deployment
- **[Troubleshooting](./docs/troubleshooting/)** - Common issues and solutions
- **[Reports](./docs/reports/)** - Development status and progress reports

Quick links:
- [Privy Setup Guide](./docs/setup/PRIVY_SETUP.md)
- [Console Errors Guide](./docs/troubleshooting/CONSOLE_ERRORS_GUIDE.md)
- [Token Addresses](./docs/setup/TOKEN_ADDRESSES.md)

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/clkhoo5211/bookish-waffle.git
cd bookish-waffle
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your:
- `NEXT_PUBLIC_PRIVY_APP_ID` (Get from https://privy.io)
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (Get from https://cloud.reown.com)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── marketplace/       # Marketplace page
│   ├── swap/              # Token swap page
│   ├── tokens/            # Token management page
│   └── payment/           # Payment page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── wallet/           # Wallet components
│   └── layout/           # Layout components
├── lib/                   # Utility libraries
│   └── web3/             # Web3 configuration
├── store/                 # Zustand stores
├── types/                 # TypeScript types
└── public/                # Static assets
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Deployment

The project is configured for deployment on:
- **GitHub Pages**: Automated via GitHub Actions
- **Vercel**: Recommended for Next.js apps

See `.github/workflows/` for CI/CD configuration.

## License

ISC
