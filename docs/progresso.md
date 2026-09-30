# Lições e progresso

As dez lições são acessadas por `/licoes/:lessonId`, com sessão autenticada. O catálogo fica em `src/data/curriculum.ts`; textos, perguntas e exercícios ficam em `src/Pages/Lessons/lessonContent.ts`. A página e o tabuleiro ficam no mesmo diretório `Pages/Lessons`.

O tabuleiro usa chess.js para validar movimentos. As atividades são guiadas, com respostas predefinidas, e não partidas contra uma IA. A promoção usa dama. Há seleção por clique e por teclado (Tab/Enter), destinos legais destacados, dicas e reinício do exercício.

## Quando uma lição é concluída

O aluno deve resolver todos os exercícios em ordem, acertar a pergunta de revisão e clicar em concluir. Abrir uma aula ou mover uma peça sem resolver a atividade não grava progresso. Reiniciar o exercício atual retira sua conclusão local e limpa a resposta da revisão.

A página grava uma transação em `users/{uid}/lessonProgress/{lessonId}` com:

- `status: "completed"`;
- `completedAt`: timestamp do servidor;
- `exerciseCount`: quantidade de exercícios resolvidos;
- `reviewCorrect: true`;
- `contentVersion: 1`.

Uma lição já concluída pode ser revisada sem alterar a data original. A interface só confirma que salvou quando a transação termina. Em caso de falha, mantém os exercícios resolvidos na tela para tentar novamente. Sair antes de salvar descarta a tentativa local.

O dashboard conta apenas IDs do catálogo com status concluído e timestamp válido, confirmados pelo Firestore. Leituras pendentes e erros não são apresentados como zero conclusões.

## Firebase

O arquivo `firestore.rules` contém regras locais para permitir que cada usuário leia e grave somente o próprio progresso. Elas validam o formato, o ID da lição, a versão e o timestamp. Não foram publicadas nem validadas no emulador nesta alteração. Integre esse bloco às regras existentes no console do projeto; não substitua regras de outras funcionalidades inadvertidamente.

Os exercícios são avaliados no cliente. As regras protegem o isolamento entre contas, mas não comprovam no servidor que o aluno resolveu a atividade: um cliente modificado poderia enviar uma conclusão válida no formato. Para certificação ou avaliações que exijam prevenção de fraude, a avaliação precisa ser feita por um backend confiável.

## Validação local

## Publicação das regras e erro 403

O projeto agora inclui `firebase.json` e `.firebaserc` para o projeto `xadrezedu-3b496`, banco `(default)`. Arquivos locais não alteram permissões remotas automaticamente.

Se a resposta da requisição `batchGet` informa `Missing or insufficient permissions`, confira as regras publicadas em Firestore Database → Rules. A transação precisa ler e criar o documento `users/{uid}/lessonProgress/{lessonId}`; permitir somente escrita não é suficiente. O `uid` deve ser o usuário autenticado.

Integre as regras deste repositório às regras remotas existentes. Para publicar via CLI, após instalar Firebase CLI e autenticar com uma conta autorizada, use `firebase deploy --only firestore:rules --project xadrezedu-3b496`. Esse comando substitui as regras remotas pelo arquivo configurado: preserve regras de outras coleções antes de executar.

Se a mensagem do 403 indicar API desabilitada, chave restrita ou App Check, corrigir somente as regras não resolverá; use a mensagem completa da resposta para identificar a configuração responsável. Nunca libere leitura e escrita públicas para contornar o erro.

Referência: https://firebase.google.com/docs/rules/manage-deploy

## Testes

Com Node.js 24:

`npm test`

Os testes usam Vitest e ficam em `test/`. Além das sequências, mates, roque, promoção, en passant e cálculos de progresso, cobrem todos os componentes React, os formulários com o hook de autenticação e a assinatura do progresso por usuário. As operações Firebase são simuladas; a suíte não valida as regras remotas. Use `npm run test:coverage` para gerar o relatório, `npm run test:watch` durante o desenvolvimento e execute também `npm run build` e `npm run lint`.
