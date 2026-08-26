/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Green — primary brand
        green: {
          50: '#f0f7f0',
          100: '#dcebdc',
          200: '#bbd6bc',
          300: '#8fbb91',
          400: '#5e9662',
          500: '#3e7a42',
          600: '#2d6131',
          700: '#244e28',
          800: '#1d3e21',
          900: '#16321a',
          950: '#0a1c0d',
        },
        // Caramel — secondary brand
        caramel: {
          50: '#faf6f0',
          100: '#f3e8d5',
          200: '#e6cfa8',
          300: '#d7b07b',
          400: '#c89353',
          500: '#b87c3a',
          600: '#9c6530',
          700: '#7d4f29',
          800: '#653f25',
          900: '#523520',
          950: '#2e1d11',
        },
        // Cream — warm off-white
        cream: {
          50: '#fdfbf7',
          100: '#faf5ec',
          200: '#f4e9d5',
          300: '#ecd9b8',
          400: '#e2c694',
          500: '#d9b27a',
          600: '#cfa063',
          700: '#b8854f',
          800: '#9a6c42',
          900: '#7d5739',
        },
        // Semantic
        success: '#3e7a42',
        warning: '#c89353',
        error: '#c25450',
        info: '#5e9662',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arabic: ['"Cairo"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        arabicDisplay: ['"Tajawal"', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232d6131' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(45, 97, 49, 0.08)',
        'card': '0 8px 30px -4px rgba(45, 97, 49, 0.12)',
        'premium': '0 20px 60px -8px rgba(45, 97, 49, 0.18)',
        'caramel': '0 8px 30px -4px rgba(184, 124, 58, 0.15)',
      },
    },
  },
  plugins: [],
};
