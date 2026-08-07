'use strict';

const path = require('node:path');

// Older posts reference bundled assets as "./文章标题/图片.png". Modern
// Markdown renderers reject paths containing spaces, while Hexo emits each
// post's assets beside its final index.html. Rewrite only those references at
// render time; source Markdown remains unchanged.
hexo.extend.filter.register('before_post_render', (data) => {
  if (!data.source || !data.content || !data.path) return data;

  const assetFolder = path.basename(data.source, path.extname(data.source));
  const escapedFolder = assetFolder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const imagePattern = new RegExp(`!\\[([^\\]]*)\\]\\(\\./${escapedFolder}\\/([^)]*)\\)`, 'g');

  data.content = data.content.replace(imagePattern, (_match, alt, filename) => `![${alt}](/${encodeURI(data.path + filename)})`);
  return data;
});