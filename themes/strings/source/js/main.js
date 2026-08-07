(() => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('strings-theme');
  if (savedTheme) root.dataset.theme = savedTheme;

  const themeToggle = document.querySelector('.theme-toggle');
  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('strings-theme', next);
  });

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  navToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('pre').forEach((block) => {
    const button = document.createElement('button');
    button.className = 'copy-code';
    button.type = 'button';
    button.textContent = '复制';
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(block.innerText);
      button.textContent = '已复制';
      setTimeout(() => { button.textContent = '复制'; }, 1500);
    });
    block.style.position = 'relative';
    button.style.cssText = 'position:absolute;right:8px;top:8px;border:0;border-radius:3px;padding:4px 7px;background:var(--blue-soft);color:var(--blue);font:11px var(--mono);cursor:pointer';
    block.appendChild(button);
  });

  const input = document.querySelector('#site-search');
  if (!input) return;
  const status = document.querySelector('#search-status');
  const results = document.querySelector('#search-results');
  const getUrl = (post) => post.path || post.url || '';
  const getTitle = (post) => post.title || decodeURIComponent(getUrl(post)).split('/').filter(Boolean).pop() || '未命名文章';
  let posts = [];
  fetch('/search.json').then((response) => response.ok ? response.json() : []).then((data) => { posts = data; }).catch(() => { status.textContent = '搜索索引暂不可用。'; });
  input.addEventListener('input', () => {
    const keyword = input.value.trim().toLowerCase();
    if (!keyword) { status.textContent = '输入关键词开始搜索'; results.innerHTML = ''; return; }
    const matched = posts.filter((post) => `${getTitle(post)} ${post.content} ${(post.tags || []).join(' ')}`.toLowerCase().includes(keyword)).slice(0, 20);
    status.textContent = `找到 ${matched.length} 篇文章`;
    results.innerHTML = matched.map((post) => `<article class="search-result"><h2><a href="${getUrl(post)}">${getTitle(post)}</a></h2><p>${post.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').slice(0, 150)}…</p></article>`).join('');
  });
})();