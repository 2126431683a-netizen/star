# CHY.GALAXY · star

陈黄勇的个人作品集网站 ——「月球手册」：整站做成一个月球手册，八个月相对应八段内容（着陆 / 关于我 / 项目 / 技能 / 运营 / 游戏理解 / 经历 / 联系），没有第二层页面。

- 纯 HTML / CSS / JS + Canvas / WebGL2 绘制，动画为 GSAP 与自研时钟
- 像素字体 + Bayer 有序抖动模拟灰阶，黑白灰材质，鼠标经过处着色
- 整屏场景切换：滚轮 / 触摸 / 键盘方向键 / 右侧圆点导航 / 站内锚点均可

## 修改网站文字（内容管理后台）

网站所有文案集中在 `assets/content.json`，改它就行，不用碰代码。

### 在线后台（手机 / 任何电脑）

直接打开 **https://2126431683a-netizen.github.io/star/admin.html**

首次使用需要 2 分钟配置一次 GitHub 授权：

1. 打开 github.com/settings/developers → 「New OAuth App」
2. Application name 随意；Homepage 随意
3. **Authorization callback URL 必须填：** `https://2126431683a-netizen.github.io/star/admin.html`
4. 创建后复制 Client ID，粘贴进后台的配置页，点「用 GitHub 授权并开始编辑」

之后保存在线后台 = 直接提交到本仓库，网站约 1 分钟自动更新。

### 本地后台（这台电脑）

```bash
node admin.mjs
```

浏览器打开 **http://localhost:8642**（功能相同，推送走本地 git）。

共同功能：按分区编辑文案；「项目管理」分区可**添加 / 删除 / 排序项目**（截图先把图片文件放进仓库 `assets/portfolio/`）；「仅保存」为本地草稿。

## 本地预览

任选一种静态服务器，根目录指向本仓库即可，例如：

```bash
npx serve .
# 或
python -m http.server 8000
```

## 部署（GitHub Pages）

仓库 Settings → Pages → 选择分支（`main` / 根目录）即可上线。
所有资源引用均为相对路径，部署在根路径或子路径（如 `/<repo>/`）下均可正常工作。

---
© 2026 陈黄勇 · CHY.GALAXY —— 以像素为骨，以作品为星
