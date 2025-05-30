//Role: tells Tailwind which files to scan and what theme tweaks you want.

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ← this is key
  content: [      //scan these files for class names to include in the final CSS.
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {  //add customizations
      colors: {
        brand: '#4f46e5',  //now we can say things like `bg-brand` in our components
        'brand-light': '#6366f1', 
        'brand-dark': '#3730a3', 
        'brand-accent': '#a78bfa', 
        'brand-accent-light': '#c4b5fd', 
        'brand-accent-dark': '#7c3aed', 
      },
    },
  },
  plugins: [],  // Add any plugins you want to use here, to customize Tailwind for react
  
}
