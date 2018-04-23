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



## 参考资源

* [create-react-app user guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md)
