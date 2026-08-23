// Mock environment for Node.js tsx execution of GroundEase web tests

const memoryStorage = new Map<string, string>();

const mockLocalStorage = {
  getItem: (key: string): string | null => memoryStorage.get(key) ?? null,
  setItem: (key: string, value: string): void => {
    memoryStorage.set(key, String(value));
  },
  removeItem: (key: string): void => {
    memoryStorage.delete(key);
  },
  clear: (): void => {
    memoryStorage.clear();
  },
};

const mockDocument = {
  body: {
    style: {
      overflow: '',
    },
  },
  addEventListener: () => {},
  removeEventListener: () => {},
};

type GlobalWithMocks = typeof globalThis & {
  window?: {
    localStorage?: typeof mockLocalStorage;
    addEventListener?: () => void;
    removeEventListener?: () => void;
  };
  document?: typeof mockDocument;
};

const g = globalThis as unknown as GlobalWithMocks;

if (typeof g.window === 'undefined') {
  g.window = {
    localStorage: mockLocalStorage,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
} else if (!g.window.localStorage) {
  g.window.localStorage = mockLocalStorage;
}

if (typeof g.document === 'undefined') {
  g.document = mockDocument;
}

if (!('env' in Object.prototype)) {
  Object.defineProperty(Object.prototype, 'env', {
    value: { VITE_ENABLE_REMOTE_SYNC: 'false' },
    writable: true,
    configurable: true,
  });
}

export function resetMockStorage() {
  memoryStorage.clear();
  if (g.document?.body?.style) {
    g.document.body.style.overflow = '';
  }
}
