# MaplePlan — API (backend)

Aplicação backend construída com NestJS. Este README contém comandos rápidos para desenvolvimento, testes e build.

## Requisitos

- Node.js 20+ (recomendado) — ver `.nvmrc` na raiz.

## Como rodar em desenvolvimento

```powershell
# Instale dependências na raiz (workspaces)
npm install

# Inicie apenas a API em modo dev (script cross-platform)
npm run dev:api
```

A API geralmente roda em `http://localhost:3333`.

## Usando Docker Compose (Postgres local)

Se você usa o Docker Compose para levantar o Postgres localmente (ver `docker-compose.yml` na raiz):

```powershell
# sobe o banco em background
docker compose up -d db

# parar e remover
docker compose down
```

Verifique `apps/api/.env` para confirmar `DATABASE_URL` aponta para `localhost:5432` (ou ajuste conforme necessário).

## Testes

- Unit tests (Jest):

```powershell
npx nx test api
```

## Build (produção)

```powershell
npx nx build api
```

## Observações

- Código-fonte: `apps/api/src`
- Assets estáticos (se houver): `apps/api/src/assets`
- Se houver configuração de variáveis de ambiente, confira arquivos `.env` ou a documentação do projeto para valores esperados.

## Variáveis de ambiente (produção)

Em produção a aplicação espera que as variáveis de ambiente sejam fornecidas pela plataforma (por exemplo, Render). Não use `dotenv` em produção — defina os valores diretamente nas configurações do serviço.

As variáveis principais utilizadas pela API são:

- `DATABASE_URL` (required) — string de conexão do banco Postgres (ex.: `postgresql://user:pass@host:5432/dbname`). Usada pelo Prisma.
- `JWT_SECRET` (required for auth) — segredo para assinar/verificar tokens JWT.
- `JWT_EXPIRATION` (optional) — tempo de expiração do token em segundos (padrão: `3600`).
- `PORT` (optional) — porta na qual o servidor escuta (padrão: `8080` em produção).

Exemplo (Render): defina `DATABASE_URL`, `JWT_SECRET` e outras variáveis nas Environment -> Environment Variables do serviço.

Se você precisar de valores locais para desenvolvimento, mantenha um arquivo `.env` apenas para desenvolvimento e não o commit (já listado no `.gitignore`).

## Resolução de problemas comuns

- Erro de versão Node: verifique e use a versão do `.nvmrc`.
- Problemas com dependências: remova `node_modules` e `package-lock.json`, rode `npm install` novamente.
-- Em caso de problemas com Jest ou ambientes, verifique os arquivos de configuração em `jest.config.ts`/`.cjs` conforme o caso.
