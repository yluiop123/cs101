// 应用领域路线：domain-ai-ml

import type { RouteTier } from '@/data/model/route-model';

const route: RouteTier[] = [
    { name: '入门 · 数学与编程基础', items: ['python', 'data-science', 'dsa'] },
    { name: '进阶 · 机器学习与深度学习', items: ['machine-learning', 'deep-learning', 'nlp'] },
    { name: '精通 · 大模型应用', items: ['llm-app', 'prompt-engineering', 'rag', 'agent'] },
    { name: '实战与生态 · 部署、评测与运维', items: ['model-deploy', 'eval', 'fastapi', 'docker', 'kubernetes'] },
];

export default route;
