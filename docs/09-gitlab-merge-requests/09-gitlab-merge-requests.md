结合 GitLab Merge Requests 进行日常化 CodeReview
===
> 2018.03.09 发布，最后更新于 2018.03.09

## develop 与 feature 分支管理

#### develop 分支

develop 分支作为常驻开发分支，用来汇总下个版本的功能提交。在下个版本的 release 分支创建之前不允许提交非下个版本的功能到 develop 分支，develop 分支内容会自动发布到内网开发环境。

#### feature 分支

对于新功能开发，应从 develop 上切出一个 feature 分支进行开发，命名格式为 `feature/XX功能名`，其中功能名使用小驼峰，Eg: `feature/updateAntD`。feature 分支进行编译通过并自测通过后，再合并到主干 develop 分支上。

单独去切 feature 分支而不直接在 develop 分支上开发有如下优势（多人协作时优势越发明显）：

* 未编译通过的代码不会阻塞其他成员的开发；
* 影响其他成员开发模块的公有代码，不会在未经自测的情况下被其他成员使用；
* 新安装了依赖包，并且应用层进行了调用，那么其他成员在更新代码后需要重新 `npm i` 或 `yarn` 才可以通过编译；应减少这种安装依赖频率；
* feature 分支上可以进行技术试错，当研发到一定程度后发现技术方案不可行时，可以放弃当前 feature 分支，从相对稳定的 develop 上切出新的 feature 分支继续进行研发；

feature 分支不是按开发人员定义的，一个 feature 分支可能有多个人员参与，一个人员也可以参与多个 feature 分支的开发。

#### 流程注意点

* 适当地进行 commit，既不要频繁地 commit 无意义的提交，也不要让一次 commit 穿插多个功能点，尽量让每次 commit 更加“典型”；
* 进行 feature 分支开发时，建议定期地、及时地将 develop 分支上的改动合并到自己的 feature 分支，这样可以提前解决冲突，避免最后合并 develop 分支时一次性进行大量的解决冲突操作；
* 在 feature 分支合并到 develop 分支前先将 develop 分支合并到该 feature，在该 feature 分支上解决冲突。这样可以避免将解决冲突遗漏的脏代码提交到 develop 分支上。release 分支合并到 master 同理；

总的原则：确保 develop 分支随时可编译、可运行，上面的功能模块是**相对稳定**、干净的，随时可以在 develop 上拉 feature 分支进行开发。

## commit 规范

参考 [Angular commit message guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines)

我们更多使用的是如下简化版 commit 模板：

```
<type>: <subject>
<BLANK LINE>
<body>
```

例如：

```
feat: AntD 升级至 V3.2.0

去掉了弃用方法，剔除了对 AntD 的样式重置并进行了样式布局适配，已自测通过。

```

#### Type（必要）

描述本次提交的类型。

高频：

* **feat**: 一个新的功能
* **fix**: 修复 Bug
* **perf**: 提高性能的代码
* **style**: 编码规范、风格上的修改，不影响功能

低频：

* **docs**: 仅改变项目文档
* **build**: 改变项目构建流程或包依赖
* **ci**: 改变 CI 配置或执行脚本 package.json scripts

#### Subject（必要）

用于描述本次 commit 的简要说明

#### Body（可选）

往往用来描述本次 Commit 的动机、需同步给团队的信息等

## GitLab Merge Requests 使用流程介绍

#### 整体思想

* 将 CodeReview 日常化，来培养团队成员 规范编码 及 最佳实践编码 的习惯；
* 至少2个人去共同负责一份代码，Review 的同时降低跨模块协作时的理解成本
* 定期（比如每周五），回顾本周进行 CodeReview 中普遍性问题

#### Merge Request 是什么？

[GitLab - Merge Requests](https://docs.gitlab.com/ee/user/project/merge_requests/index.html)

Merge Request（MR，合并请求）是作为编码协作及版本控制平台的 GitLab 的基础功能。就和它的命名一样：是一个将一个分支合并到另一个分支上的请求。

通过 GitLab 的 merge requests，我们可以：

* 对比两个分支的差异
* 逐行地去 Review 和讨论改动内容
* 将 MR 指派给任何已注册用户，并且可以任意多地改变受理人
* 通过 UI 界面去解决冲突

...

#### 何时去创建 Merge Requests？

当完成本 feature 分支的开发，并进行了自测，想要向主干分支 develop 合并时，通过登录 GitLab 提出 MR。

#### 如何创建 Merge Requests？

[GitLab - How to create a merge request?](https://docs.gitlab.com/ee/gitlab-basics/add-merge-request.html)

1. 提 MR 之前，应该已经创建了 branch 并且向 GitLab push 了改动
2. 进入项目并选择 Merge Requests Tab标签
3. 点击 New merge request
4. 选择 source branch 和 target branch
5. 准备好后，点击 Compare branches and continue 按钮
6. 为 MR 添加 title 和 description，并且指派一个用户来 review 你的代码去决定 accept 或者 close
7. 一切就绪后点击 Submit merge request 按钮

#### Code Review 环节

为了确保提测后 debug 修复效率，并避免因频繁进行 CodeReview 而打断其他成员工作，现阶段仅在 feature 分支合并 develop 分支时进行 MR 与 CodeReview。在 Release 分支进行 bug 修复以及 develop 分支上进行非常小粒度的开发时不需要提 MR，重要功能一定要提 MR。

Review 内容涉及编码规范（命名、注释、文件目录组织结构等）及最佳实践，在编码规范及需要小范围改动的最佳实践修复后进行分支的实际合并。对于改动较大且影响范围较低的代码，可以安排在 Debug 阶段或版本末期进行重构，随下个版本提测后发布。

新建了“FED CodeReview & 编码规范” 钉钉群，提出 MR 时请 @指派人，指派人及时进行 Review 并发表评论 @MR提出人，其他成员同样可以进行 Review。后续会研究 GitLab 与钉钉或邮件配合来实现该流程的自动化

进行 Review 的人员及项目负责人应尽到 Review 责任，并且建议大家平时多去 Review 他人代码，帮助团队成员共同提高。
