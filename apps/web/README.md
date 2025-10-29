# MaplePlan — Web (frontend)

Aplicação frontend construída com Next.js (app router).

## Requisitos

- Node.js 20+ (recomendado) — ver `.nvmrc` na raiz.

## Rodando em desenvolvimento

```powershell
# Instale dependências na raiz
npm install

# Inicie o frontend (Next.js)
npx nx dev web
```

O frontend normalmente fica disponível em `http://localhost:3000`.

## Testes

- Rodar testes unitários (Jest):

```powershell
npx nx test web
```

## Build para produção

```powershell
npx nx build web
```

## Observações

- Código-fonte: `apps/web/src`
- Caso precise ajustar variáveis de ambiente para produção ou desenvolvimento, siga a convenção do Next.js (`.env.local`, `.env.production`, etc.).

## Troubleshooting

- Se o Next falhar ao iniciar depois de atualizar dependências, remova `.next`, `node_modules` e rode `npm install` novamente.
- Para problemas com linting ou tipos, confira `tsconfig.json` e as configurações de ESLint em `apps/web`.
