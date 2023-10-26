/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            animation: {
                "fade-in": "fade-in 1s ease-in-out forwards",
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                }
            },
            height: {
                128: "32rem"
            },
            maxWidth: {
                main: "75rem"
            },
            minHeight: {
                desktop: "calc(100vh - 176px)",
                mobile: "calc(100vh - 138px)"
            },
            minWidth: {
                preview: "4.6875rem"
            },
            screens: {
                xs: "400px"
            }
        },
    },
    plugins: [],
}
