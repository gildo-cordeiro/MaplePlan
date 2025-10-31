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

## Comandos npx usados durante o desenvolvimento (resumo)

Durante as sessões de desenvolvimento e debug foram usados vários comandos `npx` úteis. Abaixo segue uma lista dos comandos executados, com uma breve explicação e exemplos (PowerShell):

- `npx prisma generate --schema=./prisma/schema.prisma`
  - Gera o cliente Prisma a partir do arquivo `schema.prisma`. Deve ser executado sempre que o schema mudar.
  - Exemplo (no `apps/api`):
    ```powershell
    npx prisma generate --schema=./prisma/schema.prisma
    ```

- `npx nx serve` / `npx nx serve <project>`
  - Inicia um servidor de desenvolvimento para o workspace ou projeto especificado.
  - Exemplo (API): `npx nx serve @maple-plan/api` (ou usar `npm run dev:api`).

- `npx nx build <project>`
  - Compila e gera artefatos do projeto (libs/apps) usando os targets definidos pelo Nx.
  - Exemplo: `npx nx build shared-types` ou `npx nx build @maple-plan/api`.

- `npx nx run <project>:<target>`
  - Executa um target específico (mesmo que `nx run <project>:<target>`). Usado para rodar builds e targets customizados.
  - Exemplos:
    - `npx nx run shared-types:build`
    - `npx nx run @maple-plan/api:prisma-generate` (target que roda `prisma generate` definido no `apps/api/package.json`)
    - `npx nx run @maple-plan/api:build --verbose`

- `npx nx graph --focus=@maple-plan/api --file=tmp/dep-graph.html`
  - Gera um grafo de dependências focado num projeto e salva como HTML em `tmp/` (útil para entender dependências entre apps/libs).

- `npx tsc -p tsconfig.json --noEmit`
  - Executa uma checagem completa do TypeScript sem emitir arquivos. Útil para validar tipos rapidamente.

- `npx nx run @maple-plan/shared-types:build` (ou variantes `npx nx run shared-types:build`)
  - Compila a biblioteca `shared-types` para produzir `dist` e declarações (`.d.ts`) que outros projetos usam.

- `npx nx run @maple-plan/api:build` / `npx nx run @maple-plan/api:prisma-generate`
  - Exemplos de execução direta de targets do app `api`. O workspace também usa `dependsOn` para garantir que `shared-types:build` e `prisma-generate` sejam executados antes do `api:build`.

Observações e boas práticas
- Execute `npx prisma generate` sempre que alterar o schema Prisma.
- Use `npx tsc --noEmit` como um gate rápido antes de abrir PRs para evitar erros de tipos.
- Prefira rodar os comandos do Nx pela raiz (ex.: `npx nx build <project>`) para aproveitar cache e orquestração.
- Alguns comandos criam arquivos temporários (ex.: `nx graph` gera `tmp/`); há um script `npm run clean:tmp` na raiz para remover `tmp/` quando for necessário.

## Try it — comandos prontos (PowerShell)

Copie e cole cada bloco no PowerShell na raiz do repositório. Estes comandos cobrem instalação, desenvolvimento local, build, checagens e utilitários que usamos aqui.

1) Instalar dependências (raiz — workspaces):

```powershell
npm install
```

2) (Opcional) Subir serviços necessários via Docker Compose (Postgres):

```powershell
docker compose up -d
# para parar
docker compose down
```

3) Gerar Prisma Client (quando o schema mudar):

```powershell
cd apps/api
npx prisma generate --schema=./prisma/schema.prisma
cd -
```

4) Rodar em desenvolvimento (duas janelas/terminals):

```powershell
npm run dev:web    # frontend (Next.js)
npm run dev:api    # backend (NestJS)
```

5) Build (construir libs e apps via Nx):

```powershell
npx nx run shared-types:build
npx nx run @maple-plan/api:build --verbose
npx nx run @maple-plan/web:build
```

6) Checagens rápidas

```powershell
npx tsc -p tsconfig.json --noEmit   # checa tipos sem emitir arquivos
npx nx lint @maple-plan/api         # lint no projeto api
npx nx test @maple-plan/api         # rodar testes (se existir)
```

7) Grafo de dependências (gera HTML em tmp/)

```powershell
npx nx graph --focus=@maple-plan/api --file=tmp/dep-graph.html
Start-Process tmp\dep-graph.html   # abre no Windows (PowerShell)
```

8) Limpar tmp gerado pelo `nx graph` ou outros utilitários

```powershell
npm run clean:tmp
```

9) Executar um target específico (ex.: prisma-generate que existe no app api)

```powershell
npx nx run @maple-plan/api:prisma-generate
```