import type { LessonRecord, ProgressSummary } from '../types/lesson';

// Retorna somente conclusões válidas pertencentes às lições conhecidas pelo catálogo.
export function completedLessonIds(records: LessonRecord[], knownIds: string[]): Set<string> {
  const known = new Set(knownIds);
  return new Set(records.filter((record) =>
    known.has(record.lessonId) && record.status === 'completed' &&
    record.completedAt !== null && Number.isFinite(record.completedAt) && record.completedAt > 0,
  ).map((record) => record.lessonId));
}

// Resume IDs únicos em contagem concluída, total e percentual.
export function summarizeProgress(lessonIds: string[], completed: Set<string>): ProgressSummary {
  const uniqueIds = [...new Set(lessonIds)];
  const count = uniqueIds.filter((id) => completed.has(id)).length;
  return {
    completed: count,
    total: uniqueIds.length,
    percent: uniqueIds.length ? Math.round(count / uniqueIds.length * 100) : 0,
  };
}
