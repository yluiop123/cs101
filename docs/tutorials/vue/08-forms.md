---
title: 表单处理
---

# 第 8 章 · 表单处理

**本章目标：**

- 用 v-model 覆盖全部表单控件
- 掌握校验的"错误状态管理"模式
- 实现一个带校验的注册表单

## 8.1 控件绑定速查

第 5 章已入门 v-model，这里补齐全景：

```vue
<script setup>
import { ref } from 'vue';

const form = ref({
  username: '',
  password: '',
  gender: 'male',
  skills: [],
  level: 'beginner',
  bio: '',
  agree: false,
  birthday: '',
});
</script>

<template>
  <input v-model="form.username" placeholder="用户名" />
  <input v-model="form.password" type="password" />
  <textarea v-model="form.bio" rows="3" />

  <!-- 单选：v-model 绑同一变量，value 决定选中值 -->
  <label><input type="radio" value="male" v-model="form.gender" />男</label>
  <label><input type="radio" value="female" v-model="form.gender" />女</label>

  <!-- 多选：绑定数组 -->
  <label><input type="checkbox" value="vue" v-model="form.skills" />Vue</label>
  <label><input type="checkbox" value="react" v-model="form.skills" />React</label>

  <!-- 下拉 -->
  <select v-model="form.level">
    <option value="beginner">入门</option>
    <option value="intermediate">进阶</option>
  </select>

  <!-- 日期 -->
  <input type="date" v-model="form.birthday" />

  <!-- 布尔 -->
  <label><input type="checkbox" v-model="form.agree" />同意条款</label>
</template>
```

::: info 绑对象数组与绑定值的取舍
`v-model` 直连 ref（零散变量）适合小表单；多字段表单把字段聚成一个 `form` 对象统一管理——提交、重置、校验都对着一个对象操作。
:::

## 8.2 表单提交的标准写法

```vue
<script setup>
import { reactive } from 'vue';

const form = reactive({ username: '', password: '' });

async function onSubmit() {
  // @submit.prevent 已阻止默认提交（刷新页面）
  console.log('提交数据', form);
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input v-model="form.username" />
    <input v-model="form.password" type="password" />
    <button type="submit">注册</button>
  </form>
</template>
```

要点：监听 `<form>` 的 submit（回车与按钮都能触发）+ `.prevent` 阻止默认刷新。

## 8.3 校验模式：errors 对象

校验的本质是**管理一个 errors 对象**：

```vue
<script setup>
import { reactive, computed } from 'vue';

const form = reactive({ username: '', password: '', agree: false });
const errors = reactive({ username: '', password: '', agree: '' });

function validate() {
  errors.username = form.username.length >= 2 ? '' : '用户名至少 2 个字符';
  errors.password = form.password.length >= 6 ? '' : '密码至少 6 位';
  errors.agree = form.agree ? '' : '请先同意条款';

  return !errors.username && !errors.password && !errors.agree;
}

async function onSubmit() {
  if (!validate()) return;      // 校验不过不发请求
  await submitApi(form);
  alert('注册成功');
}
</script>

<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div>
      <input v-model="form.username" placeholder="用户名" />
      <p v-if="errors.username" class="error">{{ errors.username }}</p>
    </div>
    <div>
      <input v-model="form.password" type="password" placeholder="密码" />
      <p v-if="errors.password" class="error">{{ errors.password }}</p>
    </div>
    <div>
      <label><input type="checkbox" v-model="form.agree" />同意条款</label>
      <p v-if="errors.agree" class="error">{{ errors.agree }}</p>
    </div>
    <button type="submit">注册</button>
  </form>
</template>

<style scoped>
.error { color: #e11d48; font-size: 12px; margin: 4px 0 0; }
</style>
```

模式拆解：

```text
errors[field] = 错误文案 或 ''（空串即无错）
提交前统一 validate()，不过就 return
错误信息 v-if 渲染在对应控件下方
```

## 8.4 即时校验：失焦与输入时

```vue
<script setup>
const touched = reactive({ username: false });

// 用户碰过字段后才显示错误（避免"一进来就满屏红"）
function onBlur(field) {
  touched[field] = true;
  validateField(field);
}

const usernameError = computed(() => {
  if (!touched.username) return '';
  return form.username.length >= 2 ? '' : '用户名至少 2 个字符';
});
</script>

<template>
  <input v-model="form.username" @blur="onBlur('username')" />
  <p v-if="usernameError" class="error">{{ usernameError }}</p>
</template>
```

体验黄金组合：**失焦校验单字段 + 提交校验全表单**——不打扰输入，又不放过错误。

## 8.5 提交状态与防重复

```vue
<script setup>
const submitting = ref(false);

async function onSubmit() {
  if (submitting.value) return;        // 防重复提交
  if (!validate()) return;

  submitting.value = true;
  try {
    await registerApi(form);
    alert('成功');
  } catch (e) {
    errors.username = e.message;       // 后端错误回显到表单
  } finally {
    submitting.value = false;          // 无论成败都复位
  }
}
</script>

<template>
  <button type="submit" :disabled="submitting">
    {{ submitting ? '提交中…' : '注册' }}
  </button>
</template>
```

`submitting` 驱动两件事：按钮置灰 + 文案变化——JS 教程第 13 章 loading 思路的组件化。

## 8.6 重置与初始值

```js
const initialForm = { username: '', password: '', agree: false };

const form = reactive({ ...initialForm });

function reset() {
  Object.assign(form, initialForm);        // 批量恢复
  Object.keys(errors).forEach(k => (errors[k] = ''));
  Object.keys(touched).forEach(k => (touched[k] = false));
}
```

::: tip 初始值要"快照"
直接 `Object.assign(form, formInitial)` 引用同一对象会被后续修改污染——初始值先解构拷贝（`{ ...initialForm }`）再存。
:::

## 8.7 综合练习：完整注册表单

把 8.3~8.6 组合：reactive form + errors + touched + computed 单字段校验 + submitting 防重 + reset。清单：

- [ ] 用户名：失焦校验长度，错误红字提示
- [ ] 密码：长度 ≥ 6，输入时显示强度（弱/中/强）
- [ ] 条款：勾选才能提交
- [ ] 提交：校验不过 return；通过则 submitting 状态 + try/finally
- [ ] 成功后 reset()

密码强度 computed 示例：

```js
const strength = computed(() => {
  const len = form.password.length;
  if (len === 0) return '';
  const hasNum = /\d/.test(form.password);
  const hasLetter = /[a-zA-Z]/.test(form.password);
  const score = (len >= 6) + (len >= 10) + (hasNum && hasLetter);
  return ['弱', '中', '强'][score - 1] ?? '弱';
});
```

## 本章小结

- v-model 全控件覆盖；多字段表单聚合成 form 对象
- 校验 = errors 对象管理；失焦单字段 + 提交全表单的组合体验最佳
- submitting 状态防重复提交、驱动按钮态；try/finally 保证复位
- 重置要基于"快照"初始值
