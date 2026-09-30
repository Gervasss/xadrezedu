import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import HomePage from '../src/Pages/HomePage/HomePage';
import { useLessonProgress } from '../src/components/hooks/useLessonProgress';
import { learningModules } from '../src/data/curriculum';
import { student } from './fixtures';

vi.mock('../src/components/hooks/useLessonProgress', () => ({ useLessonProgress: vi.fn() }));
vi.mock('../src/components/DashboardHeader/DashboardHeader', () => ({ default: () => <header>Cabeçalho</header> }));
const retry = vi.fn();
beforeEach(() => {
  vi.mocked(useLessonProgress).mockReturnValue({ uid: student.uid, status: 'ready', completed: new Set(), retry });
});
function mount() { render(<MemoryRouter><HomePage user={student} /></MemoryRouter>); }

it('mostra a trilha vazia e consulta o UID autenticado', () => {
  mount();
  expect(useLessonProgress).toHaveBeenCalledWith(student.uid);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Olá, Ana!');
  expect(screen.getByText('0/10')).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: 'Estudar' })).toHaveLength(10);
});

it('mostra conclusões e progresso de cada módulo', () => {
  vi.mocked(useLessonProgress).mockReturnValue({ uid: student.uid, status: 'ready', completed: new Set(['cavalo']), retry });
  mount();
  expect(screen.getByText('1/10')).toBeInTheDocument();
  expect(screen.getByText('10%')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Revisar' })).toHaveAttribute('href', '/licoes/cavalo');
  expect(screen.getAllByRole('progressbar')[0]).toHaveAttribute('value', '1');
  expect(screen.getAllByRole('progressbar')[1]).toHaveAttribute('value', '0');
});

it('celebra a conclusão de toda a trilha', () => {
  const completed = new Set(learningModules.flatMap(module => module.lessons.map(lesson => lesson.id)));
  vi.mocked(useLessonProgress).mockReturnValue({ uid: student.uid, status: 'ready', completed, retry });
  mount();
  expect(screen.getByText(/Você concluiu todas as lições/)).toBeInTheDocument();
  expect(screen.getByText('100%')).toBeInTheDocument();
});

it('não apresenta carregamento como progresso zero', () => {
  vi.mocked(useLessonProgress).mockReturnValue({ uid: student.uid, status: 'loading', completed: new Set(), retry });
  mount();
  expect(screen.getByText(/Buscando seu progresso/)).toBeInTheDocument();
  expect(screen.queryByText('0/10')).not.toBeInTheDocument();
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  expect(screen.getAllByText('Conclusão não verificada')).toHaveLength(10);
});

it('mostra o erro e oferece nova consulta', async () => {
  vi.mocked(useLessonProgress).mockReturnValue({ uid: student.uid, status: 'error', error: 'Permissão negada', completed: new Set(), retry });
  mount();
  expect(screen.getByRole('alert')).toHaveTextContent('Permissão negada');
  expect(screen.queryByText('0/10')).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  expect(retry).toHaveBeenCalledOnce();
});
