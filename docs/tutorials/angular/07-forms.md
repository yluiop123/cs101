---
title: 表单
---

# 第 7 章 · 表单

**本章目标：**

- 掌握响应式表单（Reactive Forms）的核心三件套
- 学会内置校验器与自定义校验
- 了解模板驱动表单的定位

## 7.1 两种表单方案

```text
响应式表单（Reactive Forms）：
  表单结构在 TS 里声明（代码即表单模型）——可测试、动态强
  → 本教程主线，中大型项目标准

模板驱动表单（Template-driven）：
  全靠模板指令（[(ngModel)] + required 等）——简单表单快速上手
  → 认识即可
```

## 7.2 响应式表单核心：FormControl / FormGroup

```ts
// register.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="username" placeholder="用户名" />
      @if (username.invalid && (username.dirty || username.touched)) {
        <p class="error">用户名至少 2 个字符</p>
      }

      <input formControlName="password" type="password" placeholder="密码" />
      @if (password.invalid && password.touched) {
        <p class="error">密码至少 6 位</p>
      }

      <label>
        <input type="checkbox" formControlName="agree" /> 同意条款
      </label>
      @if (agree.invalid && agree.touched) {
        <p class="error">请先同意条款</p>
      }

      <button type="submit" [disabled]="form.invalid">注册</button>
    </form>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    agree: [false, Validators.requiredTrue],
  });

  // 捷径引用（模板里直接用）
  get username() { return this.form.controls.username; }
  get password() { return this.form.controls.password; }
  get agree() { return this.form.controls.agree; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();    // 触发全部错误显示
      return;
    }
    console.log('提交：', this.form.value);   // { username, password, agree }
  }
}
```

核心模型：

```text
FormControl     单个字段（值 + 校验状态）
FormGroup       字段组（表单 = 一个 FormGroup）
FormBuilder     工厂：group() 快速搭表单
[formGroup] + formControlName  模板与模型的挂钩
(ngSubmit)      表单提交事件（自动 preventDefault）
```

## 7.3 校验器与错误信息

```ts
import { Validators, AbstractControl, ValidationErrors } from '@angular/forms';

// 内置校验器
username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
email: ['', [Validators.required, Validators.email]],

// 自定义校验器：返回 null（通过）或错误对象
function noSpaces(control: AbstractControl): ValidationErrors | null {
  return /\s/.test(control.value ?? '') ? { noSpaces: true } : null;
}

// 用法
password: ['', [Validators.required, noSpaces]],
```

```html
<!-- 按错误类型显示不同文案 -->
@if (email.hasError('required')) { <p>请输入邮箱</p> }
@else if (email.hasError('email')) { <p>邮箱格式不正确</p> }
```

控件状态属性：

```text
valid / invalid    是否通过校验
touched            失焦过没有（用户"碰过"才显示错误）
dirty              用户改过没有（与初始值不同）
errors             错误对象 { required: true, ... }
```

## 7.4 值的读取与监听

```ts
// 读取
this.form.value;                 // { username: '...', ... }（部分可能为 null）
this.form.getRawValue();         // 完整原始值（推荐）

// 修改
this.form.patchValue({ username: 'Tom' });    // 部分更新
this.form.reset();                            // 重置（含状态）

// 监听变化（valueChanges 是 Observable！）
this.form.controls.username.valueChanges
  .pipe(debounceTime(300))
  .subscribe(value => console.log('输入变化', value));
```

响应式表单自带 Observable 流——与第 5 章的 RxJS 无缝衔接（valueChanges 直接 pipe 防抖）。

## 7.5 动态表单：FormArray

```ts
form = this.fb.group({
  title: [''],
  tags: this.fb.array([this.fb.control('')]),    // 动态字段集合
});

get tags() { return this.form.controls.tags; }

addTag() {
  this.tags.push(this.fb.control(''));          // 加一行
}
removeTag(i: number) {
  this.tags.removeAt(i);                        // 删一行
}
```

```html
@for (tag of tags.controls; track $index) {
  <input [formControl]="tag" placeholder="标签" />
  <button type="button" (click)="removeTag($index)">删</button>
}
<button type="button" (click)="addTag()">加标签</button>
```

## 7.6 模板驱动表单（认识）

```html
<!-- 全在模板里：ngModel 双向绑定 + 指令校验 -->
<form #f="ngForm" (ngSubmit)="submit(f.value)">
  <input name="username" ngModel required minlength="2" />
  <button [disabled]="f.invalid">提交</button>
</form>
```

简单表单（搜索框、单个设置项）用这个最快；结构复杂、需要动态性时回到响应式。

## 7.7 综合练习：注册表单的完整体验流

清单（整合 7.2~7.5）：

- [ ] username/password/email/agree 四字段 FormGroup + 捷径 getter
- [ ] 失焦后（touched）显示错误；提交时 markAllAsTouched 兜底
- [ ] 密码强度提示：valueChanges + 防抖 + computed 等级
- [ ] 同意条款 requiredTrue；提交按钮 form.invalid 置灰
- [ ] 提交调 api 层；成功后 reset()

```ts
// 密码强度（响应式表单 + signal 桥接的常见姿势）
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

passwordStrength = toSignal(
  this.password.valueChanges.pipe(
    map(p => {
      const len = (p ?? '').length;
      const hasNum = /\d/.test(p ?? '');
      const hasLetter = /[a-zA-Z]/.test(p ?? '');
      const score = (len >= 6) + (len >= 10) + (hasNum && hasLetter);
      return ['弱', '中', '强'][score - 1] ?? '弱';
    })
  ),
  { initialValue: '' }
);
```

## 本章小结

- 响应式表单：FormBuilder.group 声明模型，formControlName 挂模板
- 校验器数组（内置 + 自定义）；touched/dirty 控制错误显示时机
- valueChanges 是 Observable——防抖/联动直接 pipe
- FormArray 动态字段集；模板驱动表单适合简单场景
