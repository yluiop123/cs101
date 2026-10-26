import { useState } from 'react';

export default function ReactProbe() {
  const [count, setCount] = useState(0);
  return (
    <div className="my-6 border border-neutral-300 p-4">
      <p className="mb-3 text-sm">
        React 岛探针（用于验证 @astrojs/react + Tailwind + 客户端水合）：
      </p>
      <button
        type="button"
        className="border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
        onClick={() => setCount((value) => value + 1)}
      >
        点击计数：{count}
      </button>
    </div>
  );
}
