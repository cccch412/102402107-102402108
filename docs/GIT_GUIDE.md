# GitHub 双人协作说明

本项目为 2026 秋软件工程第二次结对作业。

项目成员：

- **102402107**：主仓库维护者
- **102402108**：Fork 仓库协作者

GitHub 主仓库：

```text
https://github.com/cccch412/102402107-102402108
```

102402108 Fork 仓库：

```text
https://github.com/ahejiayinaer/102402107-102402108
```

仓库名称按照作业要求设置为：

```text
102402107-102402108
```

项目开发过程中采用：

**功能分支 + Commit + Push + Pull Request + Merge**

的方式进行双人协作，避免两个人直接同时修改 `main` 分支。

---

## 一、成员分工

### 102402107

102402107 负责：

- 创建 GitHub 主仓库；
- 维护主分支 `main`；
- 开发自己的功能分支；
- 检查和合并 Pull Request；
- 在队友完成一轮开发后同步最新代码；
- 参与详情页、状态管理、UI 重构、图片上传和页面交互等功能开发。


---

### 102402108

102402108 负责：

- Fork 102402107 创建的主仓库；
- 从自己的 Fork 克隆项目；
- 在独立功能分支中开发；
- 将功能分支 Push 到自己的 Fork；
- 向 102402107 主仓库发起 Pull Request；
- 在每轮开发前同步主仓库最新代码；
- 参与搜索、信息发布和多轮 UI 优化等功能开发。


---

## 二、102402107 创建主仓库

102402107 在 GitHub 创建仓库：

```text
102402107-102402108
```

然后在本地项目目录初始化 Git：

```bash
git init
git branch -M main
git add .
git commit -m "chore: 初始化项目结构和基础页面"
git remote add origin https://github.com/cccch412/102402107-102402108.git
git push -u origin main
```

之后：

```text
origin
```

表示 102402107 自己的 GitHub 主仓库。

---

## 三、102402108 Fork 主仓库

102402108 在 GitHub 打开：

```text
https://github.com/cccch412/102402107-102402108
```

点击：

```text
Fork
```

创建自己的 Fork：

```text
https://github.com/ahejiayinaer/102402107-102402108
```

然后克隆 Fork：

```bash
git clone https://github.com/ahejiayinaer/102402107-102402108.git
```

进入项目：

```bash
cd 102402107-102402108
```

为了方便后续同步 102402107 的主仓库，再增加一个 `upstream`：

```bash
git remote add upstream https://github.com/cccch412/102402107-102402108.git
```

此时：

```text
origin
```

表示 102402108 自己的 Fork。

```text
upstream
```

表示 102402107 的主仓库。

可以通过：

```bash
git remote -v
```

检查仓库地址。

---

## 四、每轮开发都使用独立功能分支

项目开发过程中不直接在 `main` 上完成新功能。

每开始一个新的功能前，先从最新 `main` 创建独立分支。

例如：

```bash
git checkout main
git pull origin main
git checkout -b feature-detail
```

或者：

```bash
git switch -c feature-detail
```

完成开发并测试后：

```bash
git add .
git commit -m "feat: 完成物品详情和联系方式复制"
git push -u origin feature-detail
```

然后在 GitHub 创建 Pull Request。

---

## 五、102402107 的开发流程

当 102402107 开发功能时，先同步自己的主仓库：

```bash
git checkout main
git pull origin main
```

然后建立功能分支：

```bash
git checkout -b feature-name
```

开发和测试完成后：

```bash
git add .
git commit -m "feat: 功能说明"
git push -u origin feature-name
```

随后在 GitHub 创建：

```text
feature-name
        ↓
main
```

的 Pull Request。

确认代码和功能没有问题后：

```text
Merge pull request
→ Confirm merge
```

功能即可合并进入主分支。

---

## 六、102402108 的开发流程

102402108 每次开始新一轮开发前，需要先同步 102402107 主仓库的最新代码。

先切换到本地 `main`：

```bash
git checkout main
```

获取主仓库最新提交：

```bash
git fetch upstream
```

将最新主分支合并到本地：

```bash
git merge upstream/main
```

然后建立新的功能分支：

```bash
git checkout -b feature-name
```

开发完成并测试后：

```bash
git add .
git commit -m "feat: 功能说明"
git push -u origin feature-name
```

此时功能分支会上传到：

```text
ahejiayinaer/102402107-102402108
```

然后由 102402108 创建 Pull Request：

```text
ahejiayinaer:feature-name
        ↓
cccch412:main
```

102402107 检查修改内容后完成合并。

---

## 七、Pull Request 流程

102402108 完成功能后，例如：

```text
feature-search
```

Push 到自己的 Fork：

```bash
git push -u origin feature-search
```

然后在 GitHub 创建 Pull Request。

需要确认：

```text
base repository:
cccch412/102402107-102402108

base:
main

head repository:
ahejiayinaer/102402107-102402108

compare:
feature-search
```

Pull Request 中填写：

- 本次完成的功能；
- 修改了哪些页面；
- 是否已经在 Chrome 中测试；
- 是否存在需要注意的问题。

102402107 检查：

```text
Conversation
Commits
Files changed
```

确认没有问题后：

```text
Merge pull request
→ Confirm merge
```

完成合并。

---

## 八、实际开发中的主要功能提交

本项目按照功能划分进行开发

实际开发过程中完成了多轮功能分支和 Pull Request。

主要包括：

```text
chore: 初始化项目结构和基础页面

feat: 实现关键词搜索和筛选功能

feat: 完成物品详情和联系方式复制

feat: 实现寻物和招领信息发布功能

feat: 实现我的发布和状态更新功能

feat: 优化横屏布局和粉色简约UI

feat: 优化首页布局和信息列表交互

feat: 完善图片上传和页面布局交互
```

后续最终页面调整仍继续使用独立功能分支完成。

每次提交都对应真实功能修改，并在完成基本功能测试后再进行 Commit。

---

## 九、两人代码同步方式

由于两位成员轮流进行功能开发，因此每次一方完成 Pull Request 并合并后，另一方都需要同步最新 `main`。

### 102402107 同步 GitHub 主仓库

```bash
git checkout main
git pull origin main
```

---

### 102402108 同步 102402107 主仓库

```bash
git checkout main
git fetch upstream
git merge upstream/main
```

这样可以保证下一轮开发始终建立在最新代码基础上。

开发流程如下：

```text
102402107 修改
      ↓
Commit / Push
      ↓
Pull Request
      ↓
Merge 到 main
      ↓
102402108 同步 main
      ↓
102402108 新建功能分支
      ↓
Commit / Push
      ↓
Pull Request
      ↓
102402107 Merge
```

不断重复这一流程完成项目开发。

---

## 十、分支命名

开发过程中按照功能建立独立分支，例如：

```text
feature-search
feature-detail
feature-publish
feature-my-posts
feature-ui-redesign
feature-home-ui-polish
feature-photo-and-layout
feature-final-polish
```

分支名称尽量说明本次开发的主要内容。

删除功能分支不会影响已经进入 `main` 的代码。

---

## 十一、Commit 信息规范

项目 Commit 信息尽量遵循：

```text
类型: 本次修改内容
```

常用类型：

```text
feat:
```

表示新增或完善功能。

例如：

```text
feat: 实现关键词搜索和筛选功能
```

```text
feat: 完善图片上传和页面布局交互
```

---

```text
fix:
```

表示修复问题。

例如：

```text
fix: 修复信息列表滚动区域遮挡问题
```

---

```text
docs:
```

表示文档修改。

例如：

```text
docs: 完善README运行和目录说明
```

---

```text
test:
```

表示测试相关修改。

例如：

```text
test: 补充核心业务逻辑单元测试
```

---

```text
chore:
```

表示初始化或项目维护。

例如：

```text
chore: 初始化项目结构和基础页面
```

---

## 十二、提交原则

项目开发过程中遵循以下原则：

1. 每完成一个真实功能并测试通过后进行 Commit；
2. 不为了增加 Commit 数量制造无意义提交；
3. 一个 Commit 尽量对应一个清晰的功能或修改目标；
4. 新功能在独立分支中完成；
5. 通过 Pull Request 合并进入 `main`；
6. 合并前检查 `Files changed`；
7. 保持 `main` 为当前稳定版本；
8. 下一位成员开始开发前先同步最新 `main`。

---

## 十三、提交前检查

提交代码前先检查当前分支：

```bash
git branch --show-current
```

检查工作区：

```bash
git status
```

检查实际修改：

```bash
git diff
```

加入暂存区：

```bash
git add .
```

再次检查：

```bash
git status
```

确认无误后再进行：

```bash
git commit -m "feat: 本次功能说明"
```

---

## 十四、查看提交历史

可以使用：

```bash
git log --oneline
```

查看最近提交。

也可以使用：

```bash
git log --oneline --graph --all
```

查看分支和合并关系。

GitHub 主仓库中也可以通过：

```text
Commits
```

查看全部提交记录。

---

## 十五、查看 Pull Request

GitHub 主仓库：

```text
https://github.com/cccch412/102402107-102402108
```

进入：

```text
Pull requests
```

可以查看项目开发过程中两位成员提交的 Pull Request。

每个 Pull Request 中可以查看：

- 谁提交了修改；
- 修改属于哪个分支；
- 包含哪些 Commit；
- 修改了哪些文件；
- 谁完成了 Merge。

因此 Pull Request 也是本项目双人协作过程的重要记录。

---

## 十六、网络异常处理

实际开发过程中曾遇到 GitHub HTTPS 网络连接不稳定，例如：

```text
Failed to connect to github.com:443
```

或：

```text
Recv failure: Connection was reset
```

确认代码和 Commit 已经保存在本地后，可使用：

```bash
git -c http.version=HTTP/1.1 push
```

或者：

```bash
git -c http.version=HTTP/1.1 pull origin main
```

进行操作。


---


## 十七、单元测试说明

项目开发过程中进行了自动化单元测试和人工测试。

本地完整开发项目可以执行：

```bash
npm test
```

运行核心逻辑自动化测试。

提交代码前还需要通过 Google Chrome 对以下流程进行人工检查：

```text
发布信息
    ↓
首页显示
    ↓
搜索信息
    ↓
查看详情
    ↓
复制联系方式
    ↓
修改状态
    ↓
进入历史记录
```

对于图片功能，还需要检查：

```text
0 张图片
1 张图片
4 张图片
图片删除
图片压缩
图片放大
```

只有实际功能测试正常后才进行 Commit。

---
