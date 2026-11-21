// Inject the live2d widget (hijiki model) into every rendered HTML page.
// Replaces the unmaintained hexo-helper-live2d plugin after the Hexo 8 upgrade.
const SNIPPET = `
<script src="https://cdn.jsdelivr.net/npm/live2d-widget@3.x/lib/L2Dwidget.min.js"></script>
<script>
  L2Dwidget.init({
    model: {
      jsonPath: 'https://cdn.jsdelivr.net/npm/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json',
      scale: 1
    },
    display: { position: 'left', width: 150, height: 200 },
    mobile: { show: true, scale: 0.5 },
    react: { opacityDefault: 0.7, opacityOnHover: 0.2 }
  });
</script>
`;

hexo.extend.filter.register('after_render:html', function (str) {
  if (!str || str.indexOf('</body>') === -1) return str;
  if (str.indexOf('live2d-widget') !== -1) return str;
  return str.replace('</body>', SNIPPET + '</body>');
});
