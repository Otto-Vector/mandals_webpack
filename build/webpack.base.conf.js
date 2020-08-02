const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// Main const
const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  long: {
    fonts: path.resolve(__dirname, '../src/assets/fonts/'),
    images: path.resolve(__dirname, '../src/assets/img/'),
  },
  short: {
    js: 'assets/js/',
//    css: 'assets/css/',
    images: 'assets/img/',
    fonts: 'assets/fonts/',
  },
};


// Pages const for HtmlWebpackPlugin
const PAGES_DIR = `${PATHS.src}/pug`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

////////////////////////////////////////////////////////////////
module.exports = {
  // BASE config
  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src,
    // module: `${PATHS.src}/your-module.js`,
  },
  resolve: {
    alias: {
//      '~': 'src',
      '@images': PATHS.long.images,
      '@fonts' : PATHS.long.fonts,
    }
  },
  output: {
    filename: `${PATHS.short.js}[name].[hash].js`,
    path: PATHS.dist,
//    publicPath: '/' //для dev режима?
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules:
    [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    }, {
      test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      options: {
        outputPath: PATHS.short.fonts,
        name: '[name].[ext]'
      }
    }, {
       test: /\.(png|jpg|gif|ico)$/,
      loader: 'file-loader',
      options: {
        outputPath: PATHS.short.images,
        name: '[name].[ext]'
      }
    }, { //обработчик sass/scss
      test: /\.(scss|sass)$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `./postcss.config.js` }, }
        }, {
          loader: 'sass-loader',
          options: { sourceMap: true, }
        }
      ]
    }, { //обработка pug файлов
      test: /\.pug$/,
      loader: 'pug-loader'
    }
    ]
  },
  plugins:
  [
    new MiniCssExtractPlugin({
//      filename: `${PATHS.short.css}[name].[hash].css`,
      filename: `[name].[hash].css`, //css ложим в корень dist, потому что непонятно как вписать относительные пути для шрифтов и картинок из цсс
    }),
    // new webpack.ProvidePlugin({ //плагин для того, чтобы не надо было импортировать jquery и прочие библиотеки в каждый файл
    //   $ :     "jquery",
    //   jQuery: "jquery",
    // }),
    new CopyWebpackPlugin([
     // { from: `${PATHS.src}/${PATHS.short.images}`, to: `${PATHS.short.images}` },
     // { from: `${PATHS.src}/${PATHS.short.fonts}`, to: `${PATHS.short.fonts}`,
    // { from: `${PATHS.src}/static`, to: '' },
    ]),
    // Automatic creation any html pages (Don't forget to RERUN dev server)
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/,'.html')}`
    }))
  ],
};
