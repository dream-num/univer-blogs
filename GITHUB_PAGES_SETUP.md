# GitHub Pages 部署配置指南

## 1. 配置 GitHub Secrets

在GitHub仓库页面进行以下操作：

### 步骤：
1. 进入你的GitHub仓库页面
2. 点击 **Settings** 标签页
3. 在左侧菜单中点击 **Secrets and variables** → **Actions**
4. 点击 **New repository secret** 按钮
5. 添加以下三个secrets：

| 名称 | 值 |
|------|-----|
| `NOTION_TOKEN` | `` |
| `NOTION_DATABASE_ID` | `` |
| `NEXT_PUBLIC_SITE_URL` | `https://blog.capalyze.ai` |

## 2. 启用 GitHub Pages

### 步骤：
1. 在同一个仓库的 **Settings** 页面
2. 向下滚动找到 **Pages** 部分
3. 在 **Source** 下拉菜单中选择 **GitHub Actions**
4. 保存设置

## 3. 手动触发部署

通过GitHub网页界面
1. 进入仓库主页
2. 点击 **Actions** 标签页
3. 在左侧找到 **Deploy to GitHub Pages** 工作流
4. 点击 **Run workflow** 按钮
5. 选择分支（通常是main）
6. 点击绿色的 **Run workflow** 按钮


## 4. 查看部署状态

1. 在 **Actions** 标签页可以查看工作流运行状态
2. 部署成功后，网站将在 `https://你的用户名.github.io/capalyze-blogs` 访问

## 注意事项

- 首次部署可能需要几分钟时间
- 确保所有的Secrets都正确配置
- 如果部署失败，检查Actions日志获取详细错误信息