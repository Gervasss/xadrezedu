import { test } from 'vitest';
import assert from 'node:assert/strict';
import { lessonContent } from '../src/Pages/Lessons/lessonContent.ts';
import { createExerciseGame, playCoordinateMove } from '../src/Pages/Lessons/chessExercises.ts';
import { learningModules } from '../src/data/curriculum.ts';

for (const module of learningModules) {
  for (const lesson of module.lessons) {
    test(`${lesson.id}: todos os exercícios têm soluções legais`, () => {
      const content = lessonContent[lesson.id];
      assert.ok(content);
      assert.ok(content.exercises.length >= 2);
      assert.ok(content.answers[content.correctAnswer]);
      for (const exercise of content.exercises) {
        const game = createExerciseGame(exercise);
        if (exercise.target) assert.match(exercise.target, /^[a-h][1-8]$/);
        else {
          assert.ok(exercise.steps.length > 0);
          for (const step of exercise.steps) {
            assert.ok(playCoordinateMove(game, step.move));
            if (step.reply) assert.ok(playCoordinateMove(game, step.reply));
          }
        }
      }
    });
  }
}

test('as duas posições de mate terminam realmente em xeque-mate', () => {
  for (const exercise of [lessonContent['mate-pastor'].exercises[0], lessonContent['partida-guiada'].exercises[1]]) {
    const game = createExerciseGame(exercise);
    for (const step of exercise.steps) {
      playCoordinateMove(game, step.move);
      if (step.reply) playCoordinateMove(game, step.reply);
    }
    assert.ok(game.isCheckmate());
  }
});

test('roque, promoção e en passant atualizam corretamente as peças', () => {
  const castle = createExerciseGame(lessonContent['rei-roque'].exercises[0]);
  playCoordinateMove(castle, 'e1g1');
  assert.equal(castle.get('g1').type, 'k');
  assert.equal(castle.get('f1').type, 'r');
  const promotion = createExerciseGame(lessonContent['peao-promocao'].exercises[1]);
  playCoordinateMove(promotion, 'a7a8q');
  assert.equal(promotion.get('a8').type, 'q');
  const enPassant = createExerciseGame(lessonContent['peao-promocao'].exercises[2]);
  playCoordinateMove(enPassant, 'e5d6');
  assert.equal(enPassant.get('d5'), undefined);
  assert.equal(enPassant.get('d6').color, 'w');
});
