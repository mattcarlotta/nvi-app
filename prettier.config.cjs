/** @type {import("prettier").Config} */
module.exports = {
    semi: true,
    trailingComma: 'es5',
    singleQuote: false,
    printWidth: 100,
    tabWidth: 4,
    useTabs: false,

    plugins: ['prettier-plugin-astro'],
    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro',
            },
        },
    ],
}
