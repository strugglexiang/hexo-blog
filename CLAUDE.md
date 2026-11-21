# CLAUDE.md

This repo is a Hexo blog deployed to GitHub Pages. Site root = repo root (no `hexo/` subdirectory).

- Live site: https://strugglexiang.github.io/
- Deploy target: `strugglexiang/strugglexiang.github.io` (master branch, force-pushed by hexo-deployer-git)
- Hexo 8.1.2 + hexo-theme-next 8.29.1 (npm package, `theme: next`)

## Commands

Use Node 20+. On this machine the nvm default may be older; `nvm use` needs admin, so use the absolute binary:

```
C:\Users\strugglexiang\AppData\Roaming\nvm\v24.15.0\node.exe
```

Then, from repo root:

```
node node_modules\hexo\bin\hexo clean
node node_modules\hexo\bin\hexo generate
node node_modules\hexo\bin\hexo deploy
```

Or `deploy.cmd` (clean + generate + deploy), `new-post.cmd "标题"`, `preview.cmd` (localhost:4000).

## Layout

- `source/_posts/` — posts; filenames are `N-标题.md`. Permalinks are date-based and must not change.
- `source/images/` — ALL images (post images, favicon, avatar). Reference as `/images/...`.
- `source/effects/` — standalone static demos, served raw at `/effects/`. `skip_render: effects/**` in `_config.yml` must stay, or Hexo wraps them in the theme layout.
- `scripts/live2d.js` — injects the live2d widget via `after_render:html`.
- `_config.yml` — site config; `_config.next.yml` — theme config.
- Ignored/generated: `public/`, `.deploy_git/`, `db.json`, `node_modules/`. Never edit or commit them.

## Conventions

- New post images: `source/images/<post-slug>/file.png`, referenced as `/images/<post-slug>/file.png`.
- New demo: `source/effects/code/<category>/<name>/index.html` with relative asset paths; must work by double-clicking the file locally (relative paths, no absolute `/xxx` references except site images that are intentionally shared).
- Do not reference dead domains: `strugglexiang.xyz`, `*.strugglexiang.xyz`, `source.strugglexiang.top`.
- Don't add themes under `themes/`; the theme comes from npm.
- Old standalone repo `page_effects` is archived; edit demos in `source/effects/` only.

## Verify before saying done

1. Build: `node node_modules\hexo\bin\hexo clean && ... generate` — check `public/index.html` is not 0 bytes and file count is sane (~250+).
2. Check `public/effects/` files are byte-identical to `source/effects/` (raw copy).
3. After deploy, curl https://strugglexiang.github.io/ (Pages rebuild takes 1–2 min; use a cache-busting query and the `8.29.1` marker to confirm the new build is live).
