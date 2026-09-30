import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// Nenhum teste inicializa serviços reais ou usa as credenciais do .env.
vi.mock('../src/firebase/firebase', () => ({ auth: {}, db: {} }));

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
