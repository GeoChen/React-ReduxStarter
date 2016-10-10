var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var lodash = require('lodash');
let InlineWebpackPlugin = require('./inline-webpack-plugin')
let CleanWebpackPlugin = require('clean-webpack-plugin')

var languages = {
  'en_US': {title: "SMS Trash", htmlLang: 'en-US'},
  'zh_TW': {title: "簡訊回收站", htmlLang: 'zh-TW'},
  'zh_CN': {title: "短信回收站", htmlLang: 'zh-CN'}
};
const NODE_ENV = process.env.NODE_ENV
const CDN_PATH = 'https://static.micloud.xiaomi.net/sms-trash-archive/'

var config = {
  entry: {
    'app': [
      './src/index.js'
    ],
    'vendor': ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk',
      'react-intl', 'isomorphic-fetch', 'tiny-cookie', 'es6-promise', 'immutable'
    ],
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: NODE_ENV === 'production' ? '[name].[chunkhash].js' : '[name].js',
    chunkFilename: NODE_ENV === 'production' ? '[name].[chunkhash].js' : '[name].js',
    publicPath: NODE_ENV === 'production' ? `${CDN_PATH}`: '',
  },
  module: {
    loaders: [
      {
        test: /\.js?/,
        loaders: ['babel'],
        exclude: /node_modules/
      }, {
        test: /\.css?/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
        include: path.join(__dirname, 'src/assets'),
        exclude: /node_modules/
      },
      { 
        test:/\.png?/, 
        loader: "url-loader?limit=8192",
        exclude: /node_modules/
      } 
    ]
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'webpack-runtime'],
      minChunks: Infinity,
    }),    
    new ExtractTextPlugin('[name].css', {
      disable: false,
      allChunks: true
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.IgnorePlugin(/^\.\/locale$/),
    new webpack.NamedModulesPlugin(),
    new InlineWebpackPlugin({name: 'webpack-runtime'}),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'index.html'),
      filename: 'index.html',
      chunks: ['vendor', 'app' ],
      chunksSortMode: function(a,b) {
        //messages排在首位
        if (a.names[0].indexOf('messages') >= 0) {
          return -1
        } else if (b.names[0].indexOf('messages') >= 0) {
          return 1
        }
        return 0
      },
      title: "index",
      // lang: "zh-CN",
      minify: false
    })
  ],

}
// let uglifyJsConfig = {
//   compress: { warnings: false },
// }

// if (NODE_ENV === 'production') {
//   let plugins = config.plugins
//   plugins.unshift(new webpack.DefinePlugin({
//     'process.env': {
//       'NODE_ENV': JSON.stringify('production'),
//     },
//   }))
//   // DedupePlugin不能用在watch mode中。
//   // 参考：http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
//   //DedupePlugin和NamedModulesPlugin冲突，去掉DedupePlugin，
//   //正常情况下，js中引用的css文件会编译为{a.css: function{},b.css:function{}}，
//   //但使用DedupePlugin后，上述文件编译为 {a.css:c.css, b.css:c.css, ...}，
//   //运行时找不到a.css和b.css报错:Cannot read property 'call' of undefined，
//   //另外，对于本项目，不使用和使用DedupePlugin得到的js文件大小几乎没有差别
//   // plugins.push(new webpack.optimize.DedupePlugin())
//   // plugins.push(new webpack.optimize.OccurenceOrderPlugin())
//   plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyJsConfig))
// }

module.exports = config
