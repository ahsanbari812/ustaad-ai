/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Ustaad AI Brand Colors
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        dark: {
          50: '#1E1E2E',
          100: '#181828',
          200: '#141424',
          300: '#10101E',
          400: '#0C0C18',
          500: '#0A0A14',
          600: '#08080F',
          700: '#06060A',
          800: '#040406',
          900: '#020203',
        },
        accent: {
          gold: '#F59E0B',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          rose: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'System'],
      },
    },
  },
  plugins: [],
};
