# 📚 Documentation Structure Guide

## Overview

All documentation has been reorganized into a logical, navigable structure within the `/docs` directory. This makes it easy to find relevant information and supports GitHub Pages deployment.

## Directory Structure

```
docs/
├── README.md                          # Main documentation index
│
├── setup/                             # 🔧 Configuration & Setup
│   ├── README.md                      # Setup overview
│   ├── GITHUB_SETUP.md               # Repository setup
│   ├── PRIVY_SETUP.md                # Authentication config
│   ├── TOKEN_ADDRESSES.md            # Smart contracts & env vars
│   └── SETUP_COMPLETE.md             # Setup checklist
│
├── development/                       # 💻 Development Docs
│   └── development-verification-report.md
│
├── architecture/                      # 🏗️ System Architecture
│   ├── README.md                      # Architecture overview
│   ├── architecture.md                # System design
│   ├── api-specs/                     # API specifications
│   │   └── web3-integration.md
│   └── specs/                         # Component specs
│       └── component-specifications.md
│
├── product/                           # 📊 Product & Planning
│   ├── README.md                      # Product docs overview
│   ├── product-strategy-*.md          # Product strategy
│   ├── market-research-*.md           # Market analysis
│   ├── feature-prioritization-*.md    # Feature priorities
│   ├── user-personas-*.md             # User profiles
│   ├── project-requirements-*.md      # Initial requirements
│   ├── resource-links-*.md            # External resources
│   ├── roadmap.md                     # Development roadmap
│   ├── requirements.md                # Detailed requirements
│   └── risk-register.md               # Risk assessment
│
├── design/                            # 🎨 Design System
│   ├── README.md                      # Design overview
│   ├── design-system/                 # Design specifications
│   │   ├── design-system.md
│   │   └── accessibility-report.md
│   ├── wireframes/                    # Wireframes
│   │   └── ux-wireframes.md
│   └── user-flows/                    # User flows
│       └── ux-user-flows.md
│
├── infrastructure/                    # 🚀 DevOps & Infrastructure
│   ├── README.md                      # Infrastructure overview
│   ├── deployment-guide.md            # Deployment instructions
│   ├── environment-management.md      # Env configuration
│   ├── monitoring-and-operations.md   # Operations guide
│   ├── ci-cd/                         # CI/CD workflows
│   │   └── README.md
│   ├── data-governance/               # Data policies
│   │   ├── data-governance-policy.md
│   │   └── data-quality-report.md
│   ├── data-pipeline/                 # Data architecture
│   │   └── client-data-architecture.md
│   └── analytics/                     # Analytics strategy
│       └── analytics-strategy.md
│
├── troubleshooting/                   # 🔍 Issue Resolution
│   ├── README.md                      # Troubleshooting guide
│   └── CONSOLE_ERRORS_GUIDE.md       # Console errors & solutions
│
├── reports/                           # 📝 Status Reports
│   ├── README.md                      # Reports overview
│   ├── progress.md                    # Overall progress
│   ├── FINAL_STATUS.md               # Final status report
│   ├── ALL_PAGES_FIXED_SUMMARY.md    # Pages completion
│   ├── REBUILD_COMPLETE.md           # Rebuild summary
│   ├── UI_COMPARISON_REPORT.md       # UI verification
│   └── [Many other status reports]
│
├── compliance/                        # ⚖️ Legal & Compliance
│   ├── privacy-policy.md
│   ├── terms-of-service.md
│   ├── cookie-policy.md
│   ├── compliance-report.md
│   └── compliance-checklist.md
│
├── test-results/                      # ✅ Testing
│   └── test-report.md
│
├── code-review-report.md             # 👀 Code Review
├── security-report.md                # 🔒 Security Audit
└── DEVELOP_AGENT_REBUILD_PLAN.md     # 🤖 Agent Plans
```

## Navigation Guide

### For New Users
Start here:
1. [Main README](../README.md) - Project overview
2. [Setup Guide](./setup/README.md) - Initial configuration
3. [Architecture](./architecture/README.md) - Understanding the system

### For Developers
Essential docs:
1. [Development Reports](./development/)
2. [Architecture & API Specs](./architecture/)
3. [Troubleshooting](./troubleshooting/CONSOLE_ERRORS_GUIDE.md)
4. [Code Review](./code-review-report.md)

### For Product/Business
Product docs:
1. [Product Strategy](./product/product-strategy-20251105-101145.md)
2. [Market Research](./product/market-research-20251105-101145.md)
3. [Roadmap](./product/roadmap.md)
4. [Status Reports](./reports/)

### For DevOps/Deployment
Infrastructure:
1. [Deployment Guide](./infrastructure/deployment-guide.md)
2. [Environment Management](./infrastructure/environment-management.md)
3. [CI/CD](./infrastructure/ci-cd/)

### For Design/UX
Design resources:
1. [Design System](./design/design-system/)
2. [Wireframes](./design/wireframes/)
3. [User Flows](./design/user-flows/)
4. [Figma Mockups](../design-assets/figma-mockups/)

## Quick Links by Topic

### Setup & Configuration
- [GitHub Setup](./setup/GITHUB_SETUP.md)
- [Privy Authentication](./setup/PRIVY_SETUP.md)
- [Token Addresses](./setup/TOKEN_ADDRESSES.md)

### Common Issues
- [Console Errors Guide](./troubleshooting/CONSOLE_ERRORS_GUIDE.md)
- [Hydration Errors](./troubleshooting/CONSOLE_ERRORS_GUIDE.md#hydration-errors)
- [WalletConnect Issues](./troubleshooting/CONSOLE_ERRORS_GUIDE.md#walletconnect)

### Technical Specs
- [System Architecture](./architecture/architecture.md)
- [Web3 Integration](./architecture/api-specs/web3-integration.md)
- [Component Specs](./architecture/specs/component-specifications.md)

### Legal & Compliance
- [Privacy Policy](./compliance/privacy-policy.md)
- [Terms of Service](./compliance/terms-of-service.md)
- [Cookie Policy](./compliance/cookie-policy.md)

## File Naming Conventions

- **README.md** - Overview and navigation for each directory
- **\*-report.md** - Analysis and detailed reports
- **\*-status.md** - Current status updates
- **\*-guide.md** - Step-by-step guides
- **\*-policy.md** - Policies and governance docs
- **\*-YYYYMMDD-HHMMSS.md** - Timestamped historical docs

## GitHub Pages Deployment

After deployment, documentation is accessible at:
- **Base URL**: https://clkhoo5211.github.io/bookish-waffle/
- **Docs**: https://clkhoo5211.github.io/bookish-waffle/docs/
- **Setup**: https://clkhoo5211.github.io/bookish-waffle/docs/setup/
- **Troubleshooting**: https://clkhoo5211.github.io/bookish-waffle/docs/troubleshooting/

## Maintenance

### Adding New Documentation
1. Place file in appropriate `/docs` subdirectory
2. Update subdirectory's README.md
3. Add link to main `/docs/README.md` if significant
4. Commit with descriptive message: `docs: Add [topic] documentation`

### Updating Existing Docs
1. Edit file in place
2. Update "Last Updated" timestamp if present
3. Commit with message: `docs: Update [file] - [brief description]`

### Deprecating Old Docs
1. Move to `/docs/reports/archive/` (create if needed)
2. Add deprecation notice to file header
3. Update links pointing to deprecated file

## Search Tips

To find specific documentation:
1. Check relevant subdirectory README.md first
2. Use GitHub's file finder: Press `t` in repository
3. Search within docs: `grep -r "search term" docs/`
4. Use GitHub search: `path:docs/ "search term"`

## Contributing

When adding documentation:
- Follow existing structure
- Create README.md for new directories
- Use clear, descriptive file names
- Add navigation links
- Update this guide if adding major sections

---

**Last Updated**: 2025-11-05
**Repository**: https://github.com/clkhoo5211/bookish-waffle

