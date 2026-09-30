import type { User } from 'firebase/auth';

export const student = {
  uid: 'aluno-1',
  displayName: 'Ana Silva',
  email: 'ana@example.com',
} as User;

export function deferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((accept, fail) => { resolve = accept; reject = fail; });
  return { promise, resolve, reject };
}
