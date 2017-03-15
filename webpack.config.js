var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    //页面入口文件配置
    entry: {
        common : './_src/js/common.js',
        editor:'./_src/js/editor.js'
    },
    //入口文件输出配置
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'js/[name].js'
    },
    //插件项
    plugins: [
        new ExtractTextPlugin("css/[name].min.css")
    ],
    module: {  // 这个是引入的模块，可以用来做一些其他的事儿
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            { test: /\.(png|jpg|jpeg|gif|woff)$/, loader: 'url-loader?limit=10240&name=/images/[hash:8].[name].[ext]'}
        ]
    }
};