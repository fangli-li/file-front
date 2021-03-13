const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    // 区分打包环境与开发环境
    // process.env.NODE_ENV==='production'  // (打包环境)
    // process.env.NODE_ENV==='development' // (开发环境)
    // baseUrl: process.env.NODE_ENV==='production'?"https://cdn.didabisai.com/front/":'front/',

    baseUrl: process.env.NODE_ENV==='production'?"http://testihospital.doctoradmin.ebaiyihui.com":'./',  //  用用程序默认部署位置，‘/’根目录，存放子目录ex：‘/web/’
    outputDir: 'dist',  // 输出文件目录
    devServer: {
        proxy: {
            '/api': {
                //   // target: 'http://192.168.0.159:8080',
                //   // target: 'http://192.168.0.180:8080',
                //   // target: 'http://ihospital.doctoradmin.ebaiyihui.com',
                target: 'http://101.200.164.208:8080',
                ws: true,
                changeOrigin:true,//允许跨域
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    //  将接收ChainableConfig由webpack-chain提供支持的实例的函数。
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('style', resolve('src/assets/style'))
            .set('img', resolve('src/assets/img'))
            .set('components', resolve('src/components'))
    }
};