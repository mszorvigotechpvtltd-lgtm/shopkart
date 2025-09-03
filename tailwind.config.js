// tailwind.config.js
import { siteTheme } from "@/config/theme"; // use alias if alias is configured

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        themeBg: "var(--color-bg)",
        themeText: "var(--color-text)",
        invertedBg: "var(--color-inverted-bg)",
        invertedText: "var(--color-inverted-text)",
      },
    },
  },
  plugins: [],
};
