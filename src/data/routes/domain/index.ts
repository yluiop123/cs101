// 24 条应用领域路线的板块（RouteTier[]），键为 domain-<slug>。
// 每条路线的数据在自己的文件里（./<slug>.ts），页面直接 import 对应文件。
import type { RouteTier } from '@/data/model/route-model';
import aiMlRoute from './ai-ml';
import bigDataRoute from './big-data';
import blockchainWeb3Route from './blockchain-web3';
import cybersecurityRoute from './cybersecurity';
import devopsCloudRoute from './devops-cloud';
import embeddedIotRoute from './embedded-iot';
import fintechRoute from './fintech';
import gameVrArRoute from './game-vr-ar';
import gisRoute from './gis';
import mobileDevRoute from './mobile-dev';
import visualizationRoute from './visualization';
import webSaasRoute from './web-saas';
import desktopAppRoute from './desktop-app';
import industrialHmiRoute from './industrial-hmi';
import databaseSystemsRoute from './database-systems';
import scientificComputingRoute from './scientific-computing';
import osSystemRoute from './os-system';
import mediaStreamingRoute from './media-streaming';
import softwareEngineeringRoute from './software-engineering';
import roboticsRoute from './robotics';
import industrialCommsRoute from './industrial-comms';
import scadaHmiRoute from './scada-hmi';
import motionControlRoute from './motion-control';
import dataEngineeringRoute from './data-engineering';

export const domainRoutes: Record<string, RouteTier[]> = {
  'domain-ai-ml': aiMlRoute,
  'domain-big-data': bigDataRoute,
  'domain-blockchain-web3': blockchainWeb3Route,
  'domain-cybersecurity': cybersecurityRoute,
  'domain-devops-cloud': devopsCloudRoute,
  'domain-embedded-iot': embeddedIotRoute,
  'domain-fintech': fintechRoute,
  'domain-game-vr-ar': gameVrArRoute,
  'domain-gis': gisRoute,
  'domain-mobile-dev': mobileDevRoute,
  'domain-visualization': visualizationRoute,
  'domain-web-saas': webSaasRoute,
  'domain-desktop-app': desktopAppRoute,
  'domain-industrial-hmi': industrialHmiRoute,
  'domain-database-systems': databaseSystemsRoute,
  'domain-scientific-computing': scientificComputingRoute,
  'domain-os-system': osSystemRoute,
  'domain-media-streaming': mediaStreamingRoute,
  'domain-software-engineering': softwareEngineeringRoute,
  'domain-robotics': roboticsRoute,
  'domain-industrial-comms': industrialCommsRoute,
  'domain-scada-hmi': scadaHmiRoute,
  'domain-motion-control': motionControlRoute,
  'domain-data-engineering': dataEngineeringRoute,
};
