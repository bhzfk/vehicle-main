module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Poppins', 'ui-sans-serif', 'system-ui'],

      serif: ['Poppins', 'Georgia'],

      mono: ['ui-monospace', 'SFMono-Regular'],

      display: ['Oswald'],

      body: ['Poppins'],
    },
    extend: {
      colors: {
        primary: '#00489a',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
