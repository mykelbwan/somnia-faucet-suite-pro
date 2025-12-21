# Somnia Faucet Suite

The ultimate automated onboarding solution for the Somnia Ecosystem.

The Somnia Faucet Suite is a multi-channel, production-grade infrastructure tool designed to eliminate manual testnet token requests. By integrating Discord, Telegram, and a secure backend API, it provides a seamless "Day 1" experience for developers joining the Somnia Shannon Testnet.

### Key Features

Multi-Channel Entry: Seamless integration for Discord (/faucet slash commands) and Telegram (! commands).

Sybil Protection: Advanced rate-limiting (1 claim/24h) keyed to both Wallet Address and Social ID to prevent network drain.

Multi-Asset Support: Native $STT and ERC20 (USDC) distribution from a single smart contract.

Developer-First API: Clean REST endpoints for external tool integration.

High-Performance Backend: Built with Express.js and Ethers.js for sub-second response times.

## Architecture

The project is managed as a high-performance pnpm monorepo to ensure type safety and easy deployment across services.
```Code snippet
graph TD
    A[User: Discord/Telegram] -->|Request| B[Bot Layer]
    B -->|API Call| C[Express Backend]
    C -->|Validate & Rate Limit| D[Local DB]
    D -->|Authorized| E[SomniaFaucet.sol]
    E -->|On-Chain TX| F[User Wallet]
    F -->|TX Hash| B
    B -->|Confirmation| A
```
contracts: Foundry-based smart contracts for secure, owner-managed token distribution.

backend: The central brain; handles Ethers.js providers and security logic.

discord-bot: Modern Discord.js implementation with slash command support.

tg-bot: Lightweight Telegraf-based bot for community groups.

### Quick Start

Prerequisites:
Node.js (v18+) & pnpm

Foundry (for contract management)

### Installation
```Bash
git clone https://github.com/mykelbwan/somnia-faucet-suite.git
cd somnia-faucet-suite
pnpm install -r
```
### Environment Configuration

Each service requires a .env file. Key variables include:

Backend: RPC_PROVIDER, PRIVATE_KEY (Deployer), SMART_CONTRACT address.

Bots: DISCORD_BOT_TOKEN / TELEGRAM_BOT_TOKEN, and the MAIN_ENTRY (Backend URL).

### Smart Contract Deployment

The SomniaFaucet.sol is designed for low gas consumption and high security.
```Bash
cd contracts
forge script script/SomniaFaucet.s.sol --rpc-url <SOMNIA_RPC_URL> --broadcast
```
Note: Ensure the backend PRIVATE_KEY matches the contract owner to authorize token transfers.

### Usage Examples
Discord Command:
```Plaintext
/faucet token:STT wallet:0xYourWalletAddress
```
Telegram Command:
```Plaintext
!STT 0xYourWalletAddress
```

### Roadmap & Ecosystem Vision (2026)
My goal is to provide a unified Developer Experience (DX) Layer for Somnia. 
The Faucet Suite is the foundation, with the following modules in development:

AI-Support Integration (In Progress): Integrating my Somnia DevAssist, a RAG-based AI agent directly into the Discord/Telegram bots. This allows the suite to handle both token distribution and complex technical queries using official Somnia documentation.

Analytics Dashboard: A web-based interface for the DevRel team to monitor faucet health, track unique developer onboarding metrics, and identify geographical growth trends in the ecosystem.
