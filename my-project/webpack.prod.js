'use strict'

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/search.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js'
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

        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /.less$/,
        // less-loader ⽤于将 less 转换成 css, 依然顺序是从右到左
        // 由于 MiniCssExtractPlugin 的功能和 style-loader 的功能是互斥的 所以要替换  上面也是一样
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', 
          'less-loader'
        ]
      },
      {
        test: /.(jpg|png|jpeg|gif)$/,
        // use: 'file-loader'
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:16].css'
    }),
  ]
}