// 文档里的「运行实例」不再跳转站内演练场，而是把代码 POST 到 CodePen 新标签页打开。
// HTML / CSS / JavaScript 用 CodePen；TypeScript 等其它语言不显示按钮（可去官方 Playground）。
const SUPPORTED = new Set(['js', 'javascript', 'html', 'css']);
const CODEPEN = 'https://codepen.io/pen/define';

const openInCodePen = (lang: string, code: string) => {
  const data: Record<string, string> = { title: 'CS101 示例', editors: '111' };
  if (lang === 'html') {
    data.html = code;
  } else if (lang === 'css') {
    data.html = '<div class="card"><h2>示例卡片</h2><p>修改 CSS 观察效果。</p></div>';
    data.css = code;
  } else {
    data.html = '<div id="app"></div>';
    data.js = code;
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = CODEPEN;
  form.target = '_blank';
  form.rel = 'noopener noreferrer';
  form.style.display = 'none';

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'data';
  input.value = JSON.stringify(data);
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  form.remove();
};

const decorate = () => {
  document.querySelectorAll<HTMLElement>('figure.frame').forEach((figure) => {
    if (figure.querySelector('.cs-code-run')) return;
    const pre = figure.querySelector('pre');
    const codeEl = figure.querySelector('pre code');
    if (!pre || !codeEl) return;
    const rawLang = (pre.getAttribute('data-language') ?? '').toLowerCase();
    const classLang = (codeEl.className.match(/language-([\w-]+)/)?.[1] ?? '').toLowerCase();
    const lang = rawLang || classLang;
    if (!SUPPORTED.has(lang)) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cs-code-run';
    button.textContent = '▷ 运行实例';
    button.title = '在 CodePen 中打开（新标签页）';
    button.addEventListener('click', () => openInCodePen(lang, codeEl.textContent ?? ''));
    figure.appendChild(button);
  });
};

decorate();
