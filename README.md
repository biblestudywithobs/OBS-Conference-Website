# OBS Conference Website

`integration` is where feature branches are merged and tested before `main`.

This branch currently holds both implementations so the team can compare them
and pick one to carry forward:

| Folder | Branch | Stack | Run |
|---|---|---|---|
| repo root (`app/`) | `johnkay-obs-design` | Next.js 15, JavaScript, plain CSS | `npm install && npm run dev` → http://localhost:3000 |
| `frontend/` | `frontend/Daniel` | Next.js 16, TypeScript, Tailwind | `cd frontend && npm install && npm run dev -- -p 3001` → http://localhost:3001 |

## Workflow

1. Branch from `integration` (`feature/<name>`), open PRs into `integration`.
2. When `integration` is reviewed and working, merge `integration` → `main`.

## Secrets

Never commit API keys. Put them in `.env.local` (git-ignored), for example
`RESEND_API_KEY=...`, and in the hosting provider's environment settings.
