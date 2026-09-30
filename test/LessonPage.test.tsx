import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { doc, runTransaction, serverTimestamp, Timestamp } from 'firebase/firestore';
import { beforeEach, expect, it, vi } from 'vitest';
import LessonPage from '../src/Pages/Lessons/LessonPage';
import { deferred, student } from './fixtures';

vi.mock('firebase/firestore', async (original) => ({
  ...await original<typeof import('firebase/firestore')>(),
  doc: vi.fn(() => 'reference'), runTransaction: vi.fn(),
  serverTimestamp: vi.fn(() => 'server-time'),
}));
vi.mock('../src/components/DashboardHeader/DashboardHeader', () => ({ default: () => <header>Cabeçalho</header> }));

const transaction = { get: vi.fn(), set: vi.fn() };
beforeEach(() => {
  transaction.get.mockResolvedValue({ data: () => undefined });
  vi.mocked(runTransaction).mockImplementation(async (_db, callback) => callback(transaction as never));
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
function mount(id = 'tabuleiro-coordenadas') {
  render(<MemoryRouter initialEntries={['/licoes/' + id]}><Routes>
    <Route path="/licoes/:lessonId" element={<LessonPage user={student} />} />
  </Routes></MemoryRouter>);
  return userEvent.setup();
}
async function solve(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /^e4,/ }));
  await user.click(screen.getByRole('button', { name: /Próximo exercício/ }));
  await user.click(screen.getByRole('button', { name: /^h1,/ }));
}
const save = () => screen.getByRole('button', { name: 'Concluir e salvar lição' });

it('trata IDs desconhecidos sem tentar salvar', () => {
  mount('inexistente');
  expect(screen.getByRole('heading', { name: 'Lição não encontrada' })).toBeInTheDocument();
  expect(runTransaction).not.toHaveBeenCalled();
});

it('exige todos os exercícios e a resposta correta antes de salvar', async () => {
  const user = mount();
  expect(screen.getByRole('button', { name: /Próximo exercício/ })).toBeDisabled();
  expect(screen.queryByRole('button', { name: 'Concluir e salvar lição' })).not.toBeInTheDocument();
  await solve(user);
  expect(save()).toBeDisabled();
  await user.click(screen.getByRole('radio', { name: 'f3' }));
  expect(save()).toBeDisabled();
  expect(screen.getByText(/Ainda não/)).toBeInTheDocument();
  expect(runTransaction).not.toHaveBeenCalled();
  await user.click(screen.getByRole('radio', { name: 'c6' }));
  await user.click(save());
  expect(await screen.findByText('Lição concluída e salva!')).toBeInTheDocument();
  expect(doc).toHaveBeenCalledWith({}, 'users', student.uid, 'lessonProgress', 'tabuleiro-coordenadas');
  expect(transaction.set).toHaveBeenCalledWith('reference', {
    status: 'completed', completedAt: 'server-time', exerciseCount: 2, reviewCorrect: true, contentVersion: 1,
  });
  expect(serverTimestamp).toHaveBeenCalledOnce();
  expect(screen.getByRole('link', { name: /Próxima lição/ })).toHaveAttribute('href', '/licoes/peao-promocao');
});

it('não confirma nem duplica enquanto o servidor não responde', async () => {
  const pending = deferred<never>();
  vi.mocked(runTransaction).mockReturnValueOnce(pending.promise);
  const user = mount();
  await solve(user);
  await user.click(screen.getByRole('radio', { name: 'c6' }));
  await user.dblClick(save());
  expect(screen.getByRole('button', { name: /Salvando conclusão/ })).toBeDisabled();
  expect(screen.queryByText('Lição concluída e salva!')).not.toBeInTheDocument();
  expect(runTransaction).toHaveBeenCalledOnce();
  await act(async () => pending.resolve(undefined as never));
  expect(screen.getByText('Lição concluída e salva!')).toBeInTheDocument();
});

it('mantém a conclusão original durante uma revisão', async () => {
  transaction.get.mockResolvedValue({ data: () => ({ status: 'completed', completedAt: Timestamp.fromMillis(1000) }) });
  const user = mount();
  await solve(user);
  await user.click(screen.getByRole('radio', { name: 'c6' }));
  await user.click(save());
  expect(await screen.findByText('Lição concluída e salva!')).toBeInTheDocument();
  expect(transaction.set).not.toHaveBeenCalled();
});

it('preserva a tentativa e permite repetir após permissão negada', async () => {
  vi.mocked(runTransaction).mockRejectedValueOnce({ code: 'permission-denied' });
  const user = mount();
  await solve(user);
  await user.click(screen.getByRole('radio', { name: 'c6' }));
  await user.click(save());
  expect(await screen.findByRole('alert')).toHaveTextContent('permission-denied');
  expect(screen.getByRole('radio', { name: 'c6' })).toBeChecked();
  expect(screen.queryByText('Lição concluída e salva!')).not.toBeInTheDocument();
  await user.click(save());
  expect(await screen.findByText('Lição concluída e salva!')).toBeInTheDocument();
});

it('não inicia gravação sem conexão', async () => {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
  const user = mount();
  await solve(user);
  await user.click(screen.getByRole('radio', { name: 'c6' }));
  await user.click(save());
  expect(screen.getByRole('alert')).toHaveTextContent('sem conexão');
  expect(runTransaction).not.toHaveBeenCalled();
});

it('reiniciar a prática remove a revisão e exige resolver de novo', async () => {
  const user = mount();
  await solve(user);
  await user.click(screen.getByRole('radio', { name: 'c6' }));
  await user.click(screen.getByRole('button', { name: 'Reiniciar exercício' }));
  expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /^h1,/ }));
  expect(screen.getByRole('radio', { name: 'c6' })).not.toBeChecked();
  expect(save()).toBeDisabled();
});
