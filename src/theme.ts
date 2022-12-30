import { createTheme, globalCss } from "technic";

export const ThemeProvider = createTheme({
  color: {
    layers: {
      mode: "tint",
      baseColor: "#150011",
      tintAmount: 0.2,
      tintMode: "lighten",
      tintPower: 1.2,
    },
    borders: {
      mode: "tint",
      baseColor: "#743A69",
      tintAmount: 0.3,
      tintMode: "lighten",
      tintPower: 1,
    },
    depth: {
      layers: {
        mode: "lighten",
        amount: 0.3,
      },
      borders: {
        mode: "darken",
        amount: 0.5,
      },
    },
    white: "#ffffff",
    whiteFade: 0.7,
    black: "#000000",
    blackFade: 0.6,
  },
  typography: {
    fontNames: {
      body: "'Roboto Mono'",
      mono: "'Roboto Mono'",
      heading: "Roboto",
    },
    styles: {},
  },
  sizes: {
    control: {
      mode: "from",
      values: {
        xs: "20px",
        sm: "24px",
        md: "26px",
        lg: "30px",
      },
    },
  },
});

globalCss({
  "@import": [
    "https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Roboto:ital,wght@0,400;0,700;1,400&display=swap",
  ],
})();

// import { createStitches } from "@stitches/react";

// export const { styled, css, getCssText, globalCss } = createStitches({
//   theme: {
//     colors: {
//       background: "#150011",
//       panel: "#000000",
//       canvas: "#000000",
//       border: "#332233",
//       text: "#ffffff",
//       highlight: "#ff00ff",
//     },
//     space: {
//       0: "0px",
//       1: "4px",
//       2: "8px",
//       3: "16px",
//       4: "32px",
//       5: "64px",
//       6: "128px",
//     },
//     sizes: {
//       topBarHeight: "48px",
//     },
//     fonts: {
//       body: "Menlo",
//     },
//   },
// });

// globalCss({
//   body: {
//     fontFamily: "$body",
//     fontSize: "12px",
//     color: "$text",
//     backgroundColor: "$background",
//   },
//   "*": {
//     boxSizing: "border-box",
//   },
// })();
