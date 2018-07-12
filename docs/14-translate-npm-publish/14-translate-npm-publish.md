npm-publish
===

发布一个包。

## 概要

```
npm publish [<tarball>|<folder>] [--tag <tag>] [--access <public|restricted>] [--otp otpcode]

Publishes '.' if no argument supplied
Sets tag 'latest' if no --tag specified
```

## 描述

向远程仓库发布包，以便可以按包名安装。没有存在于本地 `.gitignore` 或 `.npmignore` 中的所有文件将会被包含进去。在 `.gitignore` 中声明但是不在 `.npmignore` 中声明的路径依然会被包含进去。参考 [npm-developers](https://docs.npmjs.com/misc/developers) 查看发布包包含的完整细节及其构建方式。

默认情况下 npm 会向公有仓库发布，可以通过重新默认指向仓库或使用 name 中的 [npm-scope](https://docs.npmjs.com/misc/scope) 来重写。

* `<folder>`：一个包含 package.json 的文件目录
* `<tarball>`：指向拥有单一目录并包含 package.json 文件的压缩包 url 或文件路径
* `[--tag <tag>]`: 根据指定标签注册发布包，例如 `npm install <name>@<tag>` 将会安装该版本。默认情况下 `npm publish` 进行更新的 以及 `npm install` 安装的都是最新版本。参考 [npm-dist-tag](https://docs.npmjs.com/cli/dist-tag) 参考更多细节。
* `[--access <public|restricted>]` 告知远程仓库是否公有化或受限发布。仅适用于设置 Scope 的包，默认为受限模式。
* `[--otp <otpcode>]` 
