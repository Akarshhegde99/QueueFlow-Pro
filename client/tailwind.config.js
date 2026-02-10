/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                background: "#f8f9fc",
                foreground: "#1a1f2e",
                primary: {
                    DEFAULT: "#6b46c1",
                    light: "#9f7aea",
                    dark: "#553c9a",
                },
                accent: {
                    DEFAULT: "#f3f0ff",
                    purple: "#7c3aed",
                    deep: "#1e1b4b",
                }
            },
            boxShadow: {
                'premium': '0 8px 32px rgba(0,0,0,0.04)',
                'premium-hover': '0 20px 48px rgba(0,0,0,0.06)',
            },
            backgroundImage: {
                'premium-gradient': 'radial-gradient(circle at top right, #f3f4f6, #ffffff 60%, #f9fafb)',
                'mesh-gradient': 'radial-gradient(at 0% 0%, rgba(107, 70, 193, 0.05) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(147, 51, 234, 0.05) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.05) 0, transparent 50%)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: 0.4 },
                    '50%': { opacity: 0.7 },
                },
                fadeInUp: {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                }
            },
        },
    },
    plugins: [],
}
