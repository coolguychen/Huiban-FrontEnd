# Huiban-FrontEnd
## React + VS Code + Git

因为项目中还没有安装依赖，第一次运行需要通过以下的命令安装 node_modules

`npm install`

1. 本地搭建脚手架

先创建一个空文件夹/工作区

```powershell
npm install -g create-react-app    //安装
create-react-app react-demo    // react-demo 项目的名称
cd react-demo   //cd  进入下一级
npm start    //npm run start
```

Compiled successfully 之后，打开浏览器，输入 http://localhost:3000 访问项目的页面

2. `git init ` 把这个文件夹变成 Git 可管理的仓库
3. 在 github 上创建一个仓库：[https://github.com/coolguychen/Huiban-FrontEnd](https://github.com/coolguychen/Huiban-FrontEnd)
4. 将 GitHub 上的仓库和本地仓库进行关联：

用法: git remote add [<options>] <name> <url>

`git remote add origin git@github.com:coolguychen/Huiban-FrontEnd.git`（注：此处用的是 SSH 下的地址）

5. 将代码提交到本地仓库

```bash
git add .    
git commit -m "提交内容"
```
6. 提交代码

`git push -u origin master`

## Git 协同开发

### 准备工作

1. 在本地随便选一个文件夹，用于存放这个项目代码，比如 Document
2. 打开控制台，进入这个文件夹的目录，比如 cd Document
3. 输入以下命令，可以下载代码到本地，以及将本地文件夹与 github 仓库关联到一起。下载后该文件夹里会新增一个文件夹 huiban-frontend

```
git clone https://github.com/coolguychen/Huiban-FrontEnd
```

1. 在控制台中，进入这个下载下来的项目文件

```
cd huiban-frontend
```

1. 使用下列命令查看是否与 github 仓库关联成功

```
git remote -v
// 如果结果如下，说明关联成功
/huiban-frontend > git remote -v
origin  git@github.com:coolguychen/Huiban-FrontEnd.git (fetch)
origin  git@github.com:coolguychen/Huiban-FrontEnd.git (push)
```

### 使用分支协同开发

#### 创建分支

打开 VS Code 上方菜单的 Terminal，再次确认 Terminal 在项目文件的目录中

/Documents/huiban-frontend >

每次创建分支之前，首先保证本地 origin 的代码是最新的，把最近的远程代码拉到本地，不然后面会有点混乱

`git pull`

创建你自己的分支，后面是分支的名字，可以自己取，以「名字/修改的功能」命名比较好

`git branch cyh/create_home_page`

可以查看现在仓库一共有哪些分支

`git branch -a`

按 q 退出

切换到你现在的分支当中，后面名字是你自己刚刚创建的

`git checkout cyh/create_home_page`

#### 提交代码

代码当中有修改

`git add .` 添加所有修改了的文件

`git status` 保证所有文件都是绿色

`git commmit -m "这里写注释"`

`git push --set-upstream origin cyh/create_home_page`

push 成功之后打开远程仓库的网址 ， 就可以看到最顶部多了一个绿色的按钮 "Create Pull Request"，点击这个按钮，创建 Pull Request，这样管理员后台收到这个 PR，就可以把它合进去

### 不使用分支协同开发

1. **确保本地 master 分支是最新的：**

```bash
git checkout master
git pull origin master
```

2. **添加所有修改的文件并提交：**

```bash
git add .
git commit -m "提交的注释"
```

3. **推送更改到远程的 master 分支：**

```bash
git push origin master
```

- **谨慎操作：** 直接在 master 分支上进行更改并推送可能会导致团队合作中的问题，因此请确保您了解自己的操作何时影响其他团队成员，以免造成冲突或困扰。

### 一些注意

前台代码放在 pages_front 文件夹

后台代码放在 pages_back 文件夹

每个页面都被放在不同的 page 里的文件夹里面，因此不同的模块的开发过程应该不会相互干扰，但是不排除有时候会修改一些 global 的配置，比如 package.json、静态资源等等，如果有全局的改变，尽快上传到远端。
