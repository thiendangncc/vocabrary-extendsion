/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2D6A4F", // The main green color from your logo
          light: "#52b788", // Optional lighter shade
          dark: "#1b4332", // Optional darker shade
        },
        secondary: {
          DEFAULT: "#6C757D", // Gray for a neutral tone
          light: "#F8F9FA", // Light gray for backgrounds
          dark: "#343A40", // Dark gray for text or accents
          // Alternatively, use this for a more vibrant option:
          // DEFAULT: '#FFB94E',  // Muted orange or beige for contrast
          // light: '#FFE8B3',    // Very light beige
          // dark: '#FF9900',     // Stronger orange for highlights
        },
      },
    },
  },
  plugins: [],
};
