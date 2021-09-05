// 这个文件是我们自己创建的配置文件，目的是为了配置路径别名，配这些路径别名是因为这些路径是
// 经常引用到的文件，配置之后引用起来会比较方便，提高开发效率


// 在脚手架3以后，会把基本配置文件隐藏起来（放到了node_modules文件夹中，base.config.js），这里创建的vue.config.js配置文件会把内容合并到
// 隐藏的基本配置文件里面

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}