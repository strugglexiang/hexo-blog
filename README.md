# ST's blog

个人博客，Hexo 8 + Next 8 主题，部署在 GitHub Pages：https://strugglexiang.github.io/

## 目录结构

```
.
├── source/
│   ├── _posts/            文章（文件名：数字-标题.md）
│   ├── images/            所有图片（文章配图、图标、头像）
│   ├── effects/code/      独立静态演示页
│   ├── about/  tags/  categories/
├── scripts/live2d.js      看板娘注入脚本
├── _config.yml            站点配置
├── _config.next.yml       主题配置
├── deploy.cmd             构建 + 发布
├── new-post.cmd           新建文章
└── preview.cmd            本地整站预览
```

`public/`、`.deploy_git/`、`db.json`、`node_modules/` 都是生成物或依赖，已在 `.gitignore` 中忽略。

## 日常操作

### 写文章

```cmd
new-post.cmd "文章标题"
```

会生成 `source/_posts/标题.md` 并自动用 VS Code 打开，填内容后保存即可。

文章配图统一放 `source/images/<文章名>/`，在 Markdown 里这样引用：

```markdown
![说明](/images/<文章名>/xxx.png)
```

### 加静态效果

在 `source/effects/code/<分类>/<效果名>/` 下新建 `index.html`，图片、CSS、JS 放同一个文件夹，用相对路径引用。

- 本地预览：直接双击 `index.html`
- 线上地址：`https://strugglexiang.github.io/effects/code/<分类>/<效果名>/`
- 想让它在 `/effects/` 首页出现，编辑 `source/effects/index.html` 加一条链接

`source/effects/` 在 `_config.yml` 里配置了 `skip_render`，会按原样发布，不会被 Hexo 套上主题外壳。

### 本地整站预览

```cmd
preview.cmd
```

打开 http://localhost:4000 ，看到的就是线上效果。

### 发布

```cmd
deploy.cmd
```

自动执行 clean → generate → deploy，一两分钟后线上生效。

## 注意

- 需要 Node 20+（脚本里固定指向 Node 24，找不到时回退到 `node`）。
- 不要直接提交 `public/`，那是构建产物。
