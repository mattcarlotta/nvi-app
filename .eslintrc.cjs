module.exports = {
    env: {
        browser: true,
        es2022: true,
        node: true,
        NodeJS: true
    },
    extends: ['eslint:recommended', 'plugin:astro/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {},
    overrides: [
        {
            files: ['*.astro'],
            parser: 'astro-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser',
                extraFileExtensions: ['.astro']
            },
            rules: {}
        },
        {
            files: ['*.ts', '*.tsx'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: ['./tsconfig.json'],
                ecmaVersion: 2021,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                }
            },
            plugins: ['@typescript-eslint', 'solid'],
            extends: ['plugin:solid/typescript'],
            rules: {
                'no-extra-semi': 'off',
                '@typescript-eslint/no-extra-semi': 'off',
                'solid/no-react-specific-props': 'off'
            }
        },
        {
            files: ['*.cjs'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off'
            }
        }
    ]
};
