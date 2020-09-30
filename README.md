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





### Loaders 加载器

#### 概念
webpack 开箱即用只支持 JS 和 JSON 两种文件类型，通过 Loaders 去支持其它文
件类型并且把它们转化成有效的模块，并且可以添加到依赖图中。

`本身是一个函数，接受源文件作为参数，返回转换的结果。`

而像前端生态中的 jsx  Vue template 都需要loaders去处理
Webpack原生不支持的，loaders帮助转换支持，才能加入到依赖图中去

#### 用法

```js
const path = require('path')
module.exports = {
  output: {
    filename: 'bundle.js'
  },
  // test => 匹配规则  use => 使用的loader 名称
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
}
```

### Plugins 插件

插件⽤于 bundle ⽂件的优化，资源管理和环境变量注⼊
作⽤于整个构建过程

可以理解：loaders没办法完成的事情 用Plugins去完成

plugins 可以作用于整个构建过程

HtmlWebpackPlugin 创建 html 文件去承载输出的 bundle。 不需手动添加 html
ZipWebpackPlugin 生成zip

#### 用法

```js
const path = require('path');
module.exports = {
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```

### Mode

Mode ⽤来指定当前的构建环境是：production、development 还是 none
设置 mode 可以使⽤ webpack 内置的函数，默认值为 production

Mode 内置函数功能

development => process.env.NODE_ENV = development
开启 NamedChunksPlugin & NamedModulesPlugin

production => process.env.NODE_ENV = production
开启 FlagDependencyUsagePlugin & FlagIncludedChunksPlugin, ...TerserPlugin



## 应用

### 解析ES6

使⽤ babel-loader  babel的配置⽂件是：.babelrc

```JS
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
+ module: {
+   rules: [
+   {
+     test: /\.js$/,
+     use: 'babel-loader'
+   }
+  ]
+ }
};
```

匹配.js 文件 使用 babel-loader   而 babel-loader 依赖 babel

其中两块重要的地方 presets + plugins
可以把 plugins 的每一项对应一个功能
presets 是一系列  babel plugins 的集合
`yarn add @babel/core @babel/preset-env babel-loader -D`
```js
{
"presets": [
  + "@babel/preset-env" // =》 增加 ES6 的 babel preset 配置
 ],
"plugins": [
  "@babel/proposal-class-properties"
 ] 
}
```

### 解析css less

### 解析图片、文件

file-loader 可以解析 图片和字体文件
url-loader 也可以解析 不同的是 可以设置较⼩资源⾃动 base64




### 文件监听

--watch 参数
或者 config.js => watch: true

#### ⽂件监听的原理分析

轮询判断⽂件的最后编辑时间是否变化
某个⽂件发⽣了变化，并不会⽴刻告诉监听者，⽽是先缓存起来，等 aggregateTimeout

```js
module.export = {
  //默认 false，也就是不开启
  watch: true,
  //只有开启监听模式时，watchOptions才有意义
  wathcOptions: {
    //默认为空，不监听的文件或者文件夹，支持正则匹配
    ignored: /node_modules/,
    //监听到变化发生后会等300ms再去执行，默认300ms
    aggregateTimeout: 300,
    //判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
    poll: 1000
  } 
}
```

> 但是以上都是需要手动刷新浏览器的。下面介绍热更新

### 热更新

#### 使⽤ webpack-dev-server

webpack-dev-serve + HotModuleReplacementPlugin

WDS 不刷新浏览器
WDS 不输出⽂件，⽽是放在内存中

#### 使⽤ webpack-dev-middleware

日常开发用得比较多

WDM 将 webpack 输出的⽂件传输给服务器
也就是我们的node 起的本地服务 类似localhost:8080
浏览器会和服务构建一个websocket服务，每当我们改变了代码，都会有个hotupdate文件，让浏览器更新。
适⽤于灵活的定制场景

<img src='./images/hot-update.png' />

### 文件指纹

什么是⽂件指纹？
打包后输出的⽂件名的后缀  可以用来做文件管理
下面的 51727db 就是文件指纹 修改过后的文件的指纹会修改，所以会被替换。
未修改的文件的指纹不变，利用浏览器缓存机制加速访问
```html
<script src='//11.url.cn/now//index_51727db.js'></script>
```

#### 文件指纹如何生成

Hash：和整个项⽬的构建相关，只要项⽬⽂件有修改，整个项⽬构建的 hash 值就会更改

Chunkhash：和 webpack 打包的 chunk 有关，不同的 entry 会⽣成不同的 chunkhash 值  ( js文件 )

Contenthash：根据⽂件内容来定义 hash ，⽂件内容不变，则 contenthash 不变   (其他：eg: css)


设置 output 的 filename，使⽤ [chunkhash]
JS 的⽂件指纹设置
```js
module.exports = {
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name][chunkhash:8].js',
    path: __dirname + '/dist'
  }
};
```
CSS 的⽂件指纹设置
设置 MiniCssExtractPlugin 的 filename，
使⽤ [contenthash]
因为平时项目中会用 css-loader style-loader
css-loader ⽤于加载 .css ⽂件，并且转换成 commonjs 对象
style-loader 将样式通过 <style> 标签插⼊到 head 中
所以这边  ` 使用 MiniCssExtractPlugin 把 css 文件独立出来 `
```js
module.exports = {
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name][chunkhash:8].js',
    path: __dirname + '/dist'
  },
  plugins: [
    new MiniCssExtractPlugin({ 
      filename: `[name][contenthash:8].css`
    });
  ]
};
```

| 占位符名称 | 含义 |
| :---: | :---: |
|[ext]|资源后缀名|
|[name]|文件名称|
|[path]|文件相对路径|
|[folder]|文件所在文件夹|
|[contenthash]|文件内容的hash 默认md5生成|
|[hash]|文件内容的hash 默认md5生成（这跟之前js文件指纹的hash不一样，这里也是文件内容hash）|
|[emoji]|一个随机的指代文件内容的emoji|

具体例子见 webpack.prod.js   commit => 2af89cd191fc96af31cef57ea5f335af51da8781

### 代码压缩

html压缩
css 压缩
js 压缩

### js 压缩

内置了 uglifyjs-webpack-plugin

### css 压缩

使⽤ optimize-css-assets-webpack-plugin
同时使⽤ cssnano  预处理器

```js
module.exports = {
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name][chunkhash:8].js',
    path: __dirname + '/dist'
  },
  plugins: [
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    })
  ]
};
```

### html 压缩

html-webpack-plugin

```js
new HtmlWebpackPlugin({
  // html对应模板所在的位置 可以使用ejs语法
  template: path.join(__dirname, 'src/search.html'),
  // 打包出来的文件名称
  filename: 'search.html', 
  // 要使用那些 chunk
  chunks: ['search'],
  // 把chunk自动注入html
  inject: true,
  minify: {
    html5: true,
    collapseWhitespace: true,
    preserveLineBreaks: false,
    minifyCSS: true,
    minifyJS: true,
    removeComments: false
  }
})
```

## Webpack 进阶用法

### 自动清理构建目录产物

1. 使用 npm scripts
rm -rf ./dist && webpack
2. Plugin ⾃动清理构建⽬录

使⽤ clean-webpack-plugin
默认会删除 output 指定的输出⽬录

```js
// 现在需要结构出来这个构造函数。之前是默认导出。现在改了，需要注意
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name][chunkhash:8].js',
    path: __dirname + '/dist'
  },
  plugins: [
    + new CleanWebpackPlugin()
  };
```
### postcss

css3 各大浏览器兼容

```css
.box {
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  -o-border-radius: 10px;
  border-radius: 10px;
}
```
autoprefixer 插件 
yarn add postcss-loader autoprefixer -D

```js
module.exports = {
  module: {
  rules: [
    {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader',
      ]
    + {
        + loader: 'postcss-loader',
        + options: {
          + plugins: () => [
            + require('autoprefixer')({
              + browsers: ["last 2 version", "> 1%", "iOS 7"]
            + })
          + ]
        + }
    + }
    ]}
  ]}
};
```


这里的话并没有跟老师同步。

1. 在根目录下创建 postcss.config.js
```js
module.exports = {
  plugins: [
      require('autoprefixer')
  ]
};
```
2. 在webpack.prod.js中
```js
use: [
  MiniCssExtractPlugin.loader,
  'css-loader', 
  'postcss-loader',
  'less-loader',
  // {
  //   loader: 'postcss-loader',
  //   options: {
  //     plugins: () => [
  //       require('autoprefixer')({
  //         // 1. 浏览器最近两个版本 2. 用户使用率 > 1% 3. ios 7 以上
  //         browsers: ['last 2 version', '>1%', 'ios 7']
  //       })
  //     ]
  //   }
  // },
]
```
3. package.json 中添加
```json
"browserslist": [
  "defaults",
  "not ie < 8",
  "last 2 versions",
  "> 1%",
  "iOS 7",
  "last 3 iOS versions"
],
```
### px => rem

W3C 对 rem 的定义： font-size of the root element
· rem 是相对单位
· px 是绝对单位

yarn add px2rem-loader -D
yarn add lib-flexible -S

### 资源内联

代码层⾯：
· ⻚⾯框架的初始化脚本
· 上报相关打点
· `css 内联避免⻚⾯闪动` html 同首页的 css 一同加载
请求层⾯：减少 HTTP ⽹络请求数
· ⼩图⽚或者字体内联 (url-loader)



raw-loader 内联 html
详见search.html hash = 62e4c604516266f36d65e832097d950eab22c2ab
yarn add raw-loader@0.5.1 -D
使用场景：
比如我们在开发移动端的时候，需要一大堆 meta 信息，这个时候我们就能将这些拆分出来 meta.html。然后内联
<script>${require(' raw-loader!babel-loader!. /meta.html')}</script>

raw-loader 内联 JS  babel-loader 进行一个转换
<script>${require('raw-loader!babel-loader!../node_modules/lib-flexible')}</script>

#### css 内联
方案1. 用 style-loader
```js
module.exports = {
  module: {
    rules: [
    {
      test: /\.scss$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            insertAt: 'top', // 样式插入到 <head>
            singleton: true, //将所有的style标签合并成一个
          }
        },
        "css-loader",
        "sass-loader"
      ],
    },
    ]
  },
};
```
方案2. html-inline-css-webpack-plugin

# ------     分界线 从这开始的demo 在 project-2 中演示     -------

## 多页面打包

每⼀次⻚⾯跳转的时候，后台服务器都会给返回⼀个新的 html ⽂档，
这种类型的⽹站也就是多⻚⽹站，也叫做多⻚应⽤

优势: 
1. 多个页面是解耦的。
2. 对SEO比较友好。

```js
module.exports = {
  entry: {
    index: './src/index/index.js',
    search: './src/search/index.js'
  }
};
```

利⽤ glob.sync  `yarn add glob -D`
```js
{
  entry: glob.sync(path.join(__dirname, './src/*/index.js'))
}
```
```js
const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = []
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
  Object.keys(entryFiles).map(
    index => {
      const entryFile = entryFiles[index]
      const match = entryFile.match(/src\/(.*)\/index\.js/)
      const pageName = match && match[1]
      entry[pageName] = entryFile
      htmlWebpackPlugins.push(new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false
        }
      }))
    })

  return {
    entry,
    htmlWebpackPlugins
  }
}
// 再将 entry 和 htmlWebpackPlugins 分别放入 entry 和 plugins
// 这样，之后再次添加页面就可以不用配置 Webpack 了
```

### Source Map

作⽤：通过 source map 定位到源代码
source map科普⽂：`http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html`

开发环境开启，线上环境关闭
· 线上排查问题的时候可以将 sourcemap 上传到错误监控系统\


1. eval: 使⽤eval包裹模块代码
2. source map: 产⽣.map⽂件
3. cheap: 不包含列信息
4. inline: 将.map作为DataURI嵌⼊，不单独⽣成.map⽂件 内联到JS 文件中
5. module: 包含loader的sourcemap

另外有一张  `source map 类型表` 在 ./images/source-map.png

```js
eval("\n\nif (false) {} else {\n  module.exports = __webpack_require__(4);\n}\n\n//# sourceURL=webpack:///./node_modules/react/index.js?")
```

这一小节就直接带过吧~


### 公共脚本分离 （react react-dom vue vue-router...）

思路：将 react、react-dom 基础包通过 cdn 引⼊，不打⼊ bundle 中
·⽅法1：使⽤ html-webpack-externals-plugin

```js
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

module.exports = {
  plugin: [
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          // 到 now 直播上扒下来的
          entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
          global: 'React'
        },
        {
          module: 'react-dom',
          entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
          global: 'ReactDOM'
        },
      ]
    })
  ]
}
```

方法2  利⽤ SplitChunksPlugin 进⾏公共脚本分离
是 Webpack4 内置强大的 插件 替代CommonsChunkPlugin插件


chunks 参数说明
async 异步引⼊的库进⾏分离(默认)  => 比如说 ES6 中的 import  import React from 'react'
initial 同步引⼊的库进⾏分离  => 同步 import ?
all 所有引⼊的库进⾏分离(推荐)
```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'async',
      // 单位: 字节
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      // 浏览器同时请求的数量
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  }
};
```

```js
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /(react|react-dom)/,
          name: 'vendors',
          chunks: 'all'
        } 
      } 
    } 
  }
};
```

`利⽤ SplitChunksPlugin 分离⻚⾯公共⽂件`

```js
// minChunks: 设置最⼩引⽤次数为2次
// minuSize: 分离的包体积的⼤⼩
module.exports = {
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        } 
      } 
    } 
  }
}
```

### Tree Shaking 摇树优化

概念：1 个模块可能有多个⽅法，只要其中的某个⽅法使⽤到了，则整个⽂件都会被打到bundle ⾥⾯去，tree shaking 就是只把⽤到的⽅法打⼊ bundle ，没⽤到的⽅法会在uglify 阶段被擦除掉。
使⽤：webpack 默认⽀持，在 `.babelrc ⾥设置 modules: false` 即可
当 `mode: production => tree shaking` 自动开启
要求：必须是 `ES6` 的语法，CJS 的⽅式不⽀持

#### DCE (Dead code elimination)

1. 代码不会被执⾏，不可到达
2. 代码执⾏的结果不会被⽤到
3. 代码只会影响死变量（只写不读）

#### 原理

利⽤ ES6 模块的特点:
  · 只能作为模块顶层的语句出现
  · import 的模块名只能是字符串常量
  · import binding 是 immutable的
并不像 require 一样可以根据条件来引入模块。
代码擦除： uglify 阶段删除⽆⽤代码

本质：`就是对代码的一个静态的分析，不能等到编译阶段再做这个操作，所以它是依赖 ES6 模块的。经过这么一个静态的分析，给没有用到的代码进行一个注释，在 uglify 阶段把无用代码删除。`


### scope hoisting

webpack mode 为 production 默认开启  ModuleConcatenationPlugin
必须是 ES6 语法，CJS 不⽀持 
现象：构建后的代码存在⼤量闭包代码

会导致什么问题？
1. ⼤量作⽤域包裹代码，导致体积增⼤（模块越多越明显）
2. 运⾏代码时创建的函数作⽤域变多，内存开销变⼤

```js
import { helloworld } from './helloworld'
import '../../common'
document.write(helloworld())
```

转换为

模块初始化函数
```js
(function (module, __webpack_exports__, __webpack_require__) {
  'use strict'
  __webpack_require__.r(__webpack_exports__)
})
```
· 被 webpack 转换后的模块会带上⼀层包裹
· import 会被转换成 __webpack_require


### 代码分割  chunks

对于大的 Web 应用来说，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码块是在某些特俗的时候才会被用到。
Webpack 有一个功能就是将你的代码库分割成 `chunks(语块)`， 当代码运行到需要他们的时候在进行加载。

适用场景：

1. 抽离相同代码到一个共享块
2. 脚本懒加载，使得初始下载的代码更小

#### 懒加载 JS 脚本的⽅式

CommonJS：require.ensure
ES6：动态 import（⽬前还没有原⽣⽀持，需要 babel 转换）

如何使⽤动态 import?
安装 babel 插件  即可不限制 import 语法在模块的顶端，也可以在 if else 语块中
`npm install @babel/plugin-syntax-dynamic-import --save-dev`
实践过程中报错，需要安装
`yarn add @babel/plugin-proposal-class-properties -D`
然后把 `@babel/plugin-proposal-class-properties` 同样放到 .babelrc 的 plugins 中即可
ES6：动态 import（⽬前还没有原⽣⽀持，需要 babel 转换）
```js
{
  "plugins": ["@babel/plugin-syntax-dynamic-import"],
  ...
}
```

#### 代码分割的效果

通过 plugins 动态引入模块，该模块会被分离出去，当需要该模块的时候再请求，达到一个懒加载的效果。


