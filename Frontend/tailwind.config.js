/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#4ade80',
                    DEFAULT: '#22c55e',
                    dark: '#16a34a',
                },
                dark: {
                    lighter: '#1f2937',
                    DEFAULT: '#111827',
                    darker: '#030712',
                }
            }
        },
    },
    plugins: [],
}
