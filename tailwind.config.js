/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        espresso: '#3B2418',
        'espresso-light': '#5C3A28',
        coffee: '#241710',
        'coffee-light': '#3A261A',
        caramel: '#B77945',
        'caramel-light': '#C99260',
        'caramel-dark': '#9A6234',
        cream: '#F8F4ED',
        'cream-dark': '#EFE8DB',
        muted: '#81766C',
        'muted-light': '#A89E94',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(59, 36, 24, 0.08)',
        'soft-lg': '0 8px 30px rgba(59, 36, 24, 0.12)',
        card: '0 2px 16px rgba(59, 36, 24, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
