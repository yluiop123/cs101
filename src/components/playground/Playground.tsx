import { useEffect, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';

type Lang = 'js' | 'ts' | 'html' | 'css';

interface LogLine {
  level: 'log' | 'info' | 'warn' | 'error' | 'done';
  text: string;
}

const TEMPLATES: Record<Lang, string> = {
  js: `// JavaScript 演练场：点击「运行」在 Worker 中执行\nconst nums = [3, 1, 4, 1, 5, 9, 2, 6];\n\nconst sorted = [...nums].sort((a, b) => a - b);\nconsole.log('排序结果:', sorted.join(', '));\nconsole.log('最大值:', Math.max(...nums));\n`,
  ts: `// TypeScript 仅提供编辑与语法提示（在浏览器内暂不执行）\ninterface User {\n  name: string;\n  age: number;\n}\n\nconst user: User = { name: 'CS101', age: 1 };\nconsole.log(user.name);\n`,
  html: `<!-- HTML：点击「运行」查看实时预览 -->\n<section style="font-family: sans-serif; padding: 16px">\n  <h2>你好，CS101</h2>\n  <p>这是可交互的 HTML 实例。</p>\n  <button onclick="this.textContent = '已点击 ' + (window.n = (window.n || 0) + 1)">点我</button>\n</section>\n`,
  css: `/* CSS：运行后渲染一个示例卡片 */\n.card { border: 1px solid #d9d9d9; padding: 16px; max-width: 320px; }\n.card h2 { margin: 0 0 8px; }\n`,
};

const LANGUAGE_MAP: Record<Lang, string> = {
  js: 'javascript',
  ts: 'typescript',
  html: 'html',
  css: 'css',
};

function buildPreview(lang: Lang, code: string) {
  if (lang === 'html') return code;
  if (lang === 'css') {
    return `<style>${code}</style><div class="card"><h2>卡片标题</h2><p>修改 CSS，观察预览变化。</p></div>`;
  }
  return '';
}

export default function Playground() {
  const [lang, setLang] = useState<Lang>('js');
  const [code, setCode] = useState<string>(TEMPLATES.js);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [preview, setPreview] = useState('');
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState('vs');
  const workerRef = useRef<Worker | null>(null);

  // Monaco 体积大且包含 CSS，必须客户端按需加载，避免 SSR 期间被引入
  useEffect(() => {
    let cancelled = false;
    import('./monaco-setup').then(({ monaco }) => {
      if (cancelled) return;
      loader.config({ monaco });
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'vs-dark' : 'vs');
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem('cs101:playground');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { code?: string; lang?: string };
        sessionStorage.removeItem('cs101:playground');
        if (parsed.code) {
          const nextLang = (['js', 'ts', 'html', 'css'] as Lang[]).includes(parsed.lang as Lang)
            ? (parsed.lang as Lang)
            : 'js';
          setLang(nextLang);
          setCode(parsed.code);
        }
      } catch {
        /* ignore */
      }
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get('lang') as Lang | null;
    if (paramLang && TEMPLATES[paramLang]) setLang(paramLang);
    const paramCode = params.get('code');
    if (paramCode) setCode(paramCode);
  }, []);

  useEffect(() => {
    setCode(TEMPLATES[lang]);
    setLogs([]);
    setPreview('');
  }, [lang]);

  const runnable = lang === 'js' || lang === 'html' || lang === 'css';

  const run = () => {
    setLogs([]);
    setRunning(true);
    workerRef.current?.terminate();
    workerRef.current = null;

    if (lang === 'html' || lang === 'css') {
      setPreview(buildPreview(lang, code));
      setRunning(false);
      return;
    }
    if (lang !== 'js') return;

    const worker = new Worker(new URL('./runner.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;
    const timer = window.setTimeout(() => {
      worker.terminate();
      setRunning(false);
      setLogs((prev) => [...prev, { level: 'error', text: '执行超时（>2s），已终止。' }]);
    }, 2000);

    worker.onmessage = (event: MessageEvent) => {
      const data = event.data as { type: string; level?: LogLine['level']; text?: string };
      if (data.type === 'console') {
        setLogs((prev) => [...prev, { level: data.level ?? 'log', text: data.text ?? '' }]);
      } else if (data.type === 'error') {
        setLogs((prev) => [...prev, { level: 'error', text: data.text ?? '' }]);
        window.clearTimeout(timer);
        setRunning(false);
        worker.terminate();
      } else if (data.type === 'done') {
        window.clearTimeout(timer);
        setRunning(false);
        worker.terminate();
      }
    };
    worker.postMessage({ code });
  };

  return (
    <div className="cs-playground">
      <div className="cs-playground-toolbar">
        <div className="cs-playground-tabs" role="tablist" aria-label="语言">
          {(['js', 'ts', 'html', 'css'] as Lang[]).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={lang === item}
              className={lang === item ? 'is-active' : ''}
              onClick={() => setLang(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="cs-playground-actions">
          <button type="button" className="cs-btn" onClick={() => setCode(TEMPLATES[lang])}>
            重置
          </button>
          <button
            type="button"
            className="cs-btn cs-btn-primary"
            onClick={run}
            disabled={!runnable || running}
            title={runnable ? undefined : 'TypeScript 暂不支持在浏览器内执行'}
          >
            {running ? '运行中…' : '运行'}
          </button>
        </div>
      </div>

      <div className="cs-playground-grid">
        <div className="cs-playground-editor">
          {ready ? (
            <Editor
              height="460px"
              language={LANGUAGE_MAP[lang]}
              value={code}
              theme={theme}
              onChange={(value) => setCode(value ?? '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          ) : (
            <p className="cs-playground-hint">编辑器加载中…（Monaco 按需加载）</p>
          )}
        </div>
        <div className="cs-playground-output">
          {lang === 'html' || lang === 'css' ? (
            preview ? (
              <iframe title="预览" className="cs-playground-preview" sandbox="allow-scripts" srcDoc={preview} />
            ) : (
              <p className="cs-playground-hint">点击「运行」生成实时预览。</p>
            )
          ) : (
            <div className="cs-console" aria-live="polite">
              {logs.length === 0 && <p className="cs-playground-hint">点击「运行」查看输出。</p>}
              {logs.map((line, index) => (
                <pre key={index} className={`cs-console-line cs-console-${line.level}`}>
                  {line.text}
                </pre>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
