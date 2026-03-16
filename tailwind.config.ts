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
        deep: "#0B1D2C",
        ocean: "#163B4E",
        teal: "#1B6B6B",
        seafoam: "#3db8a4",
        sand: "#D4A574",
        salt: "#FAF3EC",
        coral: "#C75B3A",
        sun: "#f0b429",
        slate: "#3A4A56",
        driftwood: "#D4A574",
        foam: "#FAF3EC",
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
