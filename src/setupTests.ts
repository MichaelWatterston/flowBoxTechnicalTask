import '@testing-library/jest-dom';

// Extend globalThis to include importMetaEnv
declare global {
  // eslint-disable-next-line no-var
  var importMetaEnv: {
    VITE_INSTAGRAM_ACCESS_TOKEN: string;
    VITE_INSTAGRAM_USER_ID: string;
  };
}

// Mock import.meta.env for Jest
globalThis.importMetaEnv = {
  VITE_INSTAGRAM_ACCESS_TOKEN: 'mock_token',
  VITE_INSTAGRAM_USER_ID: 'test_user_id_123',
};

// Mock import.meta for Jest
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.import = {
  meta: {
    env: globalThis.importMetaEnv,
  },
};
