// Preserva o diagnóstico retornado pelo servidor sem expor credenciais ou dados do aluno.
export function progressErrorMessage(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
    ? error.code.replace(/^firestore\//, '') : '';
  const messages: Record<string, string> = {
    'permission-denied': 'O servidor não autorizou o acesso ao seu progresso. Confira as regras publicadas do Firestore.',
    unauthenticated: 'Sua sessão expirou. Entre novamente para salvar o progresso.',
    'not-found': 'O banco de dados do progresso não foi encontrado. Confira o projeto e o banco configurados no Firestore.',
    'failed-precondition': 'O Firestore não está pronto para esta operação. Confira a configuração do banco no console do Firebase.',
    'invalid-argument': 'O Firestore recusou a solicitação. Confira a configuração do banco e os dados enviados.',
    unavailable: 'Não foi possível acessar o Firestore. Verifique a conexão e tente novamente.',
    'deadline-exceeded': 'O servidor demorou para responder. Verifique a conexão e tente novamente.',
    'resource-exhausted': 'O limite de uso do Firestore foi atingido. Confira a cota do projeto.',
  };
  const message = messages[code] ?? 'Não foi possível acessar seu progresso. Verifique a conexão e tente novamente.';
  return code ? `${message} Código: ${code}.` : message;
}
