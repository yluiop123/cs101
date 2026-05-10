<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '区块链 / Web3',
  description: '区块链和 Web3 代表去中心化互联网的发展方向，涵盖加密货币、NFT 和 DeFi 等应用，技术栈覆盖智能合约、前端和后端多个层面。',

  items: [
    {
      name: '区块链基础',
      subtitle: '必修',
      children: [
        {
          title: '区块链核心概念',
          description: '分布式账本、默克尔树、UTXO vs 账户模型',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Ethereum 官方文档", url: "https://ethereum.org/developers/", icon: "mdi-file-document-outline" },
                { title: "以太坊中文文档", url: "https://ethereum.org/zh/developers/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '共识机制',
          description: 'PoW（工作量证明）/ PoS（权益证明）/ DPoS / PBFT',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "共识算法对比", url: "https://ethernaut.openzeppelin.com/", icon: "mdi-file-document-outline" },
                { title: "Consensus Mechanisms", url: "https://ethereum.org/en/developers/docs/consensus-mechanisms/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '公链对比',
          description: 'Ethereum / Solana / Polkadot / Cosmos',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "钱包与交易", url: "https://www.bilibili.com/video/BV1Tb411j7uM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "公链生态对比", url: "https://ethereum.org/en/developers/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '密码学基础',
          description: '哈希函数（SHA-256 / Keccak-256）、非对称加密（ECDSA）',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "必修", url: "https://www.bilibili.com/video/BV1St411a7k2", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "密码学基础", url: "https://cryptobook.nakov.com/", icon: "mdi-file-document-outline" },
                { title: "Layer 2 扩展方案", url: "https://ethereum.org/en/developers/docs/scaling/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'ERC 标准',
          description: 'ERC-20（代币）/ ERC-721（NFT）/ ERC-1155（多代币标准）',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ERC-20 标准", url: "https://ethereum.org/en/developers/docs/standards/tokens/erc-20/", icon: "mdi-file-document-outline" },
                { title: "ERC-721 标准", url: "https://ethereum.org/en/developers/docs/standards/tokens/erc-721/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Hardhat 框架',
          description: '项目初始化、合约编译、本地节点测试、脚本部署',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Hardhat 官方教程", url: "https://hardhat.org/tutorial", icon: "mdi-file-document-outline" },
                { title: "Hardhat 中文文档", url: "https://hardhat.org/hardhat-runner/docs/getting-started", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '合约测试',
          description: 'Chai 断言、Hardhat Network 模拟、Gas 报告',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Hardhat 测试文档", url: "https://hardhat.org/hardhat-runner/docs/guides/test-contracts", icon: "mdi-file-document-outline" },
                { title: "OpenZeppelin", url: "https://docs.openzeppelin.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Foundry（Rust 编写的 Solidity 测试框架）',
          description: '',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Foundry 官方文档", url: "https://book.getfoundry.sh/", icon: "mdi-file-document-outline" },
                { title: "Vyper（Python 风格的智能合约语言）", url: "https://docs.vyperlang.org/", icon: "mdi-file-document-outline" },
                { title: "必修", url: "https://docs.ethers.org/v6/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'wagmi + RainbowKit',
          description: 'React 钱包连接、链切换、交易交互',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "wagmi 文档", url: "https://wagmi.sh/", icon: "mdi-file-document-outline" },
                { title: "RainbowKit 文档", url: "https://www.rainbowkit.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'The Graph',
          description: '子图查询与事件索引',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "The Graph 文档", url: "https://thegraph.com/docs/", icon: "mdi-file-document-outline" },
                { title: "The Graph 中文指南", url: "https://thegraph.com/zh/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'IPFS 集成',
          description: 'Pinning Service（Pinata）、文件上传和访问',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "IPFS 文档", url: "https://docs.ipfs.tech/", icon: "mdi-file-document-outline" },
                { title: "Pinata 文档", url: "https://docs.pinata.cloud/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'DApp 架构',
          description: '前端 React + 智能合约 + Graph Node',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "DApp 全栈开发", url: "https://www.bilibili.com/video/BV1St411a7k2", icon: "mdi-play-circle-outline" },
                { title: "众筹 / 投票 DApp 实战", url: "https://cryptozombies.io/", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "DApp 架构指南", url: "https://ethereum.org/en/developers/docs/dapps/", icon: "mdi-file-document-outline" },
                { title: "Web3.js（早期生态，功能更全但 API 较复杂）", url: "https://docs.web3js.org/", icon: "mdi-file-document-outline" },
                { title: "选修", url: "https://uniswap.org/whitepaper-v3.pdf", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '借贷协议',
          description: 'Aave 闪电贷、超额抵押清算机制',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Aave 文档", url: "https://docs.aave.com/", icon: "mdi-file-document-outline" },
                { title: "收益聚合", url: "https://docs.yearn.fi/", icon: "mdi-file-document-outline" },
                { title: "NFT 市场", url: "https://eips.ethereum.org/EIPS/eip-2981", icon: "mdi-file-document-outline" },
                { title: "DAO", url: "https://ethereum.org/en/dao/", icon: "mdi-file-document-outline" },
                { title: "选修", url: "https://swcregistry.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Gas 优化技巧',
          description: '变量打包、缓存 storage、unchecked 块',
          optional: true,
          groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Gas 优化指南", url: "https://docs.soliditylang.org/en/v0.8.19/gas-saving-tips.html", icon: "mdi-file-document-outline" }] }]
        },
        {
          title: '审计报告分析',
          description: '学习知名项目审计报告（Trail of Bits / OpenZeppelin）',
          optional: true,
          groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "OpenZeppelin 审计", url: "https://blog.openzeppelin.com/security-audits/", icon: "mdi-file-document-outline" }] }]
        },
        {
          title: 'CTF 挑战',
          description: 'Ethernaut / Capture the Ether',
          optional: true,
          groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "Ethernaut CTF 通关教程", url: "https://www.bilibili.com/video/BV1St411a7k2", icon: "mdi-play-circle-outline" }] }],
          groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Ethernaut CTF", url: "https://ethernaut.openzeppelin.com/", icon: "mdi-file-document-outline" }] }]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
