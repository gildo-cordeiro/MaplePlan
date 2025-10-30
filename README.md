# MaplePlan

> Monorepo gerenciado com Nx contendo o frontend (Next.js) e o backend (NestJS) do projeto MaplePlan.

Este repositório usa workspaces (packages gerenciadas pela raiz). Use os READMEs por aplicativo para detalhes específicos:

- `apps/api` — backend (NestJS)
- `apps/web` — frontend (Next.js)

## Requisitos

- Node.js 20+ (recomendado). Verifique `.nvmrc` na raiz se usar nvm.
- npm (ou pnpm/yarn) para instalar dependências.

## Como começar (desenvolvimento)

1. Instale dependências na raiz (workspaces):

```powershell
npm install
```

2. Execute os apps individualmente durante o desenvolvimento:

- Frontend (Next.js) — usando script cross-platform:

```powershell
npm run dev:web
```

- Backend (NestJS) — usando script cross-platform:

```powershell
npm run dev:api
```

3. Padrão de portas (padrão do projeto):

- Web: http://localhost:3000
- API: http://localhost:3333 (ou conforme configurado na app)

Verifique os targets do Nx se as portas forem diferentes.

## Comandos úteis

- Ver grafo de dependências: `npx nx graph`
- Construir projeto: `npx nx build <project>` (ex.: `npx nx build web`)
- Executar testes: `npx nx test <project>` ou `npx nx run-many --target=test --all`
- Lint: `npx nx lint <project>`
- Mostrar projetos e targets: `npx nx show projects` / `npx nx show project <projectName>`

## Rodando with Docker Compose (local)

Se o projeto fornece um `docker-compose.yml` para rodar dependências (por exemplo Postgres), use:

```powershell
docker compose up -d
# parar e remover
docker compose down
```

Certifique-se de que o Docker Desktop / Docker Engine está instalado e que o comando `docker compose` funciona no seu terminal.

## Estrutura resumida

- apps/
  - api/ (backend NestJS)
  - web/ (frontend Next.js)
- package.json, nx.json, tsconfig.base.json, etc.

## Boas práticas para contribuição

1. Abra uma issue antes de começar mudanças significativas.
2. Crie um branch com prefixo `feature/` ou `fix/`.
3. Inclua testes quando relevante e descreva as mudanças no PR.

## Troubleshooting rápido

- Se houver problemas com a versão do Node: use `nvm use` ou instale a versão indicada em `.nvmrc`.
- Remover `node_modules` e `package-lock.json` e rodar `npm install` pode resolver conflitos de dependência.
- Para problemas com cache do Nx: `npx nx reset`

## Links úteis

- Nx docs: https://nx.dev
- Nx Console (VSCode): https://nx.dev/getting-started/editor-setup
