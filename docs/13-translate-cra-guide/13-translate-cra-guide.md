Create React App User Guide
===

## Proxying API Requests in Development

> 注意：该功能仅适用于 `react-scripts@0.2.3` 及更高版本

我们经常通过后端方式实现相同域名、端口下的前端 React App 服务。
例如， 应用部署在生产环境后的配置可能是这样的：

```
/              - 静态服务，返回 React App 的 index.html
/todos         - 静态服务，返回 React App 的 index.html
/api/todos     - 服务，后端实现处理 /api/* 请求
```

这种配置是非必需的。当然，如果确实做了这个配置，那么我们在开发时写类似 `fetch('/api/todos')` 的请求时不必担心它们被重定向到其他域名或端口。

通过向 `package.json` 中添加 `proxy` 字段来告知本地服务器去代理任何未知请求到本地 API 服务，例如：

```
"proxy": "http://localhost:4000",
```

通过这种方式，当在本地开发环境 `fetch(/api/todos)`，本地服务器会识别它不是一个静态资源，然后代理该请求到 `http://localhost:4000/api/todos`。
本地服务器会只发送请求头中 `Accept` 不为 `text/html` 的请求到代理服务。
顺便，这样也避免了 CORS 问题和开发时的这种错误提示：

```
Fetch API cannot load http://localhost:4000/api/todos. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:3000' is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

请牢记这里的 `proxy` 仅影响本地开发环境（通过 `npm start`），至于生产环境的类似 `/api/todos` URL 指向依然需要我们去确保。不必强制使用 `/api` 前缀，
任何未识别的 `Accept` 不为 `text/html` 的请求均会重定向到指定的 `proxy`。

`proxy` 选项支持 HTTP、HTTPS 和 WebSocket 连接。
如果 `proxy` 选项对您的使用依然不够灵活，以下文章可供参考：

* [自定制 proxy 配置](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#configuring-the-proxy-manually)
* 允许服务器 CORS ([here’s how to do it for Express](https://enable-cors.org/server_expressjs.html))
* 使用 [环境变量](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables) 为应用注入对应的域名和端口

#### "Invalid Host Header" Errors After Configuring Proxy

暂无翻译

#### Configuring the Proxy Manually

> 注意：该功能适用于 `react-scripts@1.0.0` 及更高版本

如果 `proxy` 选项对您来说依然不够灵活，您可以单独指定一个对象作为配置项（在 `package.json` 中）。也会会同样配置一些
[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#options) 和 [http-proxy](https://github.com/nodejitsu/node-http-proxy#options) 支持的配置项

```
{
  // ...
  "proxy": {
    "/api": {
      "target": "<url>",
      "ws": true
      // ...
    }
  }
  // ...
}
```

所有匹配到该路径的请求无一例外都将会被代理，这也包括 `text/html` 这种标准 `proxy` 选项不会代理的请求。

可以通过配置额外入口来指定多个代理，匹配规则为正则表达式。

```
{
  // ...
  "proxy": {
    // Matches any request starting with /api
    "/api": {
      "target": "<url_1>",
      "ws": true
      // ...
    },
    // Matches any request starting with /foo
    "/foo": {
      "target": "<url_2>",
      "ssl": true,
      "pathRewrite": {
        "^/foo": "/foo/beta"
      }
      // ...
    },
    // Matches /bar/abc.html but not /bar/sub/def.html
    "/bar/[^/]*[.]html": {
      "target": "<url_3>",
      // ...
    },
    // Matches /baz/abc.html and /baz/sub/def.html
    "/baz/.*/.*[.]html": {
      "target": "<url_4>"
      // ...
    }
  }
  // ...
}
```

## Adding Custom Environment Variables

> 注意：该功能适用于 `react-scripts@0.2.3` 及更高版本

在项目中我们可以像操作 js 本地变量一样操作环境变量，默认情况下可以使用已定义的 `NODE_ENV` 和其他以 `REACT_APP_` 开头的环境变量。

**环境变量的嵌入是在 build 阶段进行的。**由于 Create React App 产生静态的 HTML/CSS/JS 打包文件，因此无法在运行时取环境变量。如果想在运行时取它们，需要将 HTML 入服务器缓存并在运行时进行替换，参考[这里](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#injecting-data-from-the-server-into-the-page)。可以在任何改变环境变量时重新在服务器 Build。

> 注意：自定义的环境变量要以 `REACT_APP_` 开头，其他除了 `NODE_ENV` 以外的变量都将被忽略，以避免意外的 [命名冲突](https://github.com/facebook/create-react-app/issues/865#issuecomment-252199527)。改变任何环境变量需要重启在运行的本地服务。

这些环境变量会被定义在 `process.env`。例如，命名为 `REACT_APP_SECRET_CODE` 的环境变量会被在 JS 中暴露为 `process.env.REACT_APP_SECRET_CODE`。

`NODE_ENV` 是特殊的内置环境变量，可以从 `process.env.NODE_ENV` 中去取。当执行 `npm start` 时，它等于 `development`，当执行 `npm test` 时，它等于 `test`，当执行 `npm run build` 打生产包时，它等于 `production`。注意**`NODE_ENV` 无法被手动重写。**这样防止开发者部署生产环境打包过慢。

这些环境变量对于展示部署信息和引用脱离版本控制外的敏感数据非常有用。

首先，需要确保环境变量已定义。例如，我们在 `<form>` 中引用一个隐秘的变量定义：

```
render() {
  return (
    <div>
      <small>You are running this application in <b>{process.env.NODE_ENV}</b> mode.</small>
      <form>
        <input type="hidden" defaultValue={process.env.REACT_APP_SECRET_CODE} />
      </form>
    </div>
  );
}
```

打包期间，`process.env.REACT_APP_SECRET_CODE` 会被替换为当前环境变量 `REACT_APP_SECRET_CODE` 的值。注意 `NODE_ENV` 变量值将会被自动设置。

从浏览器端加载应用检查 `<input>` 后，会发现它的值被设置为 `abcdef`，并且当执行 `npm start` 后加粗字体会显示当前环境变量：

```
<div>
  <small>You are running this application in <b>development</b> mode.</small>
  <form>
    <input type="hidden" value="abcdef" />
  </form>
</div>
```

上面强调从当前环境取 `REACT_APP_SECRET_CODE` 变量。为了引用到该变量，我们首先要确保该变量在环境中被定义。可以通过两种方式定义环境变量：在 `shell` 或 `.env` 文件中定义。这两种定义方式后文作详细介绍。

访问 `NODE_ENV` 对于有条件地去执行动作非常有用：

```
if (process.env.NODE_ENV !== 'production') {
  analytics.disable();
}
```

使用 `npm run build` 进行编译时，压缩环节会跳过该场景，打包后的文件体积会更小。

#### 在 HTML 中引用环境变量

> 注意：该功能适用于 `react-scripts@0.9.0` 及更高版本

我们可以在 `public/index.html` 中注入以 `REACT_APP_` 开头的环境变量。例如：

```
<title>%REACT_APP_WEBSITE_NAME%</title>
```

重点注意：

* 与内置环境变量（`NODE_ENV` 和 `PUBLIC_URL`）所不同的是，自定义的变量名必须以 `REACT_APP_` 开头；
* 环境变量的注入是在打包编译阶段进行的，如果需要在运行时注入，[请参考这里](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#generating-dynamic-meta-tags-on-the-server)

#### 在 Shell 中添加局部环境变量

在不同系统中定义环境变量有所差异。另外这种方式变量是临时存在于 shell 的会话期间的。

###### windows(cmd.exe)

```
set "REACT_APP_SECRET_CODE=abcdef" && npm start
```

(注意：变量周围的引号是必需的，以避免尾空格)

###### Windows(Powershell)

```
($env:REACT_APP_SECRET_CODE = "abcdef") -and (npm start)
```

###### Linux, macOS (Bash)

```
REACT_APP_SECRET_CODE=abcdef npm start
```

## 参考资源

* [create-react-app user guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md)
