/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: "#e759a0",
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
        fadeOut: "fadeOut 0.2s linear",
      },
      keyframes: (theme) => ({
        fadeIn: {
          "0%": { opacity: 0, display: "block !important" },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0, display: "hidden" },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
