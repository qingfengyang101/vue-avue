// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

//baseUrl = 'http://192.168.124.170:8080/'
// baseUrl = 'http://localhost:8080/'
baseUrl = 'http://121.89.209.125:8080';
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8008,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    host: 'localhost',
    assetsPublicPath: '/',
    proxyTable: {
      '/auth': {
        target: baseUrl,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/auth': '/auth'
        }
      },
      '/admin': {
        target: baseUrl,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/admin': '/admin'
        }
      },
      '/api': {
        target: baseUrl,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': ''
        },
        logLevel: 'debug'
      }
    },
    cssSourceMap: false
  }
}
