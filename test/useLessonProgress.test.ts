import { act, renderHook } from '@testing-library/react';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { beforeEach, expect, it, vi } from 'vitest';
import { useLessonProgress } from '../src/components/hooks/useLessonProgress';

vi.mock('firebase/firestore', async original => ({
  ...await original<typeof import('firebase/firestore')>(),
  collection: vi.fn(() => 'collection'),
  onSnapshot: vi.fn(),
}));

type RecordData = { status?: string; completedAt?: unknown };
type Snapshot = { metadata: { fromCache: boolean; hasPendingWrites: boolean }; docs: { id: string; data: () => RecordData }[] };
let receive: (snapshot: Snapshot) => void;
let fail: (error: unknown) => void;
const unsubscribe = vi.fn();
beforeEach(() => {
  vi.mocked(onSnapshot).mockImplementation((...args: unknown[]) => {
    receive = args[2] as typeof receive;
    fail = args[3] as typeof fail;
    return unsubscribe;
  });
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
const snapshot = (fromCache = false, hasPendingWrites = false): Snapshot => ({
  metadata: { fromCache, hasPendingWrites },
  docs: [{ id: 'cavalo', data: () => ({ status: 'completed', completedAt: Timestamp.fromMillis(1000) }) }],
});

it('assina apenas o UID solicitado e aguarda confirmação do servidor', () => {
  const { result, unmount } = renderHook(() => useLessonProgress('aluno-1'));
  expect(collection).toHaveBeenCalledWith({}, 'users', 'aluno-1', 'lessonProgress');
  act(() => receive(snapshot(true)));
  expect(result.current.status).toBe('loading');
  act(() => receive(snapshot(false, true)));
  expect(result.current.status).toBe('loading');
  act(() => receive(snapshot()));
  expect(result.current.status).toBe('ready');
  expect([...result.current.completed]).toEqual(['cavalo']);
  unmount();
  expect(unsubscribe).toHaveBeenCalledOnce();
});

it('filtra documentos inválidos e IDs fora do catálogo', () => {
  const { result } = renderHook(() => useLessonProgress('aluno-1'));
  const data = snapshot();
  data.docs.push(
    { id: 'rei-roque', data: () => ({ status: 'completed', completedAt: 'ontem' }) },
    { id: 'desconhecida', data: () => ({ status: 'completed', completedAt: Timestamp.fromMillis(1000) }) },
    { id: 'mate-pastor', data: () => ({ status: 'started', completedAt: Timestamp.fromMillis(1000) }) },
  );
  act(() => receive(data));
  expect([...result.current.completed]).toEqual(['cavalo']);
});

it('limpa as conclusões da conta anterior quando o UID muda', () => {
  const { result, rerender } = renderHook(({ uid }) => useLessonProgress(uid), { initialProps: { uid: 'aluno-1' } });
  act(() => receive(snapshot()));
  rerender({ uid: 'aluno-2' });
  expect(unsubscribe).toHaveBeenCalledOnce();
  expect(collection).toHaveBeenLastCalledWith({}, 'users', 'aluno-2', 'lessonProgress');
  expect(result.current.status).toBe('loading');
  expect(result.current.completed.size).toBe(0);
  act(() => receive({ metadata: { fromCache: false, hasPendingWrites: false }, docs: [] }));
  expect(result.current.status).toBe('ready');
  expect(result.current.completed.size).toBe(0);
});

it('expõe erro e recria a consulta ao tentar novamente', () => {
  const { result } = renderHook(() => useLessonProgress('aluno-1'));
  act(() => fail({ code: 'permission-denied' }));
  expect(result.current.status).toBe('error');
  expect(result.current.error).toContain('permission-denied');
  act(() => result.current.retry());
  expect(result.current.status).toBe('loading');
  expect(unsubscribe).toHaveBeenCalledOnce();
  expect(onSnapshot).toHaveBeenCalledTimes(2);
  act(() => receive(snapshot()));
  expect(result.current.status).toBe('ready');
});
