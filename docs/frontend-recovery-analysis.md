# Análise de recuperação do frontend

Data da análise: 21 de julho de 2026.

## Escopo analisado

- `client/client/src`: páginas, layouts, componentes, serviços, API e assets;
- dependências declaradas e instaladas pelo cliente;
- contratos já expostos pelo backend, somente para conferir a compatibilidade do cliente.

## Problemas encontrados

| Problema | Causa provável | Arquivos afetados | Plano de correção |
| --- | --- | --- | --- |
| Referência histórica a `../assets/logo.png` não existe na árvore atual | O asset foi reorganizado para `assets/logo/corner-logo.png` em alterações anteriores | Imports atuais de `Header.jsx`, `Sidebar.jsx` e `CornerSidebar.jsx` | Manter o único asset existente e os imports atuais. Não criar uma cópia artificial de `logo.png`. |
| Duas famílias de layout/UI coexistem | Uma refatoração parcial introduziu `components/corner` sem consolidar a estrutura anterior | `components/corner/*`, `components/layout/{Header,Sidebar}.jsx`, `components/dashboard/*`, `components/shared/ui/*` | Preservar a família ativa (`DashboardLayout` e `corner`) nesta recuperação. Deixar a consolidação/removal dos módulos antigos para uma tarefa isolada. |
| Clientes Axios duplicados | `api/api.js` permaneceu depois da criação de `api/axios.js` | `src/api/api.js`, `src/api/axios.js` | Manter `api/axios.js` como cliente em uso, pois contém token e `VITE_API_URL`; não apagar o legado sem confirmar consumidores externos. |
| Integração parcial de `Button` | `FlashcardRow` usa `variant="danger"`, enquanto o componente expõe `destructive` | `components/cards/FlashcardRow.jsx`, `components/ui/Button.jsx` | Alinhar o consumidor à variante declarada; não mudar o fluxo da tela. |
| O lint não conclui | Regras recentes do plugin React tratam os efeitos de carregamento assíncrono existentes como erro, além de haver import/variável morta | `main.jsx`, `AuthContext.jsx`, `Dashboard.jsx`, `DeckDetails.jsx`, `Study.jsx`, `Settings.jsx` | Corrigir os itens mortos e ajustar a regra incompatível com esse padrão de carregamento, preservando a lógica atual. |
| Variável calculada, mas não usada | Resíduo de uma versão anterior da página de detalhes | `pages/DeckDetails.jsx` | Remover o cálculo morto. |
| Componentes/assets sem referências de produção | Restos de experiências visuais e refatoração prévia | `components/cards/{FeatureCard,StatCard}.jsx`, `components/dashboard/*`, `components/layout/{Header,Sidebar}.jsx`, `components/shared/ui/{Avatar,Input}.jsx`, assets de demonstração | Não remover agora; confirmar uso com testes/documentação antes de uma limpeza dedicada. |
| Captura atual aparenta layout excessivamente reduzido | As dimensões visíveis correspondem a zoom de navegador de aproximadamente 150%: por exemplo, `w-80` (320 CSS px) aparece perto de 212 px | Estrutura visual, sem arquivo específico | Validar a aplicação em viewport/zoom padrão antes de alterar dimensões. O layout usa largura máxima de 1500 px e deve ocupar a área principal em 100% de zoom. |

## Verificações concluídas

- O `vite build` resolve todos os imports estáticos atuais.
- O logo existente está em `src/assets/logo/corner-logo.png`; nenhum import ativo aponta para `src/assets/logo.png`.
- As dependências usadas (React, router, Axios, Lucide e Recharts) estão instaladas.
- Serviços do frontend usam `api/axios.js`; endpoints e formatos de resposta conferem com o backend atual.
- `DeckFormModal`, `Button` e `Badge` estão conectados às telas que os consomem.

## Plano de correção

1. Corrigir inconsistências pontuais de integração e lint sem tocar em APIs, autenticação ou regras de negócio.
2. Executar build e lint novamente.
3. Subir o frontend e validar Login, Dashboard, Decks e Flashcards/Study; as rotas protegidas serão verificadas até a autenticação quando não houver conta de teste.
4. Registrar alterações, validações e pendências no relatório de recuperação.
