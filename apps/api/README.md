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

## Resolução de problemas comuns

- Erro de versão Node: verifique e use a versão do `.nvmrc`.
- Problemas com dependências: remova `node_modules` e `package-lock.json`, rode `npm install` novamente.
-- Em caso de problemas com Jest ou ambientes, verifique os arquivos de configuração em `jest.config.ts`/`.cjs` conforme o caso.
