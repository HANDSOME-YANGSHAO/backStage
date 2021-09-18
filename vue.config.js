// 这个文件是我们自己创建的配置文件，目的是为了配置路径别名，配这些路径别名是因为这些路径是
// 经常引用到的文件，配置之后引用起来会比较方便，提高开发效率

// 在脚手架3以后，会把基本配置文件隐藏起来（放到了node_modules文件夹中，base.config.js），这里创建的vue.config.js配置文件会把内容合并到
// 隐藏的基本配置文件里面

// webpack有两种配置方法，一种是configureWebpack特点是直接操作对象，第二种是chainWebpack特点是链式配置(这里两者都用到了，可见不会冲突最后会合并到一起)
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
  },
  chainWebpack: config => {
    // 生产模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // 生产模式打包入口文件
      config.entry('app').clear().add('./src/main-prod.js')
      // externals 这里我的理解是：在生产环境下面，进行相关的优化，因为这些库比较大，并且都会统一打包到  dist\js\chunk-vendors.6fd8e34b.js  
      // 这个js文件种，导致js文件体积过大，用户在使用的时候，网速不好可能会陷入假死状态，因为js文件还没有请求过来可能无法进行相关的操作或者页面
      // 相关数据的渲染，所以在打包生产环境项目文件的时候，可以配置externals，当webpack看到externals节点的时候，就不会把这些本地下载的库都打包到那个js
      // 文件里面去，换成CDN引入
          // 优点：
            // 1：项目更加轻量级，用户向服务器发送请求，服务器做出响应的时候更快用户体验更好
            // 2：分担了服务器的压力，用户向服务器请求的主要是页面和相关的逻辑业务核心代码，相关的第三方库都采用CDN向其它服务器请求，并且人家
            //    是专业的，响应速度还很快
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        axios: 'axios',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor',
        echarts: 'echarts'
      })
      // 在打包时，根据现在是开发模式还是生产模式，给htmlPlugin对象的配置项添加上一个具体参数，到时候根据添加的args[0].isProd的情况分
      // 情况去让index.html是否普加载那些CDN引入，开发模式就用本地的，不用CDN，生产模式的就去加载那些CDN资源
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      // 开发模式的打包入口文件
      config.entry('app').clear().add('./src/main-dev.js')
      // 开发模式的
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}