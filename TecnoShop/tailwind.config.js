module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '75': '0.75', // Escala global del 75%
      },
      width: {
        '133p': '133.33%', // Compensación de ancho
      },
      height: {
        '133p': '133.33%', // Compensación de altura
      },
    },
  },
  plugins: [],
}
