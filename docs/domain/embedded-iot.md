<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '嵌入式 / IoT',
  description: '嵌入式开发和物联网涉及硬件编程和系统级开发，是软硬件结合的代表领域。广泛应用于智能家居、工业控制、可穿戴设备等领域。',

  items: [
    {
      name: '基础理论与工具入门',
      subtitle: '必修',
      children: [
        {
          title: 'C 语言深入',
          description: '指针、内存管理、位运算、结构体、链表',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "黑马 C 语言", url: "https://www.bilibili.com/video/BV1os411h77o", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "C 语言中文网教程", url: "http://c.biancheng.net/c/", icon: "mdi-file-document-outline" },
                { title: "C Programming", url: "https://en.cppreference.com/w/c", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '电路基础',
          description: '欧姆定律、数字电路（与或非门）、模数转换',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "数字电路基础", url: "https://www.bilibili.com/video/BV1Yb411W7st", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "电路基础教程", url: "https://www.runoob.com/digital-circuit/digital-circuit-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "Electronics Tutorials", url: "https://www.electronics-tutorials.ws/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '开发工具',
          description: 'Keil / STM32CubeIDE / PlatformIO / Arduino IDE',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "PlatformIO 文档", url: "https://docs.platformio.org/", icon: "mdi-file-document-outline" },
                { title: "STM32CubeIDE 文档", url: "https://www.st.com/en/development-tools/stm32cubeide.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '实验平台',
          description: 'Arduino Uno / STM32 开发板 + 面包板 + 基本元器件',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Arduino 入门教程", url: "https://www.bilibili.com/video/BV1Ht411k7uF", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Arduino 官方教程", url: "https://www.arduino.cc/en/Tutorial", icon: "mdi-file-document-outline" },
                { title: "Arduino 中文社区", url: "https://www.arduino.cn/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Python 基础（用于上位机开发和数据处理）',
          description: '',
          optional: true
        }
      ]
    },
    {
      name: '单片机与裸机开发',
      subtitle: '必修',
      children: [
        {
          title: 'GPIO 编程',
          description: 'LED 控制、按键输入、中断触发',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "开发实战", url: "https://www.bilibili.com/video/BV1q54y1q7w9", icon: "mdi-play-circle-outline" },
                { title: "必修", url: "https://www.bilibili.com/video/BV1Yb411W7st", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "STM32 GPIO 教程", url: "https://www.cnblogs.com/STM32/", icon: "mdi-file-document-outline" },
                { title: "定时器", url: "https://www.bilibili.com/video/BV1q54y1q7w9", icon: "mdi-file-document-outline" },
                { title: "串行通信", url: "https://www.bilibili.com/video/BV1q54y1q7w9", icon: "mdi-file-document-outline" },
                { title: "ADC / DAC", url: "https://www.st.com/resource/en/application_note/an3116.pdf", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '中断管理',
          description: '中断优先级、临界段保护、延迟中断处理',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "FreeRTOS 中断管理", url: "https://www.freertos.org/Documentation/RTOS_book.html", icon: "mdi-file-document-outline" },
                { title: "MQTT 协议", url: "https://mqtt.org/getting-started/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'BLE（蓝牙低功耗）',
          description: 'ESP32 BLE 应用、传感器数据上传',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ESP32 BLE 文档", url: "https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/bluetooth/", icon: "mdi-file-document-outline" },
                { title: "低功耗设计", url: "https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/sleep_modes.html", icon: "mdi-file-document-outline" },
                { title: "Zephyr RTOS / RT-Thread（国产优秀 RTOS 生态）", url: "https://www.rt-thread.org/document/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: 'IoT 云端与边缘计算',
      subtitle: '选修',
      children: [
        {
          title: 'IoT 云平台',
          description: '阿里云 IoT / AWS IoT Core / 腾讯云 IoT Hub',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阿里云 IoT 文档", url: "https://help.aliyun.com/product/30520.html", icon: "mdi-file-document-outline" },
                { title: "AWS IoT Core 文档", url: "https://docs.aws.amazon.com/iot/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'ESP32 + WiFi',
          description: 'HTTP / MQTT 连接云平台、OTA 远程升级',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "ESP32 物联网实战", url: "https://www.bilibili.com/video/BV1CV411Y7Q8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ESP-IDF 官方文档", url: "https://docs.espressif.com/projects/esp-idf/", icon: "mdi-file-document-outline" },
                { title: "LoRaWAN", url: "https://lora-alliance.org/about-lorawan/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '边缘计算',
          description: 'EdgeX Foundry 架构、TensorFlow Lite 模型部署',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "EdgeX Foundry 文档", url: "https://docs.edgexfoundry.org/", icon: "mdi-file-document-outline" },
                { title: "TensorFlow Lite Micro", url: "https://www.tensorflow.org/lite/microcontrollers", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据采集与可视化',
          description: 'InfluxDB + Grafana 时序数据监控',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "InfluxDB 文档", url: "https://docs.influxdata.com/influxdb/", icon: "mdi-file-document-outline" },
                { title: "Grafana 文档", url: "https://grafana.com/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '高级嵌入式系统',
      subtitle: '选修',
      children: [
        {
          title: 'Linux 嵌入式',
          description: '交叉编译、设备树、内核模块、Yocto / Buildroot',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Yocto 文档", url: "https://www.yoctoproject.org/docs/", icon: "mdi-file-document-outline" },
                { title: "Buildroot 文档", url: "https://buildroot.org/docs.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Raspberry Pi',
          description: 'GPIO 控制、摄像头、传感器网络',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Raspberry Pi 官方文档", url: "https://www.raspberrypi.com/documentation/", icon: "mdi-file-document-outline" },
                { title: "树莓派中文教程", url: "https://shumeipai.nxez.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Zigbee / Thread',
          description: 'Mesh 网络、智能家居互联标准（Matter）',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Matter 标准", url: "https://csa-iot.org/all-solutions/matter/", icon: "mdi-file-document-outline" },
                { title: "Zigbee 文档", url: "https://zigbeealliance.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '功能安全',
          description: 'RTOS 安全机制、看门狗、CRC 校验',
          optional: true,
          groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "FreeRTOS 安全", url: "https://www.freertos.org/safety-certification.html", icon: "mdi-file-document-outline" }] }]
        },
        {
          title: '项目实战',
          description: '智能家居网关、环境监测站、无人机飞控',
          optional: true
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
