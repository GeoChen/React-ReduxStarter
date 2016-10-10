/*
读取构建过程产生的js文件内容，保存到htmlWebpackPlugin.options.inlineChunk，
以便在HtmlWebpackPlugin的template中直接使用
*/
function InlinePlugin(options) {
  this.options = options
}

InlinePlugin.prototype.apply = function(compiler) {
  var inlineFile = this.options.name
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
        Object.keys(compilation.assets).forEach((key) => {
          if (key.indexOf(inlineFile) === 0 && key.indexOf('.map') === -1) {
            htmlPluginData.plugin.options.inlineChunk = compilation.assets[key].source()//作用：将部分模块放到内存中，通过
          }
        })
      callback(null, htmlPluginData)
    })
  })
}

module.exports = InlinePlugin
