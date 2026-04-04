/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16211d",
        mist: "#f2f4ef",
        pine: "#2f5d50",
        moss: "#6f8f72",
        clay: "#b76e4d",
        sand: "#e8dfcf",
        line: "#d9dece"
      },
      boxShadow: {
        soft: "0 20px 50px -24px rgba(22, 33, 29, 0.28)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};
