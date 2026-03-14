import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deep: "#0a1628",
        ocean: "#0c3547",
        teal: "#1a7a7a",
        seafoam: "#3db8a4",
        sand: "#f0e6d3",
        salt: "#faf7f2",
        coral: "#e8734a",
        sun: "#f0b429",
      },
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["DM Sans", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
