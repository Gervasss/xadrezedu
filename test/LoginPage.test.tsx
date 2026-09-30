import { act, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import LoginPage from '../src/Pages/LoginPage/LoginPage';

vi.mock('../src/components/LoginPageDesktop/LoginPageDesktop', () => ({
  default: ({ authenticated }: { authenticated: boolean }) => <p>Desktop {String(authenticated)}</p>,
}));
vi.mock('../src/components/LoginPageMobile/LoginPageMobile', () => ({
  default: ({ authenticated }: { authenticated: boolean }) => <p>Mobile {String(authenticated)}</p>,
}));

it('troca o formulário ao mudar a viewport e remove a assinatura ao desmontar', () => {
  let listener = () => {};
  const media = { matches: false, addEventListener: vi.fn((_: string, callback: () => void) => { listener = callback; }), removeEventListener: vi.fn() };
  vi.stubGlobal('matchMedia', vi.fn(() => media));
  const { unmount } = render(<LoginPage authenticated />);
  expect(screen.getByText('Desktop true')).toBeInTheDocument();
  act(() => { media.matches = true; listener(); });
  expect(screen.getByText('Mobile true')).toBeInTheDocument();
  expect(screen.queryByText('Desktop true')).not.toBeInTheDocument();
  unmount();
  expect(media.removeEventListener).toHaveBeenCalledWith('change', listener);
});

it('mostra o formulário móvel sem sessão', () => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  render(<LoginPage />);
  expect(screen.getByText('Mobile false')).toBeInTheDocument();
});
