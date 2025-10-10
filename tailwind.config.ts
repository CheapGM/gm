import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      tv: { max: "1920px" },
      mac: { max: "1440px" },
      mac_before: { max: "1439px" },
      desktop: { max: "1280px" },
      laptop_md: { max: "1080px" },
      laptop: { max: "1024px" },
      tablet_md: { max: "900px" },
      tablet: { max: "768px" },
      small: { max: "640px" },
      mobile_md: { max: "530px" },
      mobile: { max: "430px" },
      final: { max: "375px" },
    },
    extend: {
      colors: {
        primary: "#0177E7",
        text2: "#888",
        text3: "#030303",
        light_bg1: "#F1F1F1",
        light_bg2: "#F7F7F7",
        verified: "#05ABFF",
        success: "#00AC4F",
        success1: "#15803D",
        success2: "#0C9B4A",
        golden: "#FCC501",
        golden1: "#EEC731",
        warning: "#FFCE00",
        error: "#FF5722",
        danger: "#FF0505",
        favorite: "#E91E63",
        main: {
          100: "#1B1B1B",
          200: "#2B2B2B",
          300: "#3B3B3B",
          400: "#CCCCCC",
          500: "#B6B6B6",
          700: "#5E5E5E",
          900: "#858585 ",
        },
        white: {
          100: "#FFFFFF10",
          200: "#FFFFFF20",
          300: "#FFFFFF30",
          400: "#FFFFFF40",
          500: "#FFFFFF50",
          600: "#FFFFFF60",
          700: "#FFFFFF70",
          800: "#FFFFFF80",
          900: "#FFFFFF90",
          DEFAULT: "#FFFFFF",
        },
        black: {
          10: "#1a1a1a",
          100: "#00000010",
          200: "#00000020",
          300: "#00000030",
          400: "#00000040",
          500: "#00000050",
          600: "#00000060",
          700: "#00000070",
          800: "#00000080",
          900: "#00000090",
          DEFAULT: "#000000",
        },
        light_gray: "#E6E6E6",
        light_gray1: "#E9E9E9",
        light_gray2: "#E7E9EA",
        gray1: "#191919",
        gray2: "#454545",
        gray3: "#8F8F8F",
        gray4: "#363940",
        gray5: "#DDDDDD",
        gray6: "#1C1C1C",
        gray7: "#C1C1C1",
        gray8: "#D1D5DB",
        stroke: "#292925",
        bg: "#161616",
        bg1: "#292929",
        bg2: "#262626",
        bg3: "#101010",
        text_normal: "#F4F4F5",
        text_body: "#A1A1A1",
        text_body1: "#EBEDED",
        text_body2: "#DFE5F3",
        text_body3: "#A3A3A3",
        text_caption: "#858584",
        p_950: "#243300",
        gray: {
          900: "#25212B",
        },
        purple: "#AD00FE",
        blue: "#7AC6F4",
        orange: "#EB7250",
        hot: "#FF5E62",
        new: "#23E477",
        body: "#F7F9FA",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
        space_mono: ["var(--font-space-mono)", ...defaultTheme.fontFamily.sans],
        space_grotesk: [
          "var(--font-space-grotesk)",
          ...defaultTheme.fontFamily.sans,
        ],
        inter: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        orbitron: ["var(--font-orbitron)", ...defaultTheme.fontFamily.sans],
        bungee: ["var(--font-bungee)", ...defaultTheme.fontFamily.sans],
      },
      // primary: "#CAFC01",
      // verified: "#05ABFF",
      // success: "#00AC4F",
      // golden: "#FCC501",
      // warning: "#FFCE00",
      // error: "#FF5722",
      // favorite: "#E91E63",
      backgroundImage: {
        primary_gradient_tab:
          "linear-gradient(101deg, #FCC501 -5.36%, #ABFF68 81.92%)",
        "gradient-radial-hero":
          "radial-gradient(50% 40% at 50% 42.75%, rgba(202, 252, 1, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%)",
        primary_gradient_text:
          "linear-gradient(97deg, #FCC501 8.85%, #ABFF68 97.33%)",
        primary_gradient: "linear-gradient(135deg, #FCC501 30%, #ABFF68 70%)",
        danger_gradient: "linear-gradient(135deg, #FF5722 20%, #D32F2F 80%)",
        verify_gradient: "linear-gradient(135deg, #05ABFF 20%, #0049FF 80%)",
        primary_gradient_button:
          "linear-gradient(274deg, #000 20.77%, rgba(120, 120, 120, 0.53) 99.65%, rgba(255, 255, 255, 0.00) 100.9%)",
        primary_gradient_mask:
          "linear-gradient(266deg, #000 9.07%, rgba(104, 104, 104, 0.16) 61.8%, rgba(255, 255, 255, 0.00) 87.59%)",
        gradient_border:
          "linear-gradient(90deg, #4B3C7A 4.92%, rgba(78, 78, 105, 0.00) 116.21%)",
        gradient_border_hip:
          "linear-gradient(90deg, #1C96FD 7.76%, #33E360 24.02%, #F4C630 46.57%, #CB1245 69.28%, #AD00FE 100%)",
        gradient_border_hip1:
          "linear-gradient(90deg, rgba(151, 94, 77, 1) 0%, rgba(98, 141, 190, 1) 20.02%, rgba(194, 68, 201, 1) 49.64%, rgba(161, 164, 100, 1) 74.72%, rgba(144, 88, 88, 1) 100%)",
        gradient_bg_hip1:
          "linear-gradient(90deg, rgba(151, 94, 77, 0.25) 0%, rgba(98, 141, 190, 0.25) 20.02%, rgba(194, 68, 201, 0.25) 49.64%, rgba(161, 164, 100, 0.25) 74.72%, rgba(144, 88, 88, 0.25) 100%)",
        gradient_bg_gm: "linear-gradient(90deg, #C5A70B 0%, #ADF25C 100%)",
        gradient_cheap_primary:
          "linear-gradient(90deg, #B1D9FF 0%, #628DBE 35.58%, rgba(161, 164, 100, 0.55) 53.85%, #E2F420 80.29%, #0177E7 96.63%)",
        gradient_divider:
          "linear-gradient(90deg, #1B211600 5.21%, #1B21167A 5.22%, #CAFC0126 50%, #1B21167A 91.66%, #1B211600 91.67%)",
      },
      boxShadow: {
        dropdown: "0px 4px 4px 0px rgba(1, 1, 1, 0.50)",
        shadow1: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        shadow2: "0 4px 28px 0 rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        full: "9999px",
      },
      aspectRatio: {
        badge: "4 / 3",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
};
export default config;
