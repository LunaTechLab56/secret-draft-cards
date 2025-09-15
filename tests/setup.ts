import { beforeAll, afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';

// Mock Web3 providers
global.ethereum = {
  isMetaMask: true,
  request: vi.fn(),
  on: vi.fn(),
  removeListener: vi.fn(),
};

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  value: global.ethereum,
  writable: true,
});

// Mock FHE library
vi.mock('@fhevm/solidity/lib/FHE.sol', () => ({
  FHE: {
    asEuint32: vi.fn((value: number) => ({ value, encrypted: true })),
    fromExternal: vi.fn((external: any) => ({ value: external.value, encrypted: true })),
    add: vi.fn((a: any, b: any) => ({ value: a.value + b.value, encrypted: true })),
    decrypt: vi.fn((encrypted: any) => encrypted.value)
  }
}));

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
    connector: { name: 'MetaMask' }
  })),
  useConnect: vi.fn(() => ({
    connect: vi.fn(),
    connectors: []
  })),
  useDisconnect: vi.fn(() => ({
    disconnect: vi.fn()
  })),
  useNetwork: vi.fn(() => ({
    chain: { id: 11155111, name: 'Sepolia' }
  }))
}));

// Mock RainbowKit
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: ({ children }: { children: any }) => children({
      account: { displayName: '0x1234...5678' },
      chain: { name: 'Sepolia', hasIcon: true, iconUrl: '/icon.png' },
      openAccountModal: vi.fn(),
      openChainModal: vi.fn(),
      openConnectModal: vi.fn(),
      authenticationStatus: 'authenticated',
      mounted: true
    })
  }
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn()),
  useLocation: vi.fn(() => ({ pathname: '/' })),
  BrowserRouter: ({ children }: { children: any }) => children,
  Routes: ({ children }: { children: any }) => children,
  Route: ({ element }: { element: any }) => element
}));

// Mock TanStack Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null
  })),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: any }) => children
}));

// Setup and teardown
beforeAll(() => {
  // Global test setup
  console.log('Setting up test environment...');
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

afterAll(() => {
  // Global test teardown
  console.log('Cleaning up test environment...');
});
