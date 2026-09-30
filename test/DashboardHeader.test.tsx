import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { expect, it, vi } from 'vitest';
import DashboardHeader from '../src/components/DashboardHeader/DashboardHeader';
import { deferred, student } from './fixtures';

vi.mock('firebase/auth', () => ({ signOut: vi.fn() }));

it('mostra a conta e fecha o menu por Escape ou clique externo', async () => {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={['/inicio']}><DashboardHeader user={student} /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'page');
  const toggle = screen.getByLabelText('Conta de Ana Silva');
  await user.click(toggle);
  expect(toggle.closest('details')).toHaveAttribute('open');
  await user.keyboard('{Escape}');
  expect(toggle.closest('details')).not.toHaveAttribute('open');
  expect(toggle).toHaveFocus();
  await user.click(toggle);
  fireEvent.pointerDown(document.body);
  expect(toggle.closest('details')).not.toHaveAttribute('open');
});

it('impede logout duplicado e permite repetir após falha', async () => {
  const pending = deferred();
  vi.mocked(signOut).mockReturnValueOnce(pending.promise).mockResolvedValueOnce(undefined);
  const user = userEvent.setup();
  render(<MemoryRouter><DashboardHeader user={student} /></MemoryRouter>);
  await user.click(screen.getByLabelText('Conta de Ana Silva'));
  await user.dblClick(screen.getByRole('button', { name: 'Sair da conta' }));
  expect(signOut).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Saindo…' })).toBeDisabled();
  await act(async () => pending.reject(new FirebaseError('auth/network-request-failed', 'offline')));
  expect(screen.getByRole('alert')).toHaveTextContent('Verifique sua conexão');
  await user.click(screen.getByRole('button', { name: 'Sair da conta' }));
  expect(signOut).toHaveBeenCalledTimes(2);
});

it.each([
  [{ ...student, displayName: null }, 'ana'],
  [{ ...student, displayName: null, email: null }, 'Enxadrista'],
])('usa nome alternativo quando o perfil está incompleto', (user, name) => {
  render(<MemoryRouter><DashboardHeader user={user} /></MemoryRouter>);
  expect(screen.getByLabelText('Conta de ' + name)).toBeInTheDocument();
});

it('rola até os módulos quando a rota contém a âncora', () => {
  const scroll = vi.fn();
  const section = document.createElement('section');
  section.id = 'modulos';
  section.scrollIntoView = scroll;
  document.body.append(section);
  render(<MemoryRouter initialEntries={['/inicio#modulos']}><DashboardHeader user={student} /></MemoryRouter>);
  expect(scroll).toHaveBeenCalledOnce();
  section.remove();
});
