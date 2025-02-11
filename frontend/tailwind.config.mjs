/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Change to "class" if you want dark mode support
  theme: {
    extend: {
      colors: {
        primary: "#232326",
        secondary: "#d7d7d9",
        grey: colors.gray,
        status_idle: "#228B22",
        status_offline: "#FF3800",
        status_inprogress: "#FF8C00",
      },
    },
  },
  plugins: [],
};
