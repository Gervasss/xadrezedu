# XadrezEdu

Aplicação web (MVP), para a matéria de software Educativo, com objetivo de  aprender xadrez com explicações, exercícios interativos e acompanhamento individual de progresso. A trilha reúne dez lições em dois módulos, dos fundamentos do tabuleiro até uma partida guiada.

O frontend usa React e TypeScript. O Firebase Authentication gerencia as contas e o Cloud Firestore armazena as conclusões das lições.

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Executar localmente](#executar-localmente)
- [Configurar o Firebase](#configurar-o-firebase)
- [Trilha de aprendizagem](#trilha-de-aprendizagem)
- [Rotas](#rotas)
- [Conclusão e progresso individual](#conclusão-e-progresso-individual)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Design system](#design-system)
- [Comandos e validação](#comandos-e-validação)
- [Adicionar ou alterar lições](#adicionar-ou-alterar-lições)
- [Publicação](#publicação)
- [Solução de problemas](#solução-de-problemas)
- [Limitações atuais](#limitações-atuais)

## Funcionalidades

- Cadastro e login por e-mail e senha, login com Google e recuperação de senha.
- Escolha entre manter a sessão entre visitas ou somente durante a sessão do navegador.
- Formulários de entrada próprios para telas móveis e desktop.
- Dashboard com progresso geral, por módulo e por lição.
- Exercícios com tabuleiro interativo, dicas, reinício e revisão final.
- Validação de movimentos com chess.js, incluindo roque, promoção e en passant nas atividades previstas.
- Tabuleiro operável por clique ou Tab e Enter, com destaque dos destinos legais.
- Gravação da conclusão por usuário e revisão de lições já concluídas.
- Mensagens de erro para autenticação, consulta e gravação do progresso.

## Tecnologias

Versões declaradas no [package.json](package.json). As versões resolvidas estão no [package-lock.json](package-lock.json).

| Tecnologia | Versão declarada | Uso |
| --- | --- | --- |
| React / React DOM | ^19.2.8 | Interface e estado dos componentes |
| TypeScript | ~6.0.2 | Tipagem e verificação do código |
| Vite | ^8.3.0 | Desenvolvimento e build |
| React Router DOM | ^7.18.4 | Rotas e navegação |
| Firebase | ^12.19.0 | Authentication, Firestore e Analytics |
| chess.js | ^1.4.0 | Regras e validação dos lances |
| ESLint | ^10.10.0 | Análise estática |
| Vitest / Coverage V8 | ^5.0.3 | Execução de testes e relatório de cobertura |
| React Testing Library / user-event | ^16.3.3 / ^14.6.7 | Renderização e interações nos testes |
| jsdom | ^30.1.1 | Ambiente DOM para os testes |

## Executar localmente

Use Node.js 24 e npm para reproduzir o ambiente de testes documentado no projeto. Também é necessário um projeto Firebase com aplicação web cadastrada.

1. Abra um terminal na pasta do repositório.
2. Instale as dependências.
3. Copie o modelo de variáveis para `.env`.
4. Preencha a configuração do Firebase conforme a próxima seção.
5. Inicie o servidor de desenvolvimento.

No PowerShell:

```powershell
npm ci
Copy-Item .env.example .env
# Preencha o arquivo .env antes de iniciar.
npm run dev
```

No Linux/macOS, substitua o comando de cópia por:

```sh
cp .env.example .env
```

Abra o endereço informado pelo Vite no terminal. Reinicie o servidor após alterar variáveis de ambiente. O arquivo `.env` é ignorado pelo Git.

## Configurar o Firebase

### Variáveis de ambiente

A inicialização está em [firebase.ts](src/firebase/firebase.ts). Use os valores da configuração da aplicação web cadastrada no seu projeto Firebase.

| Variável | Finalidade |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Chave da configuração web do Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação |
| `VITE_FIREBASE_PROJECT_ID` | Identificador do projeto |
| `VITE_FIREBASE_DATABASE_ID` | ID do Cloud Firestore; vazio usa `(default)` |
| `VITE_FIREBASE_DATABASE_URL` | URL do Realtime Database; não seleciona o Firestore nem é usada para salvar o progresso |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket da configuração web; não há upload implementado |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Identificador da configuração web; não há notificações implementadas |
| `VITE_FIREBASE_APP_ID` | Identificador da aplicação web |
| `VITE_FIREBASE_MEASUREMENT_ID` | Identificador do Analytics, quando configurado |

O Analytics é inicializado quando o ambiente oferece suporte. Uma falha nessa inicialização não deve impedir a autenticação.

Variáveis com prefixo `VITE_` fazem parte do frontend compilado. Não coloque chaves privadas ou credenciais de conta de serviço nelas. A proteção dos dados depende da autenticação e das regras do Firestore.

### Authentication

No projeto Firebase utilizado pelo frontend:

1. Habilite o provedor de e-mail e senha.
2. Habilite o provedor Google para disponibilizar o login por popup.
3. Confira os domínios autorizados para desenvolvimento local e produção.

O hook [useLoginForm.ts](src/components/hooks/useLoginForm.ts) centraliza cadastro, login, redefinição de senha e persistência da sessão. O nome informado no cadastro é salvo no perfil do Firebase Authentication.

### Cloud Firestore

Crie ou utilize um banco Cloud Firestore no mesmo projeto configurado no frontend. Por padrão, o banco acessado é `(default)`. Para utilizar um banco nomeado, preencha `VITE_FIREBASE_DATABASE_ID` e ajuste também o destino das regras em `firebase.json`.

Os arquivos [.firebaserc](.firebaserc) e [firebase.json](firebase.json) apontam atualmente para o projeto `xadrezedu-3b496` e o banco `(default)`. Ajuste esses destinos se utilizar outro ambiente.

### Regras e publicação

O arquivo [firestore.rules](firestore.rules) define o acesso a `users/{uid}/lessonProgress/{lessonId}`:

- Leitura permitida apenas ao usuário autenticado dono do caminho.
- Criação condicionada ao dono, ao ID da lição e ao formato esperado.
- Timestamp de conclusão validado contra o horário da requisição.
- Atualização permitida apenas quando o status anterior é diferente de `completed` e a nova conclusão é válida.
- Exclusão negada.

**Ter as regras no repositório não publica as permissões no servidor.** Confira as regras efetivamente publicadas no banco acessado pelo frontend.

Para publicar por CLI, tenha o Firebase CLI instalado e acesso ao projeto. Revise e integre primeiro as regras de outras funcionalidades já existentes no servidor:

```sh
firebase login
firebase deploy --only firestore:rules --project xadrezedu-3b496
```

Esse comando publica as regras locais no destino configurado. O arquivo atual cobre somente o progresso das lições; preserve as regras de outras coleções antes da publicação. A presença dos arquivos locais não comprova que as regras remotas estejam atualizadas.

## Trilha de aprendizagem

O catálogo está em [curriculum.ts](src/data/curriculum.ts). Textos, posições, soluções e perguntas estão em [lessonContent.ts](src/Pages/Lessons/lessonContent.ts).

| Módulo | ID | Lição |
| --- | --- | --- |
| Fundamentos | `tabuleiro-coordenadas` | O tabuleiro e as coordenadas |
| Fundamentos | `peao-promocao` | O peão e a promoção |
| Fundamentos | `cavalo` | O cavalo e seu movimento |
| Fundamentos | `dama-torres-bispos` | A dama, as torres e os bispos |
| Fundamentos | `rei-roque` | O rei e o roque |
| Táticas | `xeque-defesas` | O xeque e como responder |
| Táticas | `mate-pastor` | O mate do pastor e como se defender |
| Táticas | `cravada-garfo` | Cravada e garfo |
| Táticas | `trocas-material` | Trocas favoráveis e contagem de material |
| Táticas | `partida-guiada` | Partida guiada |

## Rotas

Definidas em [AppRouter.tsx](src/Routes/AppRouter.tsx).

| Caminho | Comportamento |
| --- | --- |
| `/` | Página de entrada e cadastro |
| `/login` | Redireciona para `/` |
| `/inicio` | Dashboard; exige autenticação |
| `/licoes/:lessonId` | Conteúdo e exercícios; exige autenticação |
| Demais caminhos | Redirecionam para `/` |

O roteador aguarda `onAuthStateChanged` antes de montar as rotas. Sem sessão, as rotas privadas redirecionam para a entrada. Um ID desconhecido em uma rota de lição apresenta uma mensagem de lição não encontrada.

## Conclusão e progresso individual

### Fluxo de conclusão

1. O aluno resolve os exercícios em ordem.
2. Acerta a pergunta de revisão.
3. Clica em **Concluir e salvar lição**.
4. A aplicação executa uma transação no Firestore.
5. A confirmação aparece somente após o sucesso da transação.

Abrir uma lição ou resolver apenas parte dos exercícios não grava uma conclusão. A transação lê o documento antes de gravar. Se ele já tem status `completed` e timestamp válido, mantém a data original.

Em caso de falha, os exercícios continuam resolvidos enquanto a tela estiver aberta, permitindo tentar salvar novamente. Sair ou recarregar antes de salvar descarta a tentativa local. Reiniciar o exercício atual limpa sua conclusão local e a resposta da revisão.

### Separação por usuário

Cada conclusão fica no caminho:

```text
users/{uid}/lessonProgress/{lessonId}
```

O `uid` é o identificador do Firebase Authentication. Duas contas que concluem a mesma lição gravam documentos em caminhos diferentes.

Na gravação, [LessonPage.tsx](src/Pages/Lessons/LessonPage.tsx) utiliza:

```ts
doc(db, 'users', user.uid, 'lessonProgress', lessonId)
```

Na consulta, [useLessonProgress.ts](src/components/hooks/useLessonProgress.ts) assina somente a subcoleção daquele usuário:

```ts
collection(db, 'users', uid, 'lessonProgress')
```

As regras verificam se o usuário autenticado é o dono do caminho:

```js
function ownsProgress() {
  return request.auth != null && request.auth.uid == uid;
}
```

Quando publicadas, essas regras protegem o acesso no servidor, inclusive para requisições feitas fora da interface.

### Documento salvo

| Campo | Valor ou tipo |
| --- | --- |
| `status` | `"completed"` |
| `completedAt` | Timestamp do servidor, gerado com `serverTimestamp()` |
| `exerciseCount` | Quantidade de exercícios da lição |
| `reviewCorrect` | `true` |
| `contentVersion` | `1` |

O UID e o ID da lição fazem parte do caminho e não são repetidos nos campos.

### Indicadores do dashboard

O hook de progresso usa `onSnapshot` com mudanças de metadados habilitadas. Resultados apenas do cache ou com escritas pendentes não são apresentados como confirmação do servidor.

As funções em [lessonProgress.ts](src/data/lessonProgress.ts) contam somente IDs conhecidos, com status concluído e timestamp válido. O percentual é arredondado para um inteiro e calculado para a trilha inteira e para cada módulo. Carregamento e erro têm estados próprios; uma consulta que falhou não é apresentada como zero conclusões.

## Estrutura do projeto

```text
src/
  assets/                       Imagens da interface
  components/
    DashboardHeader/            Navegação e ações da conta
    hooks/                      Autenticação e consulta do progresso
    LoginPageDesktop/           Formulário para desktop
    LoginPageMobile/            Formulário para telas móveis
  data/
    curriculum.ts               Catálogo de módulos e lições
    lessonProgress.ts           Validação e resumo do progresso
  firebase/
    firebase.ts                 Inicialização dos serviços
    authErrors.ts               Mensagens de autenticação
    progressErrors.ts           Mensagens de erro do progresso
  Pages/
    HomePage/                   Dashboard
    Lessons/
      LessonPage.tsx            Fluxo e gravação da conclusão
      InteractiveBoard.tsx      Interação com o tabuleiro
      chessExercises.ts         Posições e execução dos lances
      lessonContent.ts          Textos, exercícios e revisão
    LoginPage/                  Seleção do formulário por viewport
  Routes/AppRouter.tsx          Rotas e controle da sessão
  types/lesson.ts               Tipos de conteúdo e progresso
  App.tsx                       Componente raiz
  main.tsx                      Entrada do frontend
test/                           Testes de componentes, hooks e regras de domínio
vitest.config.ts                Ambiente de testes e configuração de cobertura
public/                         Arquivos públicos
docs/progresso.md               Notas sobre lições e persistência
.env.example                    Modelo das variáveis de ambiente
.firebaserc                     Projeto Firebase usado pela CLI
firebase.json                   Configuração de publicação das regras
firestore.rules                 Regras de acesso ao progresso
```

## Design system

O arquivo [src/App.css](src/App.css), importado por `App.tsx`, concentra o tema e as primitivas visuais compartilhadas. Os estilos locais consomem suas variáveis CSS; não precisam redefinir a paleta em cada tela.

| Grupo | Variáveis principais |
| --- | --- |
| Marca | `--primary`, `--primary-container`, `--on-primary`, `--secondary` |
| Superfícies e texto | `--surface`, `--surface-container-lowest`, `--on-surface`, `--muted`, `--border` |
| Tipografia | `--font-brand`, `--font-system`, `--font-lesson`, `--text-base`, `--text-lg`, `--weight-bold` |
| Espaçamentos | `--space-1` até `--space-12` |
| Bordas e dimensões | `--radius-sm`, `--radius-md`, `--radius-lg`, `--container-wide`, `--header-height` |
| Estados | `--color-error`, `--color-success`, `--color-focus`, `--opacity-disabled` |
| Sombras e movimento | `--shadow-card`, `--shadow-button`, `--duration-fast`, `--duration-normal` |
| Tabuleiro | `--board-light`, `--board-dark`, `--board-selected`, `--board-legal` |

Para mudar a cor principal, edite `--primary` no `:root` de `App.css`. Os botões, links e controles que usam esse token recebem a mudança. Ajuste também as variantes de marca, como `--primary-container` e `--primary-shadow`, quando mudar toda a paleta.

`App.css` também compartilha a base dos botões de ação, mensagens de estado e controles dos formulários desktop/mobile. Os arquivos CSS de cada componente mantêm layout, posicionamento, breakpoints e diferenças específicas da tela. `index.css` contém somente a estrutura mínima do documento.

Em novos estilos, prefira os tokens existentes:

```css
.novo-card {
  padding: var(--space-6);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-container-lowest);
  color: var(--on-surface);
  box-shadow: var(--shadow-card);
}
```

## Comandos e validação

| Comando | Finalidade |
| --- | --- |
| `npm ci` | Instala dependências conforme o lockfile |
| `npm run dev` | Inicia o desenvolvimento |
| `npm run build` | Verifica TypeScript e gera `dist/` |
| `npm run preview` | Serve o build para inspeção local |
| `npm run lint` | Executa o ESLint |
| `npm test` | Executa toda a suíte uma vez |
| `npm run test:watch` | Reexecuta testes durante o desenvolvimento |
| `npm run test:coverage` | Executa a suíte e gera relatórios de cobertura |

Para executar os testes com Node.js 24:

```sh
npm test
npm run test:coverage
```

O Vitest usa React Testing Library, user-event, jest-dom e jsdom. A configuração compartilha os plugins do Vite e executa os arquivos `test/**/*.test.{ts,tsx,mjs}`. Os testes de domínio existentes também foram migrados para o Vitest.

### Organização dos testes

| Arquivo em `test/` | Comportamentos verificados |
| --- | --- |
| `App.test.tsx` | Integração do componente raiz com roteador e login |
| `AppRouter.test.tsx` | Carregamento da sessão, rotas protegidas, redirecionamentos, logout e erro |
| `LoginPage.test.tsx` | Seleção mobile/desktop, mudança de viewport e limpeza da assinatura |
| `LoginForms.test.tsx` | Ambos os formulários reais: login, cadastro, Google, recuperação, persistência, senha, erros e bloqueio de envios duplicados |
| `DashboardHeader.test.tsx` | Conta, navegação, menu, foco, logout, falha e nova tentativa |
| `HomePage.test.tsx` | Progresso vazio, parcial e completo; carregamento, erro e repetição |
| `InteractiveBoard.test.tsx` | Coordenadas, movimentos, respostas guiadas, promoção, teclado, dicas, reinício e bloqueio |
| `LessonPage.test.tsx` | Resolução e revisão reais, conclusão por UID, confirmação do servidor, preservação da data, falha de permissão e modo sem conexão |
| `useLessonProgress.test.ts` | Assinatura por UID, troca de conta, metadados, filtragem, erros e limpeza |
| `firebaseErrors.test.ts` | Tradução de erros de autenticação e progresso |
| `chessLessons.test.mjs` | Soluções das lições, mates, roque, promoção e en passant |
| `lessonProgress.test.mjs` | Filtragem e cálculos de progresso |

Todos os componentes React possuem testes. O componente interno `Lesson` é exercitado pela página `LessonPage`, e o hook `useLoginForm` é exercitado pelos dois formulários reais.

O arquivo `test/setup.ts` limpa o DOM entre os testes e substitui a inicialização do Firebase. Os testes simulam as operações do SDK sem utilizar credenciais do `.env` ou gravar no projeto remoto. Eles não validam autenticação real nem regras no emulador.

### Cobertura e manutenção

`npm run test:coverage` gera o relatório HTML em `coverage/index.html` e o arquivo `coverage/lcov.info`. O diretório é ignorado pelo Git. A configuração exige no mínimo 90% de cobertura global em linhas, instruções, funções e ramificações.

O relatório inclui o código de `src/`, exceto a entrada `main.tsx`, os tipos e a inicialização externa em `src/firebase/firebase.ts`. Essa exclusão não retira componentes da medição. Os arquivos TypeScript de teste também são verificados pelo build e pelo lint.

Para executar somente uma suíte:

```sh
npm test -- test/LessonPage.test.tsx
```

Ao adicionar um componente, crie um teste que verifique seus comportamentos observáveis e cenários de falha relevantes. Prefira consultas por papel e nome acessível, usando `user-event` para interações.

Para verificar a integração, entre em uma conta, resolva uma lição, salve e recarregue o dashboard. Confira a persistência e, em outra conta, a independência dos indicadores. Esse teste exige Firebase configurado e acessível.

## Adicionar ou alterar lições

1. Adicione um ID único e título ao módulo em `src/data/curriculum.ts`.
2. Crie o conteúdo com o mesmo ID em `src/Pages/Lessons/lessonContent.ts`, seguindo os tipos de `src/types/lesson.ts`.
3. Configure a posição inicial por `fen` ou os lances de preparação em `setup`, quando necessário.
4. Use `target` para localizar casas ou `steps` para sequências de movimentos. Os lances usam coordenadas como `e2e4` e `a7a8q`; `reply` define uma resposta guiada opcional.
5. Preencha a revisão e o índice da alternativa correta em `correctAnswer`.
6. Atualize o mapa de IDs e quantidades de exercícios em `firestore.rules` e publique as regras revisadas.
7. Execute testes, build e lint antes da publicação.

A ordem do catálogo determina a sugestão de próxima lição. Alterar IDs afeta o reconhecimento das conclusões existentes. Planeje a compatibilidade dos dados antes dessa mudança. A versão de conteúdo gravada atualmente é fixa em `1`.

## Publicação

Configure as variáveis `VITE_FIREBASE_*` no ambiente de build:

```sh
npm ci
npm run build
```

Publique o conteúdo de `dist/` na hospedagem escolhida. Como a aplicação usa `BrowserRouter`, configure o serviço para entregar `index.html` nos acessos às rotas da aplicação, incluindo `/inicio` e `/licoes/:lessonId`.

Adicione o domínio de produção aos domínios autorizados da autenticação. Alterações nas variáveis de ambiente exigem um novo build.

O `firebase.json` atual configura somente as regras do Firestore. Não há configuração de Firebase Hosting neste repositório. Publicar o frontend e publicar as regras são operações separadas.

## Solução de problemas

### Erro 403 em documents:batchGet

Essa requisição realiza a leitura da transação antes de salvar a conclusão. Um bloqueio nela impede a gravação, mesmo que a escrita esteja permitida.

Em **Rede/Network** no navegador, abra a requisição e consulte **Resposta/Response**. O status 403 sozinho não identifica a causa.

| Mensagem ou situação | Verificação |
| --- | --- |
| `Missing or insufficient permissions` / `permission-denied` | Sessão, UID do caminho e regras publicadas no projeto e banco corretos |
| Resposta indicando API desabilitada ou restrição de chave | Configuração da API e restrições da chave no projeto |
| Resposta indicando App Check | Configuração de App Check; o frontend atual não o inicializa |
| Regras locais corretas, mas acesso negado | Se as mesmas regras foram publicadas no banco acessado |

A transação precisa de leitura e criação autorizadas no caminho do próprio aluno. Preserve o isolamento entre usuários ao corrigir as permissões.

### Erro 400 ou falha genérica ao salvar

Confira o corpo da resposta e o erro no console. A interface apresenta códigos conhecidos por meio de `progressErrors.ts`. Verifique o projeto e o ID do Firestore; `VITE_FIREBASE_DATABASE_URL` não substitui `VITE_FIREBASE_DATABASE_ID`.

### Progresso permanece carregando

O dashboard aguarda confirmação do servidor. Confira a conexão e as requisições ao Firestore. Uma resposta apenas do cache não confirma os indicadores.

### Login com Google falha

Confira o provedor habilitado, o domínio autorizado e a permissão de popup no navegador. A interface traduz os códigos conhecidos de autenticação para português.

### PowerShell bloqueia npm.ps1

Utilize o executável `.cmd` quando a política de execução bloquear o script do npm:

```powershell
npm.cmd ci
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
```

### Recarregar uma rota publicada retorna 404

Configure o fallback da hospedagem para `index.html`, preservando o atendimento aos arquivos estáticos existentes.

## Limitações atuais

- As atividades seguem soluções didáticas predefinidas. As respostas automáticas são roteiros, e não um adversário de inteligência artificial.
- Promoções nos exercícios utilizam dama.
- Apenas a conclusão da lição é persistida; tentativas parciais ficam no estado da tela.
- As respostas são avaliadas no cliente. As regras validam dono e formato dos dados, mas não comprovam a resolução dos exercícios. Certificações com prevenção de fraude exigiriam validação confiável no servidor.
- Os testes existentes não substituem a validação das permissões e do fluxo real no Firebase.

Mais detalhes em [docs/progresso.md](docs/progresso.md).
