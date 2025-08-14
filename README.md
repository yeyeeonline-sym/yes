# 生命之轮项目

## 项目介绍
生命之轮是一个帮助你评估生活各方面平衡状况的工具。通过对不同生活维度进行评分和描述，你可以清晰地看到自己生活的优势和需要改进的领域。

## 部署指南

### Vercel部署步骤
1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 确保构建设置如下：
   - 构建命令: `npm run build`
   - 输出目录: `dist`
4. 点击部署按钮

### 常见问题解决

#### 1. PNPM锁文件错误
如果遇到`ERR_PNPM_OUTDATED_LOCKFILE`错误，请执行以下步骤：
- 删除`pnpm-lock.yaml`文件
- 使用`npm install`代替`pnpm install`
- 提交更改并重新部署

#### 2. 404错误
如果部署后出现404错误，请检查：
- `vercel.json`文件是否存在且配置正确
- 确保路由配置正确指向`index.html`

## 本地开发
1. 安装依赖: `npm install`
2. 启动开发服务器: `npm run dev`
3. 构建项目: `npm run build`