<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '密码学',
  description: '密码学是信息安全的核心，研究如何在 adversaries 存在的情况下实现安全通信，涵盖加密、签名、哈希、密钥交换等基础协议。',
  items: [
    {
      name: '古典密码',
      children: [
        { title: '**替换密码**：凯撒密码、单表替换、维吉尼亚密码' },
        { title: '**换位密码**：列换位、栅栏密码' },
        { title: '**频率分析**：字母频率、n-gram 统计破译' },
        { title: '**一次一密**：完美保密性、Vernam 密码' },
      ],
    },
    {
      name: '对称加密',
      children: [
        { title: '**分组密码**：SPN 结构、Feistel 网络' },
        { title: '**AES**：字节代换、行移位、列混淆、轮密钥加' },
        { title: '**DES / 3DES**：Feistel 结构、S 盒设计' },
        { title: '**工作模式**：ECB、CBC、CTR、GCM（认证加密）' },
        { title: '**流密码**：RC4、ChaCha20' },
      ],
    },
    {
      name: '公钥密码',
      children: [
        { title: '**RSA**：大整数分解难题、密钥生成、加密/签名' },
        { title: '**椭圆曲线密码（ECC）**：ECDLP 难题、ECDH、ECDSA' },
        { title: '**Diffie-Hellman 密钥交换**：安全参数、中间人攻击防护' },
        { title: '**ElGamal**：基于离散对数的公钥加密' },
        { title: '**后量子密码**：格密码、多变量密码、基于哈希的签名' },
      ],
    },
    {
      name: '哈希与消息认证',
      children: [
        { title: '**哈希函数**：MD5、SHA-1、SHA-2、SHA-3' },
        { title: '**哈希性质**：抗原像、抗第二原像、抗碰撞' },
        { title: '**HMAC**：基于哈希的消息认证码' },
        { title: '**数字签名**：RSA 签名、DSS、Schnorr 签名' },
        { title: '**生日攻击与 Merkle-Damgård 结构**' },
      ],
    },
    {
      name: '安全协议与应用',
      children: [
        { title: '**TLS/SSL**：握手协议、证书验证、加密套件协商' },
        { title: '**数字证书**：X.509、CA 体系、证书链验证' },
        { title: '**PKI 公钥基础设施**：注册、颁发、吊销（CRL/OCSP）' },
        { title: '**零知识证明**：交互式证明、zk-SNARKs 基础' },
        { title: '**安全多方计算**：秘密共享、混淆电路' },
      ],
    },
  ],
  groups: [
    {
      name: '推荐资源',
      items: [
        { title: '《应用密码学》（Applied Cryptography）' },
        { title: '《图解密码技术》（结城浩）' },
        { title: '《密码学与网络安全》（Stallings）' },
        { title: 'Coursera Cryptography I (Stanford / Dan Boneh)' },
      ],
    },
  ],
}
</script>
<ContentView :data="data" />
