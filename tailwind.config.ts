import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Deepened green for confidence + legibility on white.
          green: "#0A8A2C",
          "green-dark": "#056B1F",
          "green-ink": "#06411A",
          "green-soft": "#F0FAF1",
          "green-tint": "#D9F1DE",
          // Warmer orange — "hot deal" energy.
          orange: "#FF7A1A",
          "orange-dark": "#E2640A",
          "orange-soft": "#FFF1E3",
          "orange-tint": "#FFD9B8",
          // Yellow for ratings + scarcity warnings.
          yellow: "#FFC83D",
          "yellow-dark": "#D9A400",
          "yellow-soft": "#FFF6D6",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          cream: "#FBF9F4",
          muted: "#F5F3EE",
          "muted-2": "#ECEAE3",
          border: "#ECE9E0",
          "border-strong": "#D9D5C7",
        },
        ink: {
          DEFAULT: "#141414",
          strong: "#0A0A0A",
          muted: "#5C5C5C",
          faint: "#8E8E8E",
          inverse: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1.125rem" }],
        sm: ["0.875rem", { lineHeight: "1.35rem" }],
        base: ["0.9375rem", { lineHeight: "1.45rem" }],
        lg: ["1.0625rem", { lineHeight: "1.5rem" }],
        xl: ["1.1875rem", { lineHeight: "1.55rem" }],
        "2xl": ["1.4375rem", { lineHeight: "1.7rem", letterSpacing: "-0.01em" }],
        "3xl": ["1.75rem", { lineHeight: "2rem", letterSpacing: "-0.02em" }],
        "4xl": ["2.125rem", { lineHeight: "2.3rem", letterSpacing: "-0.025em" }],
        "5xl": ["2.625rem", { lineHeight: "2.8rem", letterSpacing: "-0.03em" }],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(12, 17, 29, 0.04), 0 1px 1px rgba(12, 17, 29, 0.03)",
        card:
          "0 1px 2px rgba(12, 17, 29, 0.04), 0 4px 12px rgba(12, 17, 29, 0.05)",
        float:
          "0 6px 16px rgba(12, 17, 29, 0.08), 0 2px 4px rgba(12, 17, 29, 0.05)",
        pop:
          "0 16px 40px rgba(12, 17, 29, 0.12), 0 4px 10px rgba(12, 17, 29, 0.06)",
        inset: "inset 0 0 0 1px rgba(12, 17, 29, 0.05)",
        ring: "0 0 0 4px rgba(10, 138, 44, 0.15)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "24px",
        "4xl": "32px",
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(160deg, #0A8A2C 0%, #0C9E32 45%, #13B23E 100%)",
        "gradient-sunrise":
          "linear-gradient(135deg, #FF7A1A 0%, #FFC83D 100%)",
        "gradient-fade":
          "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
