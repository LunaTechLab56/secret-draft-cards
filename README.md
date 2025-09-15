# Secret Draft Cards

A decentralized trading card game platform built with FHE (Fully Homomorphic Encryption) technology, enabling secure and private card trading and gameplay.

## Features

- **FHE-Encrypted Card Data**: All card statistics and game data are encrypted using fully homomorphic encryption
- **Decentralized Trading**: Secure peer-to-peer card trading on the blockchain
- **Private Gameplay**: Game mechanics and card interactions remain private while on-chain
- **Web3 Integration**: Built with RainbowKit and Wagmi for seamless wallet connectivity
- **Modern UI**: Beautiful interface built with React, TypeScript, and Tailwind CSS

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Web3**: RainbowKit, Wagmi, Viem
- **Blockchain**: Ethereum Sepolia Testnet
- **Encryption**: FHE (Fully Homomorphic Encryption) via Zama Network
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask, Rainbow, etc.)
- Sepolia ETH for gas fees

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LunaTechLab56/secret-draft-cards.git
cd secret-draft-cards
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

## Smart Contract

The project includes a Solidity smart contract that handles:
- FHE-encrypted card data storage
- Secure card trading mechanisms
- Game state management
- Reputation and scoring systems

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub or contact the development team.