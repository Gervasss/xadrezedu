import { test } from 'node:test';
import assert from 'node:assert/strict';
import { completedLessonIds, summarizeProgress } from '../src/data/lessonProgress.ts';

test('uma conta sem conclusões começa com progresso zero', () => {
  assert.deepEqual(summarizeProgress(['a', 'b'], completedLessonIds([], ['a', 'b'])), { completed: 0, total: 2, percent: 0 });
});

test('abrir ou iniciar uma lição não conta como conclusão', () => {
  const records = ['viewed', 'started', 'in_progress'].map((status) => ({ lessonId: 'a', status, completedAt: 1000 }));
  records.push({ lessonId: 'b', status: 'completed', completedAt: null });
  assert.equal(completedLessonIds(records, ['a', 'b']).size, 0);
});

test('conta apenas conclusões válidas, sem duplicar nem incluir lições desconhecidas', () => {
  const records = ['a', 'a', 'fora-da-grade'].map((lessonId) => ({ lessonId, status: 'completed', completedAt: 1000 }));
  const completed = completedLessonIds(records, ['a', 'b']);
  assert.deepEqual([...completed], ['a']);
  assert.deepEqual(summarizeProgress(['a', 'b'], completed), { completed: 1, total: 2, percent: 50 });
});

test('cada módulo usa suas próprias lições e só chega a 100% quando todas foram concluídas', () => {
  const completed = new Set(['a', 'b']);
  assert.equal(summarizeProgress(['a', 'b'], completed).percent, 100);
  assert.equal(summarizeProgress(['c', 'd'], completed).percent, 0);
  assert.equal(summarizeProgress([], completed).percent, 0);
});
