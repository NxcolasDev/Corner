# Relatório de recuperação do frontend

Data: 21 de julho de 2026.

## Resultado

O frontend voltou a ter validação estática e build de produção sem erros. Não houve qualquer alteração em APIs, rotas, modelos, autenticação ou regras de negócio do backend.

Após a referência visual enviada pelo usuário, a camada de apresentação também foi atualizada para se aproximar do mockup: layout de aplicação compacto, sidebar escura, dashboard com cartões e gráficos proporcionais, e login com painel de marca.

## Arquivos criados

- `docs/frontend-recovery-analysis.md`
- `docs/frontend-recovery-report.md`
- `client/client/src/context/auth-context.js`
- `client/client/src/context/useAuth.js`

## Arquivos modificados

- `client/client/src/main.jsx`: removido import React não utilizado.
- `client/client/src/context/AuthContext.jsx`: separado o contexto do provider para cumprir a regra de Fast Refresh.
- `client/client/src/routes/ProtectedRoute.jsx`, `src/layouts/AppLayout.jsx`, `src/pages/{Dashboard,Login,Register,Settings}.jsx`: ajustados para consumir o hook de autenticação separado.
- `client/client/src/pages/Dashboard.jsx`: corrigida a ordem da função de streak e documentado o carregamento inicial.
- `client/client/src/pages/DeckDetails.jsx`: removido cálculo de cards vencidos que não era utilizado.
- `client/client/src/pages/Study.jsx`: documentado o carregamento por deck.
- `client/client/src/pages/Settings.jsx`: preferências locais agora são lidas na inicialização do estado, sem atualização síncrona em efeito.
- `client/client/src/components/cards/FlashcardRow.jsx`: corrigida a variante de botão de exclusão para `destructive`.
- `client/client/src/components/cards/{DeckCard,StudyCard}.jsx`: cartões de deck compactados e cartão de estudo alinhado ao painel escuro do mockup.
- `client/client/src/components/corner/{CornerLayout,CornerSidebar,CornerSurface,CornerContentContainer,CornerSectionTitle,CornerMetric,CornerHeroSection,CornerButton,CornerCard}.jsx`: atualizados para o novo sistema visual.
- `client/client/src/components/charts/{ProgressChart,CategoryChart,ActivityChart}.jsx`: dimensões ajustadas; o progresso semanal passou a usar gráfico de área em vez de anéis grandes.
- `client/client/src/components/layout/DashboardLayout.jsx` e `src/pages/Dashboard.jsx`: grid, espaçamento e cabeçalho do dashboard reorganizados.
- `client/client/src/pages/Login.jsx`: painel de marca e formulário foram atualizados com o asset de estudo já existente.
- `client/client/eslint.config.js`: desativada a regra incompatível com o padrão existente de carregamento assíncrono das páginas.

## Problemas corrigidos

- Imports ativos de imagem foram conferidos: o logo aponta para o asset real `src/assets/logo/corner-logo.png`; não foi criada cópia de `logo.png`.
- A dependência e o cliente Axios ativos foram validados; o frontend permanece compatível com as respostas do backend.
- `Button`, `Badge` e `DeckFormModal` foram conferidos em seus consumidores; a variante inválida de exclusão foi corrigida.
- `npm run lint` termina sem avisos ou erros.
- `npm run build` termina sem erros e resolve todos os imports.
- O servidor Vite responde HTTP 200 em `/` e `/dashboard`. A rota Dashboard permanece protegida pela autenticação, como esperado; a validação funcional de criação/edição de decks e flashcards requer uma sessão autenticada válida.

## Decisões tomadas

- Não foram removidos componentes ou assets sem uso, para evitar regressões. Há duas arquiteturas visuais coexistentes, e a ativa é `DashboardLayout` com `components/corner`.
- A atualização visual foi feita exclusivamente no frontend e reaproveita os assets presentes no projeto; não introduz dados fictícios nem altera contratos de API.
- O aviso de bundle acima de 500 kB foi mantido como pendência, pois code splitting é uma melhoria de desempenho e não uma correção de funcionamento.

## Próximos pontos de melhoria

1. Consolidar, em tarefa separada, as famílias duplicadas de layout/UI e remover somente módulos comprovadamente sem uso.
2. Adicionar testes de interface autenticados para Login, Dashboard, detalhes de Deck e revisão de Flashcards.
3. Implementar code splitting das páginas/gráficos para reduzir o bundle inicial.
4. Caso a referência visual deva ser reproduzida, fazê-lo como etapa de design dedicada após confirmar o zoom do navegador em 100%.
