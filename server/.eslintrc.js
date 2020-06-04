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
    overrides: [
        {
            files: ['server.js'],
            rules: {
                'no-console': "off"
            }
        }, {
            files: [
                "**/*.test.js"
            ],
            env: {
                jest: true
            },
            plugins: ["jest"],
            rules: {
                "jest/no-disabled-tests": "warn",
                "jest/no-focused-tests": "error",
                "jest/no-identical-title": "error",
                "jest/valid-expect": "error",
                'no-console': "off",
                "multiline-comment-style": "off",
            }
        }]
}