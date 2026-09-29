import { Chess } from 'chess.js';
import type { BoardExercise } from '../../types/lesson';

// Cria a posição inicial do exercício e aplica os lances de preparação configurados.
export function createExerciseGame(exercise: BoardExercise) {
  // Começa da posição FEN opcional e aplica lances de preparação antes da vez do aluno.
  const game = new Chess(exercise.fen);
  for (const move of exercise.setup ?? []) game.move(move);
  return game;
}

// Executa um lance no formato de coordenadas usado pela sequência do exercício.
export function playCoordinateMove(game: Chess, move: string) {
  // Converte a notação de coordenadas (ex.: e2e4 ou a7a8q) para o formato aceito por chess.js.
  return game.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: move[4] });
}
