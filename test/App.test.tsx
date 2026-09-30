import { act, render, screen } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { expect, it, vi } from 'vitest';
import App from '../src/App';

vi.mock('firebase/auth', async original => ({
  ...await original<typeof import('firebase/auth')>(), onAuthStateChanged: vi.fn(),
}));

it('integra o roteador e apresenta o login real após carregar a sessão', () => {
  let receive!: (user: User | null) => void;
  vi.mocked(onAuthStateChanged).mockImplementation((_auth, next) => {
    receive = next as typeof receive;
    return vi.fn();
  });
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  window.history.replaceState({}, '', '/');
  render(<App />);
  expect(screen.getByRole('status')).toHaveTextContent('Carregando sua sessão');
  act(() => receive(null));
  expect(screen.getByRole('button', { name: /Entrar na Minha Conta/ })).toBeInTheDocument();
  expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
});
