Configuração rápida para deploy no Vercel

Opções recomendadas para este monorepo (Next.js em `apps/web`).

1) Criar projeto no Vercel
- No dashboard do Vercel, clique em "New Project" e conecte o repositório GitHub/GitLab/Bitbucket.

2) Configuração do projeto
Opção A — Root directory (recomendado se quiser isolar o app):
- Project Root / Root Directory: `apps/web`
- Framework Preset: Next.js (o Vercel detecta automaticamente)
- Build Command: `npm run build` (será executado em `apps/web`)
- Output Directory: deixar em branco (Next usa `.next` internamente)
- Environment: adicionar as variáveis necessárias (ex.: DATABASE_URL, NEXT_PUBLIC_*, etc.)

Opção B — Usar o `vercel.json` do repositório (monorepo):
- Se preferir manter o root do repositório no Vercel, `vercel.json` já presente no repositório instrui o Vercel a usar `apps/web/package.json` como fonte do build.
- Build Command (se necessário): `npm --prefix apps/web run vercel-build`

3) Variáveis de ambiente
- Adicione no Vercel as variáveis de produção necessárias (ex.: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXT_PUBLIC_*`, etc.).
- Se usar Prisma, configure a `DATABASE_URL` e, se usar shadow DB para migrations, configure conforme sua estratégia.

4) Node.js
- `apps/web/package.json` já sugere Node 20 via `engines.node`. No Vercel, verifique em Settings > General > Environment que Node 20 é suportado.

5) Build & Deploy
- Após criar/configurar o projeto, dispare um deploy. Verifique os logs no Vercel para eventuais erros (dependências, variáveis de ambiente, arquivos faltando).

6) Debug comum
- Erro de import de pacotes internos `libs/`: se o app depende de libraries do monorepo que não estão publicadas, prefira usar a opção A (Project Root = `apps/web`) ou ajustar o processo de instalação para executar `npm install` na raiz e usar `npx nx build web` como build command.

Notas finais
- Se você usa Nx para builds e prefere usar o workspace root, informe-me que eu atualizo o `vercel.json` e scripts para usar `npx nx build web` e garantir que `nx` esteja instalado durante a instalação.
- Posso também adicionar um arquivo `.vercelignore` para evitar upload desnecessário ao Vercel.
