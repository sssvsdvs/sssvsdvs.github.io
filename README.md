# Xinwei Shentu — portfolio

Independent GitHub Pages publishing checkout for `sssvsdvs.github.io`.
This directory contains the approved portfolio source and public assets, without the original project's Git history or backups.

## Development

Use Node.js 24 and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm run build
pnpm preview
```

The production website is generated in `dist/`; do not commit that directory or `node_modules/`.
Vite's default base is `/`, matching `https://sssvsdvs.github.io/`.
Hash routes such as `/#project/detailing-risk` are handled in the browser.

## First publication

This checkout has a new local Git repository on `main`, with no inherited history and no remote configured.

1. GitHub Desktop → File → Add local repository → select this directory.
2. Review Changes. Only current source, public assets and configuration should be present.
3. Once approved, make the initial commit on main.
4. Publish repository with the exact name `sssvsdvs.github.io` under the `sssvsdvs` account; confirm public visibility when publishing.
5. GitHub → Settings → Pages → Build and deployment → Source: GitHub Actions.
6. If the first workflow ran before Pages was enabled, rerun it from Actions.

The workflow builds on pushes to main and publishes only dist. Pull requests build without deployment.
No personal access token is required in source files.

## Sync approved changes from the original project

Original project:
`C:\Users\Shentu Xinwei\Desktop\gpt文件\2026-09-30\1-hero-2-3-4-5`

1. Finish and approve changes in the original project first.
2. Copy only changed files under src and public, and approved changes to index.html, package.json, pnpm-lock.yaml or vite.config.js into the matching locations here.
3. Preserve this checkout's .git, .github/workflows and publishing configuration. Never copy the original .git, sites, outputs, logs, dist or node_modules.
4. If dependencies changed, run pnpm install --frozen-lockfile. Run pnpm run build and preview before publishing.
5. Review all changes in GitHub Desktop. Renamed or removed source files need explicit reconciliation; simple copying does not remove obsolete files.
6. Commit and push main only after approval. Unapproved work can remain local or on a draft branch, which this workflow does not publish.

Synchronization is manual and reviewable; changes in the original directory do not automatically overwrite this publishing checkout or the live website.
