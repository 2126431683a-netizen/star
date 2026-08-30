/* 自定义页面加载器：page 内容存在 assets/content.json 的 pages[] 里，
   后台修改后刷新页面即为最新内容，无需重新生成 html 文件。 */
(function () {
  'use strict';
  var slug = location.pathname.split('/').pop().replace(/\.html$/i, '');
  var titleEl = document.querySelector('.custom-title');
  var bodyEl = document.querySelector('.custom-body');

  function render(p) {
    document.title = (p.title || '页面') + ' | CHY Galaxy';
    if (titleEl) titleEl.textContent = p.title || '';
    if (bodyEl) bodyEl.innerHTML = p.body || '<p>这个页面还没有内容，去后台补上吧。</p>';
  }

  fetch('assets/content.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(0); })
    .then(function (c) {
      var p = (c.pages || []).filter(function (x) { return x.slug === slug; })[0];
      if (p) render(p);
      else if (bodyEl) bodyEl.innerHTML = '<p>页面不存在或已删除。</p>';
    })
    .catch(function () {
      if (bodyEl) bodyEl.innerHTML = '<p>内容加载失败，请刷新重试。</p>';
    });
})();
