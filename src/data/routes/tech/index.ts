// 19 条技术路线的板块（RouteTier[]）+「全部技术路线」目录。
// 每条路线的数据在自己的文件里（./<slug>.ts），页面直接 import 对应文件。
import type { RouteTier } from '@/data/model/route-model';
import javaRoute from './java';
import pythonRoute from './python';
import goRoute from './go';
import rustRoute from './rust';
import cCppRoute from './c-cpp';
import cSharpRoute from './c-sharp';
import kotlinSwiftDartRoute from './kotlin-swift-dart';
import javascriptTypescriptRoute from './javascript-typescript';
import frontendRoute from './frontend';
import sqlDatabaseRoute from './sql-database';
import mysqlRoute from './mysql';
import postgresqlRoute from './postgresql';
import redisRoute from './redis';
import mongodbRoute from './mongodb';
import elasticsearchRoute from './elasticsearch';
import kafkaRoute from './kafka';
import nginxRoute from './nginx';
import dockerRoute from './docker';
import kubernetesRoute from './kubernetes';

export const techRoutes: Record<string, RouteTier[]> = {
  'java': javaRoute,
  'python': pythonRoute,
  'go': goRoute,
  'rust': rustRoute,
  'c-cpp': cCppRoute,
  'c-sharp': cSharpRoute,
  'kotlin-swift-dart': kotlinSwiftDartRoute,
  'javascript-typescript': javascriptTypescriptRoute,
  'frontend': frontendRoute,
  'sql-database': sqlDatabaseRoute,
  'mysql': mysqlRoute,
  'postgresql': postgresqlRoute,
  'redis': redisRoute,
  'mongodb': mongodbRoute,
  'elasticsearch': elasticsearchRoute,
  'kafka': kafkaRoute,
  'nginx': nginxRoute,
  'docker': dockerRoute,
  'kubernetes': kubernetesRoute,
};

export const techCatalog: RouteTier[] = [
  {
    name: '编程语言',
    items: [
      'java',
      'python',
      'go',
      'rust',
      'javascript-typescript',
      'frontend',
      'c-cpp',
      'c-sharp',
      'kotlin-swift-dart',
    ].map((slug) => ({ slug, kind: 'tech' as const })),
  },
  {
    name: '数据库',
    items: ['sql-database', 'mysql', 'postgresql', 'redis', 'mongodb', 'elasticsearch'].map(
      (slug) => ({ slug, kind: 'tech' as const }),
    ),
  },
  {
    name: '中间件',
    items: ['kafka', 'nginx'].map((slug) => ({ slug, kind: 'tech' as const })),
  },
  {
    name: '运维与云',
    items: ['docker', 'kubernetes'].map((slug) => ({ slug, kind: 'tech' as const })),
  },
];
