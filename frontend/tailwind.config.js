export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9e9ff',
          200: '#b5d4ff',
          300: '#84b5ff',
          400: '#4e86ff',
          500: '#2f66ff',
          600: '#1f4bdb',
          700: '#183dac',
          800: '#15327f',
          900: '#132a65',
        },
      },
      boxShadow: {
        soft: '0 18px 60px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
}
