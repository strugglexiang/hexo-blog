// Click-heart effect: restores the custom script the old theme injected in
// layout/_layout.swig. The script itself lives in source/js/struggle/love.js
// and is copied verbatim to /js/struggle/love.js.
hexo.extend.filter.register('after_render:html', function (str) {
  if (!str || str.indexOf('</body>') === -1) return str;
  if (str.indexOf('/js/struggle/love.js') !== -1) return str;
  return str.replace('</body>', '<script type="text/javascript" src="/js/struggle/love.js"></script>\n</body>');
});
