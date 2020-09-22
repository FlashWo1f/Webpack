'use strict'

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

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
          'postcss-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              // 1rem = 75px
              // px 转 rem 结果小数点后面的位数
              remPrecision: 8
            }
          },
          // less-loader 顺序必须放在前几个loader的后面 不然报错
          'less-loader',
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
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
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
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html', 
      chunks: ['index'],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }),
    new CleanWebpackPlugin()
  ]
}