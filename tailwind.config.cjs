/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      brand: "#142c54",
      "brand-opaque": "rgba(20, 44, 84, 0.4 )",
      white: "#ffffff",
    },
    extend: {
      gridTemplateRows: {
        layout: "5rem 1fr",
      },
      gridTemplateColumns: {
        dialogList: "1fr 2fr",
      },
    },
  },
  plugins: [],
};
