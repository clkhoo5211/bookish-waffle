# RVM Web3 Payment PWA

A Progressive Web App (PWA) enabling secure cryptocurrency payments via Web3 across multiple blockchain networks.

## 🎯 Project Overview

This PWA provides a comprehensive platform for cryptocurrency payments with features including:
- **Marketplace**: Browse and purchase items/services with crypto
- **Token Swap**: Exchange tokens across different blockchain networks
- **Wallet Connection**: Connect external wallets or use embedded wallet solutions
- **Payment Processing**: Secure multi-chain payment confirmation and processing
- **Token Management**: View and manage token balances across chains

## 🏗️ Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Web3 Libraries**: wagmi + viem
- **Wallet Services**: Privy (embedded wallets) + Reown/WalletConnect (external wallets)
- **Styling**: Tailwind CSS (recommended)
- **PWA**: next-pwa plugin
- **State Management**: Zustand or React Context

## 📋 Design Source

UI/UX designs are based on mockups from the RVM design2 directory:
- Home page
- Marketplace interface
- Token swap interface
- Wallet connection screens
- Payment confirmation flows
- Token management interface

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd project-20251105-101145-rvm-web3-pwa

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
# Wallet Service Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Blockchain RPC URLs (optional, uses public RPCs by default)
NEXT_PUBLIC_ETHEREUM_RPC_URL=
NEXT_PUBLIC_POLYGON_RPC_URL=
NEXT_PUBLIC_BSC_RPC_URL=
```

## 📚 Documentation

- **Project Requirements**: See `project-requirements-20251105-101145.md`
- **Research & Resources**: See `resource-links-20251105-101145.md`
- **Agent Workflow**: See `CLAUDE.md`
- **Change Log**: See `change-log.md`

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [wagmi Documentation](https://wagmi.sh/)
- [Privy Documentation](https://docs.privy.io/)
- [Reown/WalletConnect Documentation](https://docs.reown.com/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

## 📝 Development Status

**Current Phase**: Planning  
**Last Updated**: 2025-11-05 10:11:45

See `CLAUDE.md` for detailed agent workflow and project status.

## 🤝 Contributing

This project follows the Multi-Agent SDLC Framework. See the framework documentation for contribution guidelines.

## 📄 License

[To be determined]

---

**Project Created**: 2025-11-05 10:11:45  
**Framework**: Multi-Agent SDLC v2.0

