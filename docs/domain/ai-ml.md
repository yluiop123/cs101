<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '人工智能 / 机器学习',
  description: 'AI 和机器学习是当前最热门的领域之一，涵盖从数据处理到模型部署的完整流程。',

  items: [
    {
      name: '数学与编程基础',
      subtitle: '必修',
      children: [
        {
          title: 'Python 核心',
          description: '数据类型、函数式编程、面向对象、常用标准库',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "黑马程序员 Python 教程", url: "https://www.bilibili.com/video/BV1ex411x7Em", icon: "mdi-play-circle-outline" },
                { title: "Python Full Course", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 Python", url: "https://www.runoob.com/python3/python3-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "Python Official Docs", url: "https://docs.python.org/3/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '线性代数',
          description: '矩阵运算、特征分解、SVD 分解、向量空间',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "MIT 线性代数", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", icon: "mdi-play-circle-outline" },
                { title: "3Blue1Brown 线性代数", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "线性代数", url: "https://www.zhihu.com/topic/19552350", icon: "mdi-file-document-outline" },
                { title: "Linear Algebra", url: "https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '概率论与统计',
          description: '常见分布、贝叶斯定理、假设检验、最大似然估计',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "概率论与统计", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDOjmo3Y6ADm0ScWAlEXf-in", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "概率论基础", url: "https://www.runoob.com/math/probability-basic.html", icon: "mdi-file-document-outline" },
                { title: "Statistics Tutorial", url: "https://www.khanacademy.org/math/statistics-probability", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '微积分（导数与优化）',
          description: '梯度、链式法则、凸优化基础',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "微积分", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "微积分", url: "https://www.zhihu.com/topic/19551480", icon: "mdi-file-document-outline" },
                { title: "Calculus", url: "https://ocw.mit.edu/courses/mathematics/18-01-single-variable-calculus-fall-2006/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '信息论基础',
          description: '熵、KL 散度、交叉熵',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "信息论基础", url: "https://zhuanlan.zhihu.com/p/26551798", icon: "mdi-file-document-outline" },
                { title: "Information Theory", url: "https://colah.github.io/posts/2015-09-Visual-Information/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '数据处理与可视化',
      subtitle: '必修',
      children: [
        {
          title: 'NumPy',
          description: '数组运算、广播机制、线性代数操作',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "NumPy 教程", url: "https://www.bilibili.com/video/BV1gJ411s7kY", icon: "mdi-play-circle-outline" },
                { title: "NumPy Full Course", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "NumPy 中文教程", url: "https://www.numpy.org.cn/", icon: "mdi-file-document-outline" },
                { title: "NumPy Official Docs", url: "https://numpy.org/doc/stable/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Pandas',
          description: 'DataFrame 操作、数据清洗、分组聚合、时间序列',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Pandas 教程", url: "https://www.bilibili.com/video/BV1GJ411r7qJ", icon: "mdi-play-circle-outline" },
                { title: "Pandas Full Course", url: "https://www.youtube.com/watch?v=vmEHCJofslg", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Pandas 中文教程", url: "https://www.pypandas.cn/", icon: "mdi-file-document-outline" },
                { title: "Pandas Docs", url: "https://pandas.pydata.org/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Matplotlib / Seaborn',
          description: '折线图、柱状图、热力图、子图布局',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Matplotlib 教程", url: "https://www.youtube.com/watch?v=3Xc3CAz1lWQ", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Matplotlib 中文教程", url: "https://www.matplotlib.org.cn/", icon: "mdi-file-document-outline" },
                { title: "Seaborn Docs", url: "https://seaborn.pydata.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'EDA（探索性数据分析）',
          description: '缺失值处理、异常检测、相关性分析',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "EDA 教程", url: "https://www.youtube.com/watch?v=Jw6Yj9s1SqA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Kaggle 竞赛平台", url: "https://www.kaggle.com/learn", icon: "mdi-file-document-outline" },
                { title: "EDA Guide", url: "https://www.kaggle.com/code/headsortails/eda-and-machine-learning", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Plotly / Bokeh',
          description: '交互式数据可视化',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Plotly 中文文档", url: "https://plotly.com/python/", icon: "mdi-file-document-outline" },
                { title: "Bokeh Docs", url: "https://docs.bokeh.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '机器学习算法',
      subtitle: '必修',
      children: [
        {
          title: 'Scikit-learn 框架',
          description: '统一的 fit / predict / transform 接口',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Scikit-learn 教程", url: "https://www.youtube.com/watch?v=pqNCD_5r0IU", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Scikit-learn 官方文档", url: "https://scikit-learn.org/stable/", icon: "mdi-file-document-outline" },
                { title: "Scikit-learn Docs", url: "https://scikit-learn.org/stable/user_guide.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '监督学习',
          description: '线性回归、逻辑回归、决策树、随机森林、SVM',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "吴恩达《机器学习》专项课程", url: "https://www.bilibili.com/video/BV164411b7dx", icon: "mdi-play-circle-outline" },
                { title: "Andrew Ng ML Course", url: "https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "机器学习入门", url: "https://easyai.tech/ai-definition/machine-learning/", icon: "mdi-file-document-outline" },
                { title: "ML Tutorial", url: "https://www.tensorflow.org/tutorials", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '集成学习',
          description: 'Bagging、Boosting、XGBoost、LightGBM、CatBoost',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "XGBoost 教程", url: "https://www.youtube.com/watch?v=OtD8wVaFm6E", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "XGBoost 官方文档", url: "https://xgboost.readthedocs.io/en/stable/", icon: "mdi-file-document-outline" },
                { title: "LightGBM Docs", url: "https://lightgbm.readthedocs.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '无监督学习',
          description: 'K-Means、DBSCAN、层次聚类、PCA / t-SNE',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "无监督学习", url: "https://easyai.tech/ai-definition/unsupervised-learning/", icon: "mdi-file-document-outline" },
                { title: "Unsupervised Learning", url: "https://scikit-learn.org/stable/unsupervised_learning.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '模型评估',
          description: '交叉验证、混淆矩阵、ROC / AUC、过拟合与正则化',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "模型评估", url: "https://scikit-learn.org/stable/modules/cross_validation.html", icon: "mdi-file-document-outline" },
                { title: "Model Evaluation", url: "https://scikit-learn.org/stable/modules/model_evaluation.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '特征工程',
          description: '特征编码、特征选择、特征缩放、多项式特征',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "特征工程教程", url: "https://www.youtube.com/watch?v=SHIhC0Vh7X4", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "特征工程", url: "https://easyai.tech/ai-definition/feature-engineering/", icon: "mdi-file-document-outline" },
                { title: "Feature Engineering", url: "https://machinelearningmastery.com/feature-engineering-for-machine-learning/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '深度学习',
      subtitle: '必修',
      children: [
        {
          title: 'PyTorch 核心',
          description: 'Tensor 操作、自动求导、nn.Module、DataLoader',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "PyTorch 教程", url: "https://www.bilibili.com/video/BV1jz4y1z7jZ", icon: "mdi-play-circle-outline" },
                { title: "PyTorch Full Course", url: "https://www.youtube.com/watch?v=ORrM43a7EoY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "PyTorch 官方教程", url: "https://pytorch.org/tutorials/", icon: "mdi-file-document-outline" },
                { title: "PyTorch Docs", url: "https://pytorch.org/docs/stable/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '神经网络基础',
          description: '全连接网络、激活函数、反向传播、优化器（SGD / Adam）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "李宏毅 2024 机器学习教程", url: "https://www.bilibili.com/video/BV1TD4y137mP", icon: "mdi-play-circle-outline" },
                { title: "Neural Networks", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "神经网络入门", url: "https://easyai.tech/ai-definition/neural-network/", icon: "mdi-file-document-outline" },
                { title: "Neural Networks", url: "https://www.3blue1brown.com/lessons/neural-networks", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '卷积神经网络（CNN）',
          description: '卷积层、池化层、ResNet、图像分类实战',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "CNN 教程", url: "https://www.youtube.com/watch?v=HGwBXDKFk9I", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "CNN 详解", url: "https://zhuanlan.zhihu.com/p/42559193", icon: "mdi-file-document-outline" },
                { title: "CS231n CNN", url: "https://cs231n.github.io/convolutional-networks/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '循环神经网络（RNN / LSTM / GRU）',
          description: '序列建模、文本分类',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "RNN 教程", url: "https://www.youtube.com/watch?v=WCUNPb-5EYI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "RNN 详解", url: "https://easyai.tech/ai-definition/rnn/", icon: "mdi-file-document-outline" },
                { title: "CS224n NLP", url: "https://web.stanford.edu/class/cs224n/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Transformer 架构',
          description: 'Self-Attention、Multi-Head Attention、Positional Encoding',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Transformer 详解", url: "https://www.youtube.com/watch?v=4Bdc55j80l8", icon: "mdi-play-circle-outline" },
                { title: "Attention is All You Need", url: "https://www.youtube.com/watch?v=iDulhoQ2pro", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Transformer 详解", url: "https://easyai.tech/ai-definition/transformer/", icon: "mdi-file-document-outline" },
                { title: "The Annotated Transformer", url: "https://nlp.seas.harvard.edu/2018/04/03/attention.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'TensorFlow / Keras',
          description: '对比学习，了解高层 API 与 TF Serving',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "TensorFlow 教程", url: "https://www.youtube.com/watch?v=tCkG43M1J_c", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "TensorFlow 官方文档", url: "https://www.tensorflow.org/?hl=zh-cn", icon: "mdi-file-document-outline" },
                { title: "Keras Docs", url: "https://keras.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'GAN / VAE',
          description: '生成模型，图像生成与数据增强',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "GAN 教程", url: "https://www.youtube.com/watch?v=8L11aMN5KY8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GAN 详解", url: "https://easyai.tech/ai-definition/gan/", icon: "mdi-file-document-outline" },
                { title: "GAN Guide", url: "https://developers.google.com/machine-learning/gan", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '计算机视觉 / 自然语言处理',
      subtitle: '选修',
      children: [
        {
          title: 'CV 方向',
          description: 'OpenCV 图像处理、YOLO 目标检测、UNet 语义分割',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "OpenCV 教程", url: "https://www.bilibili.com/video/BV1PV411d78M", icon: "mdi-play-circle-outline" },
                { title: "OpenCV Full Course", url: "https://www.youtube.com/watch?v=oXlwWbU8l2o", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OpenCV 官方教程", url: "https://docs.opencv.org/master/d9/df8/tutorial_root.html", icon: "mdi-file-document-outline" },
                { title: "YOLO Docs", url: "https://docs.ultralytics.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'NLP 方向',
          description: '词向量（Word2Vec / GloVe）、BERT 微调、文本分类 / NER',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "NLP 教程", url: "https://www.youtube.com/watch?v=fLvJ8VdH3Lg", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "NLP 入门", url: "https://easyai.tech/ai-definition/nlp/", icon: "mdi-file-document-outline" },
                { title: "HuggingFace NLP Course", url: "https://huggingface.co/learn/nlp-course", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '图像分类实战',
          description: '迁移学习（ResNet / EfficientNet）、数据增强',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "迁移学习", url: "https://zhuanlan.zhihu.com/p/61798121", icon: "mdi-file-document-outline" },
                { title: "Transfer Learning", url: "https://www.tensorflow.org/tutorials/images/transfer_learning", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '序列标注',
          description: '命名实体识别、分词、词性标注',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "序列标注", url: "https://zhuanlan.zhihu.com/p/30671412", icon: "mdi-file-document-outline" },
                { title: "Sequence Labeling", url: "https://huggingface.co/learn/nlp-course/chapter7/2", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '大模型与 AIGC',
      subtitle: '必修',
      children: [
        {
          title: 'HuggingFace Transformers',
          description: '加载预训练模型、Pipeline、模型微调',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "HuggingFace 教程", url: "https://www.youtube.com/watch?v=QEaBAZQCtwE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "HuggingFace 官方课程", url: "https://huggingface.co/learn/nlp-course", icon: "mdi-file-document-outline" },
                { title: "HuggingFace Docs", url: "https://huggingface.co/docs/transformers", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'LangChain',
          description: 'LLM 调用、Prompt 模板、Chain 编排、Memory',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "LangChain 教程", url: "https://www.bilibili.com/video/BV1As4y1q7eM", icon: "mdi-play-circle-outline" },
                { title: "LangChain Full Course", url: "https://www.youtube.com/watch?v=Qodk1s71L2c", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "LangChain 官方文档", url: "https://python.langchain.com/docs/get_started/introduction", icon: "mdi-file-document-outline" },
                { title: "LangChain Docs", url: "https://python.langchain.com/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'RAG（检索增强生成）',
          description: '向量数据库（Chroma / Milvus / FAISS）、Embedding 模型',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "RAG 教程", url: "https://www.youtube.com/watch?v=9P_Q5P3L3a8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "RAG 详解", url: "https://zhuanlan.zhihu.com/p/669427297", icon: "mdi-file-document-outline" },
                { title: "RAG Guide", url: "https://www.pinecone.io/learn/retrieval-augmented-generation/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '模型微调（Fine-tuning）',
          description: 'LoRA / QLoRA、PEFT、SFT 训练',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "LoRA 微调教程", url: "https://www.youtube.com/watch?v=YV1gTzF8Uv0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "LoRA 详解", url: "https://zhuanlan.zhihu.com/p/646791309", icon: "mdi-file-document-outline" },
                { title: "PEFT Docs", url: "https://huggingface.co/docs/peft", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'LLM 部署',
          description: 'vLLM / Ollama 推理加速、OpenAI API 兼容服务',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "vLLM 官方文档", url: "https://docs.vllm.ai/", icon: "mdi-file-document-outline" },
                { title: "Ollama Docs", url: "https://ollama.ai/library", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Agent / 智能体',
          description: 'ReAct 模式、Function Calling、多 Agent 协作',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "AI Agent 教程", url: "https://www.youtube.com/watch?v=ODwF-EvOClw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Agent 详解", url: "https://zhuanlan.zhihu.com/p/658506178", icon: "mdi-file-document-outline" },
                { title: "OpenAI Function Calling", url: "https://platform.openai.com/docs/guides/function-calling", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: 'MLOps 与模型部署',
      subtitle: '选修',
      children: [
        {
          title: '模型打包与部署',
          description: 'ONNX 导出、TorchScript、Triton Inference Server',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ONNX 官方文档", url: "https://onnx.ai/", icon: "mdi-file-document-outline" },
                { title: "Triton Inference Server", url: "https://developer.nvidia.com/triton-inference-server", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'MLflow / WandB',
          description: '实验跟踪、模型注册、版本管理',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "MLflow 教程", url: "https://www.youtube.com/watch?v=yaMG0Yj_18E", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MLflow 官方文档", url: "https://mlflow.org/docs/latest/", icon: "mdi-file-document-outline" },
                { title: "Weights & Biases Docs", url: "https://docs.wandb.ai/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '模型监控',
          description: '数据漂移检测、模型退化告警',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "模型监控", url: "https://www.evidentlyai.com/", icon: "mdi-file-document-outline" },
                { title: "Model Monitoring", url: "https://neptune.ai/blog/model-monitoring", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Docker + 云部署',
          description: '模型 API 容器化部署、GPU 资源管理',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Docker 教程", url: "https://www.bilibili.com/video/BV1gr4y1U7CY", icon: "mdi-play-circle-outline" },
                { title: "ML Model Deployment", url: "https://www.youtube.com/watch?v=0cZ_JIqzJnk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Docker 从入门到实践", url: "https://yeasy.gitbook.io/docker_practice/", icon: "mdi-file-document-outline" },
                { title: "MLOps Guide", url: "https://ml-ops.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
  ],
}
</script>
<ContentView :data="data" />
