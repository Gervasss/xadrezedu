import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import InteractiveBoard from '../src/Pages/Lessons/InteractiveBoard';
import { lessonContent } from '../src/Pages/Lessons/lessonContent';
import type { BoardExercise } from '../src/types/lesson';

function mount(exercise: BoardExercise, disabled = false) {
  const onComplete = vi.fn(), onReset = vi.fn();
  render(<InteractiveBoard exercise={exercise} disabled={disabled} onComplete={onComplete} onReset={onReset} />);
  return { user: userEvent.setup(), onComplete, onReset };
}
const square = (name: string) => screen.getByRole('button', { name: new RegExp('^' + name + ',') });

it('valida coordenadas, mostra dica e reinicia', async () => {
  const exercise = lessonContent['tabuleiro-coordenadas'].exercises[0];
  const { user, onComplete, onReset } = mount(exercise);
  await user.click(square('d4'));
  expect(screen.getByRole('status')).toHaveTextContent('Procure e4');
  expect(onComplete).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Ver dica' }));
  expect(screen.getByText(exercise.hint)).toBeInTheDocument();
  await user.click(square('e4'));
  expect(onComplete).toHaveBeenCalledOnce();
  expect(square('e4')).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Reiniciar exercício' }));
  expect(onReset).toHaveBeenCalledOnce();
  expect(square('e4')).toBeEnabled();
  expect(screen.queryByText(exercise.hint)).not.toBeInTheDocument();
});

it('rejeita lances ilegais e lances legais fora da solução', async () => {
  const { user, onComplete } = mount(lessonContent.cavalo.exercises[0]);
  await user.click(square('e4'));
  expect(screen.getByRole('status')).toHaveTextContent('Selecione primeiro');
  await user.click(square('g1'));
  expect(square('f3')).toHaveAccessibleName(/destino legal/);
  await user.click(square('g4'));
  expect(screen.getByRole('status')).toHaveTextContent('não é legal');
  await user.click(square('h3'));
  expect(screen.getByRole('status')).toHaveTextContent('não resolve a etapa');
  expect(onComplete).not.toHaveBeenCalled();
  await user.click(square('f3'));
  expect(square('f3')).toHaveAccessibleName(/cavalo branco/);
  expect(onComplete).toHaveBeenCalledOnce();
});

it('executa respostas guiadas e conclui somente após a última etapa', async () => {
  const { user, onComplete } = mount(lessonContent['peao-promocao'].exercises[0]);
  await user.click(square('e2'));
  await user.click(square('e4'));
  expect(square('a6')).toHaveAccessibleName(/peão preto/);
  expect(onComplete).not.toHaveBeenCalled();
  await user.click(square('e4'));
  await user.click(square('e5'));
  expect(onComplete).toHaveBeenCalledOnce();
});

it('promove automaticamente para dama', async () => {
  const { user, onComplete } = mount(lessonContent['peao-promocao'].exercises[1]);
  await user.click(square('a7'));
  await user.click(square('a8'));
  expect(square('a8')).toHaveAccessibleName(/dama branco/);
  expect(onComplete).toHaveBeenCalledOnce();
});

it('permite resolver pelo teclado', async () => {
  const { user, onComplete } = mount(lessonContent['tabuleiro-coordenadas'].exercises[0]);
  square('e4').focus();
  await user.keyboard('{Enter}');
  expect(onComplete).toHaveBeenCalledOnce();
});

it('bloqueia tabuleiro e reinício quando desabilitado', async () => {
  const { user, onComplete, onReset } = mount(lessonContent['tabuleiro-coordenadas'].exercises[0], true);
  await user.click(square('e4'));
  expect(square('e4')).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Reiniciar exercício' })).toBeDisabled();
  expect(onComplete).not.toHaveBeenCalled();
  expect(onReset).not.toHaveBeenCalled();
});
