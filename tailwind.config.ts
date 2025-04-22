import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    fontSize: {
      sm: "0.8rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
      "6xl": [
        "4.875rem",
        {
          lineHeight: "2rem",
          letterSpacing: "-0.02em",
          fontWeight: "700",
        },
      ],
    },

    container: {
      screens: {
        // screens are actually screen resolutions and they are used to make set the breakpoint for each one in order to make our website responsive:
        // for instance tailcss set default define its default screens like sm, md,lg,xl,2xl and each and it also define its own breakpoints

        // a breakpoint is actually a max width of a screen  for instance for xm: extra device th e max width are gonna set when we reach 360 and 574

        // we are going to overide that and set our own screens and breakpoints.
        //Good to know : screens resolution ends at 2xl so they do not work in html element afetr that value like 3xl:text-white ( not possible )
        //Feel free to have as few or as many screens as you want, naming them in whatever way you’d prefer for your project.

        xm: "360px",
        sm: "575px",
        md: "768px",
        lg: "992px",
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1680px",
        "4xl": "1920px",
      },

      // container class sets the max-width of an element to match the min-width of the current breakpoint. This is useful if you’d prefer to design for a fixed set of screen sizes instead of trying to accommodate a fully fluid viewport.
      // to center with tailwind class we use mx-auto
      center: true,

      // To add horizontal padding for each breakpoint
      padding: {
        DEFAULT: "1rem",
        xs: "0rem",
        sm: "0rem",
        md: "0rem",
        lg: "0rem",
        xl: "0rem",
        "2xl": "0rem",
        "3xl": "2rem",
        "4xl": "2rem",
      },
    },

    colors: {
      // Orange Palette for Primary
      primary: {
        "50": "#e1f2fa",
        "100": "#b3e0f6",
        "200": "#7dc4e8",
        "300": "#48a8db",
        "400": "#1a8cd0",
        "500": "#104A8D", // Base color
        "600": "#0e3e73",
        "700": "#0c345f",
        "800": "#0a2a4c",
        "900": "#081f39",
        "950": "#04152b",
      },

      // Lighter Orange Palette for Secondary (Optional)
      secondary: {
        "50": "#e0f7fa",
        "100": "#b2ebf2",
        "200": "#80deea",
        "300": "#4dd0e1",
        "400": "#26c6da",
        "500": "#00bcd4",
        "600": "#00a3b0",
        "700": "#0094a1",
        "800": "#00838f",
        "900": "#006064",
        "950": "#004d4f",
      },

      // Default Tailwind Colors
      slate: colors.slate,
      neutral: colors.neutral,
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      orange: colors.orange,
      indigo: colors.indigo,
      green: colors.green,
      red: colors.red,
      yellow: colors.yellow,
      transparent: "transparent",
    },

    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
