import { FirebaseError } from 'firebase/app';

// Traduz códigos conhecidos do Firebase Auth para mensagens compreensíveis na interface.
export function authErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) return 'Não foi possível concluir a operação. Tente novamente.';
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/wrong-password': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'E-mail ou senha incorretos.',
    'auth/invalid-email': 'Informe um e-mail válido.',
    'auth/email-already-in-use': 'Este e-mail já está cadastrado. Entre ou recupere sua senha.',
    'auth/weak-password': 'Use uma senha com pelo menos 6 caracteres.',
    'auth/password-does-not-meet-requirements': 'A senha não atende à política de segurança do projeto.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
    'auth/network-request-failed': 'Verifique sua conexão e tente novamente.',
    'auth/popup-closed-by-user': 'O login com Google foi cancelado. Tente novamente.',
    'auth/cancelled-popup-request': 'Uma tentativa de login já está em andamento.',
    'auth/popup-blocked': 'Permita pop-ups neste site para entrar com Google.',
    'auth/account-exists-with-different-credential': 'Entre usando o método originalmente associado a este e-mail.',
    'auth/operation-not-allowed': 'Este método de login ainda não está habilitado no Firebase.',
    'auth/unauthorized-domain': 'Este domínio ainda não está autorizado no Firebase.',
    'auth/user-disabled': 'Esta conta foi desativada. Entre em contato com o suporte.',
  };
  return messages[error.code] ?? 'Não foi possível concluir a operação. Tente novamente.';
}
