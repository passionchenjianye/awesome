# git团队协作(基于github)

[TOC]

## 概述
团队协同开发代码仓库为github的`xunyijia`[https://github.com/xunyijia](https://github.com/xunyijia)组织，遵从`github`的**`pull request`**流程，后期会转到在自己服务器使用`gitlab`搭建的代码仓库，协作流程差别不大

### 术语
* 讯一佳 ＝＝＝ xunyijia
* 本地 ＝＝＝ 自己电脑
* upstream ＝＝＝ 现在使用讯一佳仓库源起的名字（不懂不影响）

### 注意
所有代码合并都使用`rebase`命令，不使用`merge`命令，`merge`命令会生成一个`commit`，`rebase`命令只是把自己做的`commit`放到历史链中的最前面，不懂可查询资料**git**的`rebase`和`merge`的区别。

### 目的
旨在理解协作流程的逻辑、git的基本操作和git的团队代码管理原理

## 初始项目的创建（一般为项目初始化负责人或xunyijia仓库管理权限者搭建）
### 项目的创建和关联
1. `github`的`xunyijia`组织仓库中创建一个项目，填写**名字**和**描述**，不勾选默认创建`README.md`，勾选创建将是另一个流程
2. 在本地（本地指自己电脑）创建一个文件夹，文件夹最好跟远程仓库的项目名一致
3. 文件存放项目初始化的代码，包括`.gitignore`文件（过滤指定文件或目录，使其不会上传到远程仓库）
4. 觉得万事具备，就准备开始敲命令
5. 关联远程仓库和上传初始化代码（所有操作都在项目根目录下）

```sh
# 初始化项目版本库，不知道怎么描述，就是创建`.git`文件
$ git init
# 添加修改或新增的文件到**暂缓区**
$ git add .
# 提交更改，把暂存区的所有内容提交到当前分支，现在是master
$ git commit -m "这次提交的描述"
# 关联远程仓库源，新初始化的项目没有关联到仓库,`origin`为源的名字，后面为仓库的地址，复制命令需要改为自己项目的地址，`git remote`命令具体作用自行学习
$ git remote add origin git@github.com:xunyijia/smartsport-demo.git
# 提交代码到远程仓库，第一次关联提交需要`-u`参数
$ git push -u origin master
```

### 项目的开发前设置
1. 因为`master`分支用来发布用，所以需要创建一个dev分支供开发使用，在xunyijia仓库中的项目中创建dev分支，不懂问人或者百度，很简单
2. 可选：在setting中的branchs设置dev分支为默认分支，每次打开项目将自动切换到dev分支
3. 虽然创建者有权限直接在xunyijia组织仓库中开发代码，但不建议，需要把项目`fork`到自己的仓库中,项目的右上角
4. 两种方法关联到自己仓库中的项目：
  * 第一种：直接删除本地项目，重新上去自己仓库的项目中克隆项目（`git clone 项目地址`），最好也在自己仓库中的项目设置默认分支为dev分支，这样克隆下来的将是dev分支，如果没有，执行下面操作：
  
  ```sh
  # 检查是否有dev分支的存在，如果存在会有remotes/origin/dev显示
  $ git branch -a
  # 如果不存在，拉取一下代码
  $ git pull
  # 创建分支并关联远程源分支
  $ git branch dev origin/dev
  # 切换分支
  $ git checkout dev
  # 注意⚠️：偷懒可以使用下面的创建并切换命令
  $ git checkout -b dev origin/dev
  ```
  * 第二种：不删除项目的情况下切换关联

  ```sh
  # 删除当前项目关联的远程仓库，origin为源的名称，可用git remote -v 查看
  $ git remote remove origin
  # 关联远程仓库源，前面有解释
  $ git remote add origin git@github.com:xunyijia/smartsport-demo.git
  # 如果没有dev分支，参考第一种方法如何关联创建dev分支
 ```
 
到此初始者已经具备团队开发的基础搭建

## 项目存在后的协同开发（重点）
### 拉取项目到本地
* 因为现在规定在**dev**分支中开发，所以如果`xunyijia`组织项目中没有**dev**分支，需要询问项目负责人具体情况，可能是没有创建，或者规则已经改变

* 把讯一佳组织仓库中项目`fork`到自己账号下，项目的右上角有个`fork`按钮
* 到自己账号下的项目中，最好在`setting`下的`branchs`设置中把**dev**分支设置为默认分支，这样克隆到本地将会是**dev**分支，现在的决策本地暂时用不到**master**分支
* 克隆项目到本地，如需设置ssh百度大把教程

```sh
# git基本命令，克隆远程仓库
$ git clone git@github.com:xunyijia/smartsport-demo.git
```

* 使用`git branch`查看分支，有**dev**分支则使用`git checkout dev`切换到dev分支，**如果克隆下来没有dev分支，则需要下面操作**，原理是创建 dev 分支，并关联到自己github项目的dev分支中

  ```sh
  # 检查是否有dev分支的存在，如果存在会有remotes/origin/dev显示
  $ git branch -a
  # 如果不存在，拉取一下代码
  $ git pull
  # 创建分支并关联远程源分支
  $ git branch dev origin/dev
  # 切换分支
  $ git checkout dev
  # 注意⚠️：偷懒可以使用下面的创建并切换命令
  $ git checkout -b dev origin/dev
  ```
* 此时本地就具备开发条件

### 代码提交操作
#### 首次提交代码前需要设置的命令
* 创建一个源，关联到讯一佳仓库中的项目，就是当前开发的项目最终需要合并到讯一佳仓库的那个项目

```sh
# 查看本地项目源，不出意外应该是有两条origin的数据，如果存在讯一佳仓库的源，下面操作可不执行
$ git remote -v
# 添加源upstream,并关联到后面那个仓库（upstream可改为自己习惯的名称，但是刚开始阶段每个人都用，也可以用这个，就是嫌它字母多）
$ git remote add upstream git@github.com:xunyijia/smartsport-demo.git
# 再次查看，应该已经有4条显示
$ git remote -v
```

#### 开发兼代码提交
* 开发前有个好习惯，先拉取讯一佳源仓库代码，`rebase`到最新代码再进行开发，如果确认本地`origin`源代码最新，则忽略此条操作

```sh
# 查看源的详情
$ git remote -v
# 拉取最新的远程源upstream的代码
$ git fetch upstream
# rebase upstream/dev的代码到当前分支
* git rebase upstream/dev
```
* 开发代码，到你需要上传代码的时候，执行下面操作提交代码：

```sh
# 添加修改或新增的文件到暂缓区
$ git add .
# 提交更改，把暂存区的所有内容提交到当前分支
$ git commit -m "此次提交描述"
# 查看源的详情
$ git remote -v
# 拉取最新的远程源upstream的代码
$ git fetch upstream
# rebase upstream/dev的代码到当前分支
$ git rebase upstream/dev
# 查看当前代码状态，常用的命令，主要查看是否有代码冲突
$ git status
# 如果有冲突，解决代码冲突，没有冲突直接push代码，代码冲突解决此文档不讲解
# 把解决冲突后的代码添加到暂缓区
$ git add .
# After resolving the conflict manually and updating the index with the desired resolution, you can continue the rebasing process with
$ git rebase --continue
# 没代码冲突直接使用此命令，不使用－f参数有时候会提交失败，作用是强制覆盖远程仓库分支，以后研究优化此操作
$ git push origin dev -f
```

#### 提交pull request

* 在自己账号下的项目中，找到点击提交`pull request`的按钮，填写描述后按提交，如第一次不懂可询问一下，操作一次以后应该就没有问题了

* 负责人负责`code review`代码，通过，或者提出需要修改的地方

#### 代码打补丁

* 代码没通过，需要修改

* 回到本地，把需要修改的地方改好
* 执行下列操作打补丁

```sh
# 添加修改或新增的文件到暂缓区
$ git add .
# 把修改的代码添加到上一次的commit上，应该会出来一个vi编辑，:q 退出即可
$ git commit --amend
# 强制覆盖远程仓库分支，代码会自动关联到讯一佳仓库，不用其余操作，通知别人code review
$ git push origin dev -f
```


## TODO
* 添加图片指引
* 添加原理性讲解
* 添加git基本命令的解析
* 添加git分布式思想讲解

## LISTEN
@MIT

