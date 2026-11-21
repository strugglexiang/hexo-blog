# ST's blog

个人博客源码。Hexo 生成的静态站部署在 GitHub Pages：

**线上地址：https://strugglexiang.github.io/**

## 技术栈

| 项目 | 版本 |
|---|---|
| Hexo | 8.1.2 |
| 主题 | hexo-theme-next 8.29.1（npm 包，配置 `theme: next`） |
| Node | 20 及以上（当前用 24） |
| 包管理 | npm（`package-lock.json`） |

站点部署到 `strugglexiang/strugglexiang.github.io` 仓库的 `master` 分支，由 `hexo-deployer-git` 强制推送生成结果。

## 目录结构

```
.
├── source/
│   ├── _posts/            文章，文件名格式：数字-标题.md
│   ├── images/            所有图片：文章配图、站点图标、头像
│   ├── effects/           独立的静态演示页（原样发布，不经 Hexo 渲染）
│   │   ├── index.html     演示列表首页 → /effects/
│   │   └── code/          分类目录，如 结构篇 / 交互篇 / 特效篇
│   ├── about/             关于页
│   ├── tags/  categories/ 标签页、分类页
├── scripts/live2d.js      看板娘注入（after_render:html 过滤器）
├── scaffolds/             hexo new 使用的模板
├── _config.yml            站点配置
├── _config.next.yml       主题配置（Gemini 布局等）
├── new-post.cmd           新建文章
├── preview.cmd            本地整站预览
├── deploy.cmd             构建 + 发布
└── README.md
```

以下目录是生成物或依赖，已被 `.gitignore` 忽略，不要提交、不要手改：

`public/`、`.deploy_git/`、`db.json`、`node_modules/`

## 日常操作

### 写文章

```cmd
new-post.cmd "文章标题"
```

生成 `source/_posts/文章标题.md` 并自动用 VS Code 打开。front-matter 已自动填好 `title`、`date`，需要时补充 `categories`、`tags`。

文章配图：

1. 在 `source/images/` 下建一个与文章同名的文件夹，例如 `source/images/我的文章/`
2. 图片放入该文件夹
3. Markdown 中引用：`![说明](/images/我的文章/示例.png)`

访问路径与线上一致，本地预览和线上不会出现路径差异。

### 添加静态效果

1. 在 `source/effects/code/<分类>/<效果名>/` 下新建 `index.html`
2. CSS、JS、图片放在同一文件夹，用相对路径引用（`./style.css`、`./img/a.png`）
3. 本地预览：**直接双击 `index.html`**，不需要服务器
4. 线上地址：`https://strugglexiang.github.io/effects/code/<分类>/<效果名>/`
5. 如需出现在 `/effects/` 列表页，编辑 `source/effects/index.html` 加一条链接

`source/effects/` 在 `_config.yml` 里配置了 `skip_render: effects/**`，必须保留，否则 Hexo 会把演示页当博客页面渲染并套上主题外壳。

### 本地整站预览

```cmd
preview.cmd
```

访问 http://localhost:4000 ，效果与线上一致（导航、样式、搜索）。

### 发布

```cmd
deploy.cmd
```

执行 clean → generate → deploy，推送完成后一到两分钟线上生效。

## 配置说明

- `_config.yml`：站点标题、作者、URL、分页、RSS、搜索、部署目标、`skip_render`
- `_config.next.yml`：主题配置（Gemini 布局、favicon、头像、菜单、社交链接、本地搜索、代码高亮）
- 主题从 npm 安装，不要放进 `themes/`；`theme: next` 会被解析为 `node_modules/hexo-theme-next`

## 注意事项

- **Node 20+**。脚本里固定使用 `C:\Users\strugglexiang\AppData\Roaming\nvm\v24.15.0\node.exe`，找不到时回退到 `node`。如果 `nvm use` 报拒绝访问，直接使用绝对路径即可（不需要管理员权限）。
- 部署是**强制推送**，会清空目标仓库现有内容，不要手动往 `strugglexiang.github.io` 仓库放文件。
- 图片、演示页都使用站内绝对路径或相对路径，不要引用旧域名（`strugglexiang.xyz`、`source.strugglexiang.top` 均已失效）。

## 历史背景

- 2019 年建站，原部署在自建服务器（`strugglexiang.xyz`）。
- 2026-11 服务器和域名停用，迁移到 GitHub Pages。
- 2026-11 从 Hexo 3.8 + Next 7.8 升级到 Hexo 8 + Next 8；升级前 Hexo 3.8 在新版 Node 上会生成 0 字节文件。
- 旧博客的独立效果站 `page_effects` 已合并进 `source/effects/`，原仓库不再维护。
