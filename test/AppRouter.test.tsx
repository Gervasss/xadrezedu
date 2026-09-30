import { act, render, screen } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { beforeEach, expect, it, vi } from 'vitest';
import AppRouter from '../src/Routes/AppRouter';
import { student } from './fixtures';

vi.mock('firebase/auth', () => ({ onAuthStateChanged: vi.fn() }));
vi.mock('../src/Pages/LoginPage/LoginPage', () => ({ default: () => <h1>Entrada</h1> }));
vi.mock('../src/Pages/HomePage/HomePage', () => ({ default: ({ user }: { user: User }) => <h1>Início {user.uid}</h1> }));
vi.mock('../src/Pages/Lessons/LessonPage', () => ({ default: ({ user }: { user: User }) => <h1>Lição {user.uid}</h1> }));

let receive: (user: User | null) => void;
let fail: () => void;
const unsubscribe = vi.fn();
beforeEach(() => {
  vi.mocked(onAuthStateChanged).mockImplementation((_auth, next, error) => {
    receive = next as typeof receive;
    fail = error as () => void;
    return unsubscribe;
  });
  window.history.replaceState({}, '', '/');
});

it('aguarda a sessão e cancela a assinatura ao desmontar', () => {
  const { unmount } = render(<AppRouter />);
  expect(screen.getByRole('status')).toHaveTextContent('Carregando sua sessão');
  expect(screen.queryByText('Entrada')).not.toBeInTheDocument();
  unmount();
  expect(unsubscribe).toHaveBeenCalledOnce();
});

it.each(['/inicio', '/licoes/cavalo', '/login', '/desconhecida'])('leva visitante de %s à entrada', async path => {
  window.history.replaceState({}, '', path);
  render(<AppRouter />);
  act(() => receive(null));
  expect(await screen.findByRole('heading', { name: 'Entrada' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/');
});

it.each([['/inicio', 'Início'], ['/licoes/cavalo', 'Lição']])('libera %s para o usuário autenticado e reage ao logout', async (path, title) => {
  window.history.replaceState({}, '', path);
  render(<AppRouter />);
  act(() => receive(student));
  expect(screen.getByRole('heading')).toHaveTextContent(title + ' aluno-1');
  act(() => receive(null));
  expect(await screen.findByText('Entrada')).toBeInTheDocument();
});

it('não monta conteúdo privado quando carregar a sessão falha', () => {
  render(<AppRouter />);
  act(() => fail());
  expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar sua sessão');
  expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
  expect(screen.queryByText('Entrada')).not.toBeInTheDocument();
});
