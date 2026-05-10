<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '人工智能导论',
  description: '人工智能研究如何使计算机模拟人类智能行为，涵盖搜索、推理、知识表示、机器学习、深度学习等核心领域。',
  items: [
    {
      name: '搜索与问题求解',
      children: [
        { title: '**无信息搜索**：BFS、DFS、迭代加深、一致代价搜索' },
        { title: '**启发式搜索**：A* 算法、IDA*、启发函数设计' },
        { title: '**对抗搜索**：Minimax、Alpha-Beta 剪枝、蒙特卡洛树搜索' },
        { title: '**约束满足问题**：回溯搜索、前向检验、弧一致性' },
      ],
    },
    {
      name: '知识表示与推理',
      children: [
        { title: '**一阶逻辑**：谓词、量词、Skolem 化、归结推理' },
        { title: '**产生式系统**：规则库、正向/反向链推理' },
        { title: '**语义网络与框架**：概念层次、继承、槽与填充' },
        { title: '**不确定性推理**：概率推理、贝叶斯网络、Dempster-Shafer 证据理论' },
      ],
    },
    {
      name: '机器学习基础',
      children: [
        { title: '**监督学习**：线性回归、逻辑回归、决策树、SVM' },
        { title: '**无监督学习**：K-Means 聚类、DBSCAN、PCA 降维' },
        { title: '**集成学习**：Bagging、Boosting、随机森林、XGBoost' },
        { title: '**模型评估**：交叉验证、混淆矩阵、ROC/AUC、过拟合与正则化' },
      ],
    },
    {
      name: '深度学习',
      children: [
        { title: '**神经网络基础**：感知机、激活函数、BP 反向传播' },
        { title: '**CNN 卷积神经网络**：卷积层、池化层、经典架构（AlexNet/VGG/ResNet）' },
        { title: '**RNN 与序列模型**：LSTM、GRU、Seq2Seq、Attention 机制' },
        { title: '**Transformer**：自注意力、多头注意力、BERT/GPT 架构' },
        { title: '**生成模型**：GAN、VAE、扩散模型' },
      ],
    },
    {
      name: '强化学习',
      children: [
        { title: '**马尔可夫决策过程（MDP）**' },
        { title: '**动态规划**：策略迭代、值迭代' },
        { title: '**蒙特卡洛方法与时序差分**：Q-Learning、SARSA' },
        { title: '**深度强化学习**：DQN、Policy Gradient、PPO' },
      ],
    },
  ],
  groups: [
    {
      name: '推荐资源',
      items: [
        { title: '《人工智能：一种现代方法》（Russell & Norvig）' },
        { title: '《机器学习》（周志华）' },
        { title: '《深度学习》（Ian Goodfellow）' },
        { title: 'CS229 / CS231n / CS224n Stanford 公开课' },
      ],
    },
  ],
}
</script>
<ContentView :data="data" />
