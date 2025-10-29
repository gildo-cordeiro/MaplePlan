# MaplePlan — API (backend)

Aplicação backend construída com NestJS. Este README contém comandos rápidos para desenvolvimento, testes e build.

## Requisitos

- Node.js 20+ (recomendado) — ver `.nvmrc` na raiz.

## Como rodar em desenvolvimento

```powershell
# Instale dependências na raiz (workspaces)
npm install

# Inicie apenas a API em modo dev (watch via Nx)
npx nx serve api
```

A API geralmente roda em `http://localhost:3333` (verifique a configuração da app caso tenha sido alterada).

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
- Em caso de problemas com Jest ou ambientes, verifique os arquivos de configuração em `jest.config.ts`/`.cjs` conforme o caso.
