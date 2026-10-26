/// <reference lib="webworker" />

type LogLevel = 'log' | 'info' | 'warn' | 'error';

interface RunMessage {
  code: string;
}

const format = (value: unknown): string => {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

self.onmessage = (event: MessageEvent<RunMessage>) => {
  const { code } = event.data;
  const post = (level: LogLevel, args: unknown[]) => {
    self.postMessage({ type: 'console', level, text: args.map(format).join(' ') });
  };
  const fakeConsole = {
    log: (...args: unknown[]) => post('log', args),
    info: (...args: unknown[]) => post('info', args),
    warn: (...args: unknown[]) => post('warn', args),
    error: (...args: unknown[]) => post('error', args),
  };

  try {
    const run = new Function('console', `"use strict";\n${code}\n`);
    const result = run(fakeConsole);
    if (result !== undefined) post('log', [result]);
    self.postMessage({ type: 'done' });
  } catch (error) {
    self.postMessage({ type: 'error', text: error instanceof Error ? `${error.name}: ${error.message}` : String(error) });
  }
};
