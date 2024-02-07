module.exports = {
    plugins: ['ghost'],
    extends: [
        'plugin:ghost/node',
        'plugin:ghost/ts'
    ],
    env: {
        browser: true,
        node: true
    },
    // this fouls up with Lexical's need to prefix with '$' for lifecycle hooks
    rules: {
        'ghost/filenames/match-exported-class': 'off'
    }
};