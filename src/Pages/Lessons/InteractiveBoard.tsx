import { useState } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import type { BoardExercise } from '../../types/lesson';
import { createExerciseGame, playCoordinateMove } from './chessExercises';

const glyphs = { w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' }, b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' } };
const pieceNames = { k: 'rei', q: 'dama', r: 'torre', b: 'bispo', n: 'cavalo', p: 'peão' };

// Renderiza o tabuleiro e controla a interação guiada de cada exercício.
export default function InteractiveBoard({ exercise, onComplete, onReset, disabled }: {
  exercise: BoardExercise;
  onComplete: () => void;
  onReset: () => void;
  disabled: boolean;
}) {
  const [game, setGame] = useState(() => createExerciseGame(exercise));
  const [selected, setSelected] = useState<Square | null>(null);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [hint, setHint] = useState(false);
  // Destinos são derivados da posição atual e usados tanto na validação quanto no destaque visual.
  const destinations = selected ? game.moves({ square: selected, verbose: true }).map((move) => move.to) : [];

  // Trata seleção de casas, valida lances e avança a sequência esperada.
  function clickSquare(square: Square) {
    if (done || disabled) return;
    // Exercícios de coordenadas pedem para localizar a casa, sem mover peças.
    if (exercise.target) {
      if (square === exercise.target) {
        setSelected(square);
        setDone(true);
        setFeedback(exercise.explanation);
        onComplete();
      } else setFeedback(`Você selecionou ${square}. Procure ${exercise.target}.`);
      return;
    }
    if (square === selected) { setSelected(null); return; }
    if (game.get(square)?.color === game.turn()) {
      setSelected(square);
      setFeedback('Agora selecione uma casa destacada para mover a peça.');
      return;
    }
    if (!selected) { setFeedback('Selecione primeiro uma peça do lado que joga.'); return; }
    const candidate = game.moves({ square: selected, verbose: true }).find((move) => move.to === square && (!move.promotion || move.promotion === 'q'));
    if (!candidate) { setFeedback('Esse lance não é legal. Use uma das casas destacadas.'); return; }
    const expected = exercise.steps?.[step];
    const coordinateMove = selected + square + (candidate.promotion ?? '');
    // Um lance legal só avança quando corresponde à sequência didática definida para o exercício.
    if (!expected || coordinateMove !== expected.move) {
      setFeedback('Esse lance é legal, mas não resolve a etapa proposta. Confira a instrução ou peça uma dica.');
      return;
    }
    const nextGame = new Chess(game.fen());
    const played = playCoordinateMove(nextGame, coordinateMove);
    // As respostas automáticas fazem parte do roteiro do exercício, não de uma IA adversária.
    const reply = expected.reply ? playCoordinateMove(nextGame, expected.reply) : null;
    const finished = step + 1 === exercise.steps?.length;
    setGame(nextGame);
    setStep(step + 1);
    setSelected(null);
    setDone(finished);
    setFeedback(`${played.san}${reply ? ` · Resposta: ${reply.san}` : ''}. ${finished ? exercise.explanation : 'Bom lance! Continue a sequência indicada.'}`);
    if (finished) onComplete();
  }

  // Restaura a posição inicial e limpa o estado da tentativa atual.
  function reset() {
    // Reinicia posição, sequência e feedback juntos para evitar resíduo da tentativa anterior.
    setGame(createExerciseGame(exercise));
    setSelected(null);
    setStep(0);
    setDone(false);
    setFeedback('Exercício reiniciado.');
    setHint(false);
    onReset();
  }

  return <div className="board-exercise">
    {/* Indica se o exercício terminou, se é de coordenadas ou de movimentação. */}
    <p className="board-turn">{done ? 'Exercício resolvido' : exercise.target ? 'Localize a casa' : `${game.turn() === 'w' ? 'Brancas' : 'Pretas'} jogam${game.isCheck() ? ' — rei em xeque' : ''}`}</p>
    {/* Cada casa é um botão acessível; destaques mostram a seleção e destinos legais. */}
    <div className="interactive-board" role="group" aria-label="Tabuleiro de xadrez. Brancas embaixo. Selecione a peça e depois o destino.">
      {game.board().flatMap((rank, row) => rank.map((piece, column) => {
        const square = `${'abcdefgh'[column]}${8 - row}` as Square;
        const legal = destinations.includes(square);
        return <button key={square} type="button" disabled={disabled || done}
          className={`board-square ${(row + column) % 2 ? 'dark' : 'light'} ${selected === square ? 'selected' : ''} ${legal ? 'legal' : ''}`}
          aria-label={`${square}${piece ? `, ${pieceNames[piece.type]} ${piece.color === 'w' ? 'branco' : 'preto'}` : ', vazia'}${legal ? ', destino legal' : ''}`}
          aria-pressed={selected === square} onClick={() => clickSquare(square)}>
          {column === 0 && <span className="rank-label" aria-hidden="true">{8 - row}</span>}
          {row === 7 && <span className="file-label" aria-hidden="true">{'abcdefgh'[column]}</span>}
          {piece && <span className={`chess-piece ${piece.color === 'w' ? 'white-piece' : 'black-piece'}`} aria-hidden="true">{glyphs[piece.color][piece.type]}</span>}
          {legal && !piece && <span className="move-dot" aria-hidden="true" />}
        </button>;
      }))}
    </div>
    <p className="board-help">Clique ou use Tab e Enter para selecionar uma peça e seu destino. As casas marcadas mostram os lances legais. Promoções usam dama neste treino.</p>
    {/* Dica, reinício e retorno da jogada ficam agrupados como ferramentas do tabuleiro. */}
    <div className="board-tools">
      <button type="button" onClick={() => setHint(!hint)} aria-expanded={hint}>{hint ? 'Ocultar dica' : 'Ver dica'}</button>
      <button type="button" onClick={reset} disabled={disabled}>Reiniciar exercício</button>
    </div>
    {hint && <p className="lesson-hint">{exercise.hint}</p>}
    <p className={`board-feedback ${done ? 'success' : ''}`} role="status">{feedback || 'O tabuleiro está pronto para você.'}</p>
  </div>;
}
