/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            height: {
                128: '32rem'
            },
            maxWidth: {
                main: '950px'
            },
            minHeight: {
                body: '40rem'
            },
            minWidth: {
                preview: '4.6875rem'
            },
            screens: {
                xs: '400px'
            }
        },
    },
    plugins: [],
}
