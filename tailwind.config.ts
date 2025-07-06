import type { Config } from "tailwindcss"; // <--- זו השורה החסרה והקריטית

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0D0C32',
                primary: '#4838D1',
                'text-primary': '#FFFFFF',
                'text-secondary': '#B6B5D7',
                success: '#00B57A',
                error: '#E74646',
                timer: '#FFC542',
            },
            fontFamily: {
                heebo: ["var(--font-heebo)", "sans-serif"],
            }
        },
    },
    plugins: [],
};
export default config;