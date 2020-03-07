module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'no-console': 'error',
        'no-empty': 'error',
        'semi': ['error', 'never'],
        'semi-spacing': ['error', {
            before: false,
            after: true
        }],
        'lines-around-comment': ['error', {
            'beforeBlockComment': true
        }],
        'line-comment-position': ['error', { 'position': 'above' }],
        'multiline-comment-style': ['error', 'starred-block'],
        'spaced-comment': ['error', 'always'],
    },
    overrides: [{
        files: ['server.js'],
        rules: {
            'no-console': 0
        }
    }]
}