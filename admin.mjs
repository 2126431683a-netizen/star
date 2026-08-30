// CHY.GALAXY 内容管理后台（本地运行）
// 用法：在本仓库根目录执行  node admin.mjs  → 打开 http://localhost:8642
// 功能：编辑 assets/content.json 的所有文案；「保存并推送」= git 提交并推送，
//       GitHub Pages 约 1 分钟后自动更新网站。
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, normalize } from 'node:path';

const exec = promisify(execFile);
const ROOT = normalize(new URL('.', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const CONTENT = 'assets/content.json';
const PORT = 8642;

async function git(args) {
  const { stdout } = await exec('git', args, { cwd: ROOT, windowsHide: true });
  return stdout.trim();
}

function send(res, code, body, type = 'application/json; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
  res.end(body);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    // 管理界面
    if (url.pathname === '/' || url.pathname === '/admin') {
      const html = await readFile(join(ROOT, 'admin', 'admin.html'), 'utf8');
      return send(res, 200, html, 'text/html; charset=utf-8');
    }

    // 读取内容
    if (url.pathname === '/api/content' && req.method === 'GET') {
      const text = await readFile(join(ROOT, CONTENT), 'utf8');
      return send(res, 200, text);
    }

    // 保存内容（?push=1 时同时 git 提交并推送）
    if (url.pathname === '/api/content' && req.method === 'POST') {
      let raw = '';
      req.on('data', (c) => { raw += c; });
      await new Promise((r) => req.on('end', r));
      let obj;
      try { obj = JSON.parse(raw); } catch { return send(res, 400, JSON.stringify({ ok: false, error: '内容不是合法的 JSON' })); }
      const text = JSON.stringify(obj, null, 2) + '\n';
      await writeFile(join(ROOT, CONTENT), text, 'utf8');

      if (url.searchParams.get('push') !== '1') {
        return send(res, 200, JSON.stringify({ ok: true, pushed: false, message: '已保存到本地（未推送）' }));
      }
      const out = [];
      try {
        out.push(await git(['add', CONTENT]));
      } catch { /* 无变化时 add 也可能无输出 */ }
      try {
        out.push(await git(['commit', '-m', `内容更新 ${new Date().toLocaleString('zh-CN')}`]));
      } catch (e) {
        return send(res, 200, JSON.stringify({ ok: true, pushed: false, message: '内容没有变化，无需推送' }));
      }
      try {
        out.push(await git(['push']));
      } catch (e) {
        return send(res, 500, JSON.stringify({ ok: false, error: '保存成功但推送失败：' + String(e.stderr || e.message).slice(0, 400) }));
      }
      return send(res, 200, JSON.stringify({ ok: true, pushed: true, message: '已保存并推送！GitHub Pages 约 1 分钟后自动更新。', detail: out.filter(Boolean).join('\n').slice(0, 600) }));
    }

    // 其余路径：不提供任何文件服务（管理后台专用，网站本身走 GitHub Pages / 其他静态服务）
    send(res, 404, JSON.stringify({ ok: false, error: 'not found' }));
  } catch (e) {
    send(res, 500, JSON.stringify({ ok: false, error: String(e.message || e) }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`内容管理后台已启动：http://localhost:${PORT}`);
  console.log('（在浏览器打开上面的地址即可修改网站文案；「保存并推送」后约 1 分钟上线）');
});
