# Frontend refactor summary

## Arquivos removidos
- Nenhum arquivo foi removido nesta etapa de refatoração.
- Os componentes vazios em componentes/cards/FeatureCard.jsx e componentes/cards/StatCard.jsx foram mantidos sem uso para evitar regressões inesperadas.

## Arquivos criados
- client/client/src/components/ui/Button.jsx
- client/client/src/components/ui/Badge.jsx
- client/client/src/components/forms/DeckFormModal.jsx
- docs/frontend-refactor.md

## Decisões tomadas
- Reutilizar componentes já existentes antes de criar novos blocos, preservando o comportamento atual das páginas.
- Centralizar a lógica de formulário de deck em um componente dedicado para reduzir duplicação de markup.
- Corrigir imports que apontavam para caminhos incorretos ou inconsistentes com a estrutura real do projeto.
- Manter a arquitetura limpa com pastas separadas para UI, forms e páginas, sem alterar regras de negócio nem fluxo de navegação.

## Problemas resolvidos
- Import incorreto em Study.jsx que apontava para um componente inexistente em ../components/StudyCard.
- Duplicação do formulário de criação/edição de deck dentro de Dashboard.jsx.
- Imports inconsistentes em FlashcardRow.jsx que não correspondiam à localização real dos componentes UI.
- Organização mais clara do frontend com componentes menores e reutilizáveis para interfaces comuns.
