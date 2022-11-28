module.exports = {
    plugins: ['ghost'],
    extends: [
        'plugin:ghost/node'
    ],
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true
    }
};
