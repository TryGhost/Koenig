const path = require('path');
const glob = require('glob');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        'bundle.js': glob.sync('build/static/?(js|css)/main.*.?(js|css)').map(f => path.resolve(__dirname, f))
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'static/js/bundle.min.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [ 
        new CopyPlugin({
            patterns: [
                {from: './build/static/js/bundle.min.js', to: './umd/koenig-react.min.js'}
            ]
        })]
};
