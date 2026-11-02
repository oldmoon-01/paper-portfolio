# 纸团作品集（首屏）

每个纸团是一个项目：点击展开，拖动可以捡起来扔，Esc 或点空白处揉回去。导航里的“关于”“联系”是从右侧推入的面板（#about、#contact）。

## 运行
纯静态文件，无需构建。用任意静态服务器打开（直接双击 index.html 不行，浏览器会拦截模块加载）：

```sh
npx serve .
# 或
python3 -m http.server 8000
```

## 改成你的内容
- `src/projects.js`：项目列表。加一条就多一个纸团；`image` 填封面图路径（建议 1200×630），`link` 填项目页链接。
- `index.html`：名字、身份、首屏文案、导航，以及关于 / 联系页的内容（带浅蓝底虚线的文字都是占位）。
- `src/graffiti.js`：墙面涂鸦的文字、颜色（`C`）和位置（`GRAFFITI_RECT`）。
- `src/pages.js` 顶部：邮箱和你所在地的时区（联系页会显示当地时间）。
- `src/main.js` 顶部：墙和地面颜色（`COLORS`，改墙色时同步改 `index.html` 里的 `--wall` / `--wall-lit`），`OPEN_FRAME` 控制展开后保留多少褶皱。

## 文件
```
index.html        页面结构 + 样式（含关于 / 联系）
src/pages.js      关于 / 联系的路由、复制邮箱、当地时间
src/projects.js   项目数据（主要改这里）
src/main.js       Three.js 场景、cannon-es 物理、交互
src/graffiti.js   墙面涂鸦（程序化喷漆：颗粒、流淌、褪色）
src/viewer.js     展开后的图集浏览
assets/paper.bin  预烘焙的揉纸动画（3500 个顶点 × 38 帧）
assets/paper.json 动画元数据
```

## 致谢
效果与揉纸动画来自 [item-develop/paper-crumple-demo](https://github.com/item-develop/paper-crumple-demo)（MIT，见 LICENSE-original），
原文见 Codrops：Building an Interactive Crumpled Paper Effect with Houdini VAT and Three.js。
本项目把原作的 FBX + EXR 顶点动画贴图预先解码成了一个更小的二进制文件。
