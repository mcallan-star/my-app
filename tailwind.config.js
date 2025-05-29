/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ← this is key
  content: [      //this array scans all files in src, ensuring that only css classes i used in the project are included in the final build
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {  //add to tailwind's default theme without replacing it
      colors: {
        brand: '#4f46e5',  //now we can say things like `bg-brand` in our components
        'brand-light': '#6366f1', //light variant of the brand color
        'brand-dark': '#3730a3', //dark variant of the brand color
        'brand-accent': '#a78bfa', //accent color for brand
        'brand-accent-light': '#c4b5fd', //light variant of the accent color
        'brand-accent-dark': '#7c3aed', //dark variant of the accent color
      },
    },
  },
  plugins: [],  // Add any plugins you want to use here, to customize Tailwind for react
  
}
