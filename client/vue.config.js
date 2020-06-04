const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'assets',
    lintOnSave: false,
    runtimeCompiler: true,
    productionSourceMap: false,
    chainWebpack: config => {

        // https://vue-loader.vuejs.org/options.html#compileroptions
        config.module
            .rule('vue')   // Create named rules which can be modified later
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {   //modifying options
                options.compilerOptions.whitespace = 'preserve'
                return options
            })
            .end()

        // https://github.com/neutrinojs/webpack-chain  when(condition, whenTruthy, whenFalsy)
        config
            .when(process.env.NODE_ENV === 'development',
                config => { config.devtool('cheap-source-map') },

                // https://webpack.js.org/plugins/split-chunks-plugin/
                config => {
                    config.optimization.splitChunks({
                        chunks: 'all',
                        cacheGroups: {
                            commons: {
                                test: /[\\/]node_modules[\\/]/,
                                name: 'chunk-vendors',
                                priority: 10,
                                chunks: 'initial'
                            },
                            elementUI: {
                                name: 'chunk-elementUI',
                                priority: 20,
                                test: /[\\/]node_modules[\\/]_?element-ui(.*)/  // in order to adapt to cnpm
                            }
                        }
                    })
                }
            )

    },
    configureWebpack: {
        /*
         * provide the app's title in webpack's name field, so that
         * it can be accessed in index.html to inject the correct title.
         */
        name: 'KS-System',
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    devServer: {
        open: true,
        host: 'localhost',
        port: 8899,
        https: false,
        hotOnly: false,
        proxy: {
            '/api': {
                target: 'http://localhost:3000/',
                ws: true,
                changOrigin: true,
                pathRewrite: {

                    /**
                     * @edu the caret [ ^ ], which matches the complete original URL
                     * bellow path will go to 'http://localhost:3000/api'
                     * '^/api': '/' path will go to 'http://localhost:3000/'
                     * if target with 'api' should be '^/api': '/'
                     */
                    '^/api': '/api'
                }
            }
        }
    }
}
