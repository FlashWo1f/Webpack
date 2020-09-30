const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    'large-number': './src/index.js',
    'large-number.min': './src/index.js'
  },
  // 不设置为 none 的话 会默认压缩
  mode: 'none',
  output: {
    filename: '[name].js',
    library: 'largeNumber',
    libraryTarget: 'umd',
    // 必要：为了引用简洁
    libraryExport: 'default'
  },
  optimization: {
    minimize: true,
    minimizer: [
      // 推荐使用 TerserPlugin 压缩顺便把 ES6 做了处理
      new TerserPlugin({
        include: /\.min\.js$/,
      }),
    ],
  }
}
