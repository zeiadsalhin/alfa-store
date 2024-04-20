// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    // '@nuxtjs/tailwindcss',
    // '@nuxtjs/google-fonts',
    // '@nuxt/content',
    // '@pinia/nuxt',
    '@nuxtjs/supabase',
  ],
  css: [`assets/css/main.css`],
  supabase: {
    // Options
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: ['/admin(/*)?', '/cart'],
      exclude: ['/'],
      cookieRedirect: false,
    }
  },
})