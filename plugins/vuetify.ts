// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const customDarkTheme = {
  dark: true,
  colors: {
    background: "#000",
    surface: "#111",
    primary: "#3f51b5",
    secondary: "#9E9E9E",
    error: "#f44336",
    info: "#2196F3",
    success: "#4caf50",
    warning: "#fb8c00",
  },
};

const customLightTheme = {
  dark: false,
  colors: {
    background: "#f0f0f0",
    surface: "#444",
    primary: '#3f51b5',
    secondary: '#BDBDBD',
    error: '#e91e63',
    warning: '#ffc107',
    info: '#ffeb3b',
    success: '#4caf50'
  },
};


export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // components,
    // directives,
    theme: {
        defaultTheme:  'customLightTheme',
        themes: {
          customDarkTheme,
          customLightTheme,
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
