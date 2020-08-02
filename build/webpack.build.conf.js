const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//удалятор

const buildWebpackConfig = merge(baseWebpackConfig, {
  // BUILD config
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin() //зачистка
    ]
})

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig)
})
