---
title: Angular Material
---

# 第 10 章 · Angular Material

**本章目标：**

- 安装并配置 Angular Material
- 掌握高频组件（按钮/输入/表格/弹窗/通知）
- 了解主题定制的基本方式

## 10.1 Material 是什么

Angular Material 是 Angular 官方团队维护的**组件库**（Google Material Design 规范实现）——与 Vuetify 之于 Vue、Ant Design 之于 React 同位。Angular 项目用它的最大优势：**版本与 Angular 同步发布、深度集成**。

```bash
ng add @angular/material
# 交互：选主题（推荐 Azure/自定义）、全局排版、动画
```

`ng add` 自动完成：安装依赖、入口引入、主题样式、字体配置——CLI 全家桶风格。

## 10.2 高频组件速览

```ts
// 引入方式：standalone 组件的 imports 数组（按需）
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
```

```html
<!-- 按钮 -->
<button mat-button>文字按钮</button>
<button mat-flat-button color="primary">主要按钮</button>
<button mat-raised-button color="warn">危险按钮</button>
<button mat-icon-button><mat-icon>favorite</mat-icon></button>

<!-- 输入框（mat-form-field 包裹） -->
<mat-form-field>
  <mat-label>用户名</mat-label>
  <input matInput [(ngModel)]="username" />
  <mat-hint>2~20 个字符</mat-hint>
</mat-form-field>

<!-- 与响应式表单结合 -->
<mat-form-field>
  <mat-label>邮箱</mat-label>
  <input matInput formControlName="email" />
  @if (email.hasError('email')) {
    <mat-error>邮箱格式不正确</mat-error>
  }
</mat-form-field>
```

::: info mat-error 的联动
`<mat-error>` 只在控件 invalid 且 touched 时自动显示——Material 帮你做了第 7 章"错误显示时机"的体验优化。
:::

## 10.3 表格：mat-table

```ts
import { MatTableModule } from '@angular/material/table';
```

```ts
export class CourseTableComponent {
  displayedColumns: string[] = ['title', 'hours', 'action'];
  courses = [
    { title: 'HTML', hours: 8 },
    { title: 'Angular', hours: 20 },
  ];
}
```

```html
<table mat-table [dataSource]="courses">
  <ng-container matColumnDef="title">
    <th mat-header-cell *matHeaderCellDef>课程</th>
    <td mat-cell *matCellDef="let c">{{ c.title }}</td>
  </ng-container>
  <ng-container matColumnDef="hours">
    <th mat-header-cell *matHeaderCellDef>学时</th>
    <td mat-cell *matCellDef="let c">{{ c.hours }}h</td>
  </ng-container>
  <ng-container matColumnDef="action">
    <th mat-header-cell *matHeaderCellDef>操作</th>
    <td mat-cell *matCellDef="let c">
      <button mat-icon-button (click)="remove(c)"><mat-icon>delete</mat-icon></button>
    </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
</table>
```

结构固定但功能完备（排序/分页/过滤套件齐全）——企业后台表格的主力。

## 10.4 弹窗：MatDialog

```ts
import { MatDialog } from '@angular/material/dialog';

export class CourseListComponent {
  private dialog = inject(MatDialog);

  openConfirm(course: Course) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: course.title },        // 传数据进弹窗
      width: '320px',
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.remove(course);   // 弹窗关闭后的回执
    });
  }
}
```

```ts
// components/confirm-dialog.component.ts
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>确认删除</h2>
    <mat-dialog-content>确定要删除「{{ data.title }}」吗？</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>取消</button>
      <button mat-flat-button color="warn" (click)="onConfirm()">删除</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  data = inject(MAT_DIALOG_DATA);        // 注入弹窗数据（DI 的又一个应用）
  private dialogRef = inject(MatDialogRef);

  onConfirm() {
    this.dialogRef.close(true);          // 关闭并回传
  }
}
```

弹窗数据进出全靠 **DI 注入**（MAT_DIALOG_DATA）——Angular 风格的组件 API。

## 10.5 通知：snackbar

```ts
import { MatSnackBar } from '@angular/material/snack-bar';

export class TodoService {
  private snackBar = inject(MatSnackBar);

  onSave() {
    // ...保存逻辑
    this.snackBar.open('保存成功', '知道了', { duration: 3000 });
  }
}
```

对照第 5 章的自制 ToastService——Material 场景直接用 snackbar，两者取一。

## 10.6 主题定制

`ng add` 生成的主题文件里，自定义品牌色：

```scss
// src/styles.scss（节选）
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (
      primary: mat.$azure-palette,     // 主色板
      tertiary: mat.$blue-palette,
    ),
    typography: Roboto,
    density: 0,
  ));
}
```

暗色模式：Material 组件跟随 `.dark` 类或系统偏好，与全站主题策略对齐（思路同 Tailwind 第 7 章）。

::: tip 组件库选型的现实
Material 覆盖的是"标准 Material 风格"需求；国内管理后台常选 **NG-ZORRO**（蚂蚁出品，Ant Design 的 Angular 版）或 **PrimeNG**——用法同构（模块引入 + 选择器），学会 Material 后迁移成本低。
:::

## 10.7 综合练习：Material 化的课程列表

```html
<mat-form-field>
  <mat-label>搜索</mat-label>
  <input matInput [(ngModel)]="keyword" />
  <mat-icon matPrefix>search</mat-icon>
</mat-form-field>

<mat-list>
  @for (c of filtered(); track c.id) {
    <mat-list-item>
      <span matListItemTitle>{{ c.title }}</span>
      <span matListItemLine>{{ c.hours }} 小时</span>
      <button mat-icon-button matListItemMeta (click)="remove(c)">
        <mat-icon>delete</mat-icon>
      </button>
    </mat-list-item>
  }
</mat-list>

<button mat-fab color="primary" (click)="openAdd()"><mat-icon>add</mat-icon></button>
```

搜索框（form-field）+ 列表（list）+ 悬浮按钮（fab）——三行组件拼出完整页面骨架。

## 本章小结

- `ng add @angular/material` 一键接入；按需 imports 组件模块
- mat-error 自动管理错误显示时机；mat-table 结构固定功能全
- MatDialog 数据进出靠 DI 注入；snackbar 即全局通知
- Material 是官方底座，NG-ZORRO 等国产库用法同构
