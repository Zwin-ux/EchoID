// Mock winston globally to prevent Node.js API usage
jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    add: jest.fn(),
  })),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    errors: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '';
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_POLKADOT_WS = 'ws://localhost:9944';
process.env.NEXT_PUBLIC_POLKADOT_WS_FALLBACK = 'ws://localhost:9945';
process.env.NEXT_PUBLIC_APP_NAME = 'EchoID';

// Global test setup
beforeAll(() => {
  // Suppress console errors during tests unless explicitly testing for them
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});