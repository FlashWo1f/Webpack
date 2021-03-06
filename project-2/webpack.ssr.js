'use strict'

const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = []
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'))
  Object.keys(entryFiles).map(
    index => {
      const entryFile = entryFiles[index]
      const match = entryFile.match(/src\/(.*)\/index-server\.js/)
      const pageName = match && match[1]
      if (!pageName) return;
      entry[pageName] = entryFile
      htmlWebpackPlugins.push(new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        // 好像下面这个加不加 vendors 都无所谓
        chunks: ['vendors', pageName],
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
const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-server.js',
    libraryTarget: 'umd'
  },
  mode: 'production',
  optimization: {
    // splitChunks: {
    //   cacheGroups: {
    //     commons: {
    //       test: /(react|react-dom)/,
    //       name: 'vendors',
    //       chunks: 'all'
    //     }
    //   }
    // }
    splitChunks: {
      // 单位 bytes
      minSize: 0,
      cacheGroups: {
        // 公共模块拆分
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        } 
      } 
    } 
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8
            }
          },
          'less-loader',
        ]
      },
      {
        test: /.(jpg|png|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
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
    new CleanWebpackPlugin(),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       // 到 now 直播上扒下来的
    //       entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
    //       global: 'React'
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
    //       global: 'ReactDOM'
    //     },
    //   ]
    // })
  ].concat(htmlWebpackPlugins)
}
