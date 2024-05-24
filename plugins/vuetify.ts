// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

// const customDarkTheme = {
//   dark: true,
//   colors: {
//     background: "#15202b",
//     surface: "#15202b",
//     primary: "#3f51b5",
//     secondary: "#03dac6",
//     error: "#f44336",
//     info: "#2196F3",
//     success: "#4caf50",
//     warning: "#fb8c00",
//   },
// };

// const customLightTheme = {
//   dark: false,
//   colors: {
//     background: "#eee",
//     surface: "#15202b",
//     primary: "#3f51b5",
//     secondary: "#00ccff",
//     error: "#ffcc00",
//   },
// };

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // components,
    // directives,
    theme: {
        defaultTheme:  'dark',
        themes: {
          // customDarkTheme,
          // customLightTheme,
        },
    },
    display: {
        mobileBreakpoint: 'xl',
        thresholds: {
            xs: 0,
            sm: 340,
            md: 540,
            lg: 800,
            xl: 1280,
        },
    },
  })
  app.vueApp.use(vuetify)
})
