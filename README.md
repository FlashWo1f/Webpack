# Webpack

https://www.webpackjs.com/

## 2020/9/9

### 为什么选择Webpack

1. 社区活跃
2. 配置灵活  插件化扩展
3. 官方更新迭代速度快
4. 废话不多说

### 初识 webpack

默认配置文件 webpack.config.js
也可以通过 webpack --config 指定配置文件  主要应用在 多环境运用多  config.js


## 核心概念

### Entry 入口

#### 概念

用来指定 Webpack 的打包入口

为啥需要这么一个入口。

因为webpack将 js代码 css代码 或者说一些非代码文件 例如图片...当作一个模块
模块之间存在依赖关系。
然后根据入口文件找到依赖。
而依赖文件又有其他依赖，这样就形成了一颗依赖树
最终遍历完成 加载所有需要的模块

#### 用法

1. 单入口 字符串
适用于单页应用
```json
  {
    "entry": "./path/to/my/entry/file.js"
  }
```

2. 多入口  对象

```json
  {
    "entry": {
      "app": "./path/to/my/entry/file.js",
      "admin": "./src/app.js"
    }
  }
```

### Output 出口

Output 用来告诉 Webpack 如何将编译后的文件输出到磁盘

#### 用法

对于单入口 只需要文件名和对应的位置即可 __dirname 绝对路径

```json
{
  "output": {
    "filename": "bundle.js",
    "path": __dirname + "/dist"
  }
}
```

多入口的output

```js
module.exports = {
  entry: {
    app: "./path/to/my/entry/file.js",
    admin: "./src/app.js"
  },
  output: {
    filename: '[name].js', // 利用占位符
    path: __dirname + "/dist"
  }
}
```