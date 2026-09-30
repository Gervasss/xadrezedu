import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FirebaseError } from 'firebase/app';
import { browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import LoginPageDesktop from '../src/components/LoginPageDesktop/LoginPageDesktop';
import LoginPageMobile from '../src/components/LoginPageMobile/LoginPageMobile';
import { deferred, student } from './fixtures';

vi.mock('firebase/auth', async (original) => ({
  ...await original<typeof import('firebase/auth')>(),
  setPersistence: vi.fn(), signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(), signInWithPopup: vi.fn(),
  sendPasswordResetEmail: vi.fn(), updateProfile: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(setPersistence).mockResolvedValue(undefined);
  vi.mocked(signInWithEmailAndPassword).mockResolvedValue({ user: student } as never);
  vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({ user: student } as never);
  vi.mocked(signInWithPopup).mockResolvedValue({ user: student } as never);
  vi.mocked(updateProfile).mockResolvedValue(undefined);
  vi.mocked(sendPasswordResetEmail).mockResolvedValue(undefined);
});

describe.each([['desktop', LoginPageDesktop], ['mobile', LoginPageMobile]] as const)('Login %s', (_, Component) => {
  function mount(authenticated = false) {
    render(<MemoryRouter><Routes>
      <Route path="/" element={<Component authenticated={authenticated} />} />
      <Route path="/inicio" element={<h1>Dashboard de destino</h1>} />
    </Routes></MemoryRouter>);
    return userEvent.setup();
  }

  async function fill(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText('E-mail'), 'ana@example.com');
    await user.type(screen.getByLabelText('Senha'), 'senha123');
  }

  it('permite alternar cadastro, visibilidade da senha e lembrar sessão', async () => {
    const user = mount();
    expect(screen.queryByLabelText(/Nome completo/i)).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('Senha'), 'segredo');
    await user.click(screen.getByRole('button', { name: /Alternar visibilidade/ }));
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'text');
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));
    expect(screen.getByLabelText(/Nome completo/i)).toBeRequired();
    expect(screen.getByLabelText('Senha')).toHaveValue('');
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(screen.queryByLabelText(/Nome completo/i)).not.toBeInTheDocument();
  });

  it('autentica por e-mail com persistência local e navega', async () => {
    const user = mount();
    await fill(user);
    await user.click(screen.getByRole('button', { name: /Entrar na Minha Conta/ }));
    expect(await screen.findByRole('heading', { name: 'Dashboard de destino' })).toBeInTheDocument();
    expect(setPersistence).toHaveBeenCalledWith({}, browserLocalPersistence);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'ana@example.com', 'senha123');
  });

  it('cadastra o nome e respeita a persistência da sessão', async () => {
    const user = mount();
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));
    await user.type(screen.getByLabelText(/Nome completo/i), ' Ana Silva ');
    await fill(user);
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /Criar Minha Conta|Começar Jornada/ }));
    expect(await screen.findByText('Dashboard de destino')).toBeInTheDocument();
    expect(setPersistence).toHaveBeenCalledWith({}, browserSessionPersistence);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith({}, 'ana@example.com', 'senha123');
    expect(updateProfile).toHaveBeenCalledWith(student, { displayName: 'Ana Silva' });
  });

  it('bloqueia envios duplicados e mostra erro de autenticação', async () => {
    const pending = deferred<never>();
    vi.mocked(signInWithEmailAndPassword).mockReturnValueOnce(pending.promise);
    const user = mount();
    await fill(user);
    await user.dblClick(screen.getByRole('button', { name: /Entrar na Minha Conta/ }));
    expect(screen.getByRole('button', { name: /Aguarde/ })).toBeDisabled();
    expect(screen.getByLabelText('E-mail')).toBeDisabled();
    expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    await act(async () => pending.reject(new FirebaseError('auth/invalid-credential', 'invalid')));
    expect(screen.getByRole('alert')).toHaveTextContent('E-mail ou senha incorretos');
    expect(screen.getByRole('button', { name: /Entrar na Minha Conta/ })).toBeEnabled();
  });

  it('autentica com Google', async () => {
    const user = mount();
    await user.click(screen.getByRole('button', { name: 'Continuar com o Google' }));
    expect(await screen.findByText('Dashboard de destino')).toBeInTheDocument();
    expect(signInWithPopup).toHaveBeenCalledTimes(1);
  });

  it('solicita recuperação e informa o envio', async () => {
    const user = mount();
    await user.type(screen.getByLabelText('E-mail'), 'ana@example.com');
    await user.click(screen.getByRole('button', { name: 'Esqueceu a senha?' }));
    expect(await screen.findByRole('status')).toHaveTextContent('instruções para redefinir sua senha');
    expect(sendPasswordResetEmail).toHaveBeenCalledWith({}, 'ana@example.com');
  });

  it('informa criação da conta mesmo se o nome não puder ser salvo', async () => {
    vi.mocked(updateProfile).mockRejectedValueOnce(new Error('offline'));
    const user = mount();
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));
    await user.type(screen.getByLabelText(/Nome completo/i), 'Ana');
    await fill(user);
    await user.click(screen.getByRole('button', { name: /Criar Minha Conta|Começar Jornada/ }));
    expect(await screen.findByRole('status')).toHaveTextContent('Conta criada');
    expect(screen.queryByText('Dashboard de destino')).not.toBeInTheDocument();
  });

  it('redireciona quem já está autenticado', async () => {
    mount(true);
    expect(await screen.findByText('Dashboard de destino')).toBeInTheDocument();
  });
});
