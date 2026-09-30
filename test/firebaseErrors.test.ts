import { FirebaseError } from 'firebase/app';
import { expect, it } from 'vitest';
import { authErrorMessage } from '../src/firebase/authErrors';
import { progressErrorMessage } from '../src/firebase/progressErrors';

it.each([
  ['auth/invalid-credential', 'E-mail ou senha incorretos'],
  ['auth/network-request-failed', 'conexão'],
  ['auth/unauthorized-domain', 'domínio'],
  ['auth/operation-not-allowed', 'não está habilitado'],
])('traduz %s', (code, message) => {
  expect(authErrorMessage(new FirebaseError(code, 'backend'))).toContain(message);
});

it('trata erros de autenticação desconhecidos', () => {
  expect(authErrorMessage(new Error('backend'))).toContain('Não foi possível');
  expect(authErrorMessage(new FirebaseError('auth/unknown', 'backend'))).toContain('Não foi possível');
});

it.each([
  ['permission-denied', 'não autorizou'],
  ['firestore/unauthenticated', 'sessão expirou'],
  ['not-found', 'não foi encontrado'],
  ['failed-precondition', 'não está pronto'],
  ['invalid-argument', 'recusou'],
  ['unavailable', 'conexão'],
  ['deadline-exceeded', 'demorou'],
  ['resource-exhausted', 'limite'],
])('expõe diagnóstico para %s', (code, message) => {
  expect(progressErrorMessage({ code })).toContain(message);
  expect(progressErrorMessage({ code })).toContain(code.replace('firestore/', ''));
});

it('trata erros sem código sem expor mensagens arbitrárias', () => {
  expect(progressErrorMessage(null)).toContain('Não foi possível');
  expect(progressErrorMessage({ code: 400, message: 'segredo' })).not.toContain('segredo');
});
