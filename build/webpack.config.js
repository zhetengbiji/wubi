var path = require('path')
var webpack = require('webpack')
module.exports = {
    entry: path.join(__dirname, '../src/index.js'),
    output: {
        path: path.join(__dirname, '../out'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
}