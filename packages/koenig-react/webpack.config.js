const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const glob = require('glob');

module.exports = {
    mode: 'production',
    entry: {
        'bundle.js': glob.sync('build/static/?(js|css)/main.*.?(js|css)').map(f => path.resolve(__dirname, f))
    },
    output: {
        filename: 'koenig-react.min.js',
        path: __dirname + '/dist/umd'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [new UglifyJsPlugin()]
};