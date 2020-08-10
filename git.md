1. 什么是git
  - git是一个**分布式**的**版本控制管理工具**
    - 分布式
    - 版本

2. git的安装
  - 安装的gitbash.exe

3. git 基础
  - git初始化 -》 在我们的工程（项目中）创建一个git仓库，这个仓库用一个.git的文件夹表示的
       `  $ git init  `
  - 将本地文件提交到暂存区
       `  $ git add.  ` 将工程（项目）中所有的都存放到暂存区
         	` $ git add ./index.js ` 将工程（项目）中指定的放在暂存区
  - 将在暂存区的文件提交的仓库存储区
       `  $ git commit -m ' 对当前提交的文件说明 '  `
  - 查看提交日志
       `  $ git log `
  - 查看简洁版提交日志
       `  $ git log --oneline  `
  - **版本回退**
       `  $ git reset  -- hard HEAD  `   当前的版本
         	`  $ git reset --hard HEAD^  `  上一个版本
         	`  $ git reset --hard HEAD^^ `  上上一个版本
         	`  $ git reset --hard HEAD~100  `  往上100个版本
  -  **使用“git reset --hard 目标版本号”命令将版本回退：**
  - 进行文件修改的撤销
       `  $ git checkout -- 文件路径  `

4. git 分支管理
  -  git分支创建
    	`  $ git branch 分支名  `
  
  -  git分支的切换
    	`$ git checkout 分支名`
  -  发现在分支中也可以看到主分支的提交记录

  - 连接远程
    	`$ git push 远程仓库地址 分支名称`
  
  -  注意： 如果两个人同时操作了一个文件，这个时候就会有冲突，我们应该怎么办？
  -  解决： 先git pull , 然后在手动处理，然后在去提交

  -  为了解决每次都要书写远程url，我们可以给远程url写一个别名
    	`$ git remote add -m 别名 url`
    	`$ git push origin 分支名称`

  - 分支合并
    `$ git merge 分支名称`


### git 总结： 


1. git流程
   - 工作区 -> 本地仓库 -> 远程仓库
2. 分支
   - 先创建本地分支 -> 切换本地分支 -> 工作区操作 -> 远程分支

3. 主管改了主分支东西，你要重新更新 
4. 分支的合并
5. git 冲突解决
      - 先git pull 然后 手动选择 然后上传 

6. git 版本回退

