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
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "es2015"
                        ]
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
}