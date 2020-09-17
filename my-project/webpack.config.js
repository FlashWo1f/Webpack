'use strict'

const path = require('path')

module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/search.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'production',
  module: {
    rules :[
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        // loader 是链式调用的，从右到左的顺序，所以是先用 css-loader 然后 style-loader
        // 把 css-loader 解析出来的 传给 style-loader
        // css-loader ⽤于加载 .css ⽂件，并且转换成 commonjs 对象
        // style-loader 将样式通过 <style> 标签插⼊到 head 中

        use: ['style-loader', 'css-loader']
      },
      {
        test: /.less$/,
        // less-loader ⽤于将 less 转换成 css, 依然顺序是从右到左
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  }
}