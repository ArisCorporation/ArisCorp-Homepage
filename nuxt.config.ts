const { version } = require('./package.json');
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
  css: ['~/assets/css/main.css', '~/assets/css/tailwind.css'],

  modules: [
    // '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/image',
    'nuxt-icon',
    'nuxt-headlessui',
    'nuxt-directus-next',
    // '@nuxt/content',
    '@pinia/nuxt',
    '@vueuse/motion/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'dayjs-nuxt',
    '@nuxt/ui',
    'nuxt-lodash',
    'nuxt-markdown-render',
  ],

  runtimeConfig: {
    authSecret: process.env.NUXT_AUTH_SECRET,
    cmsToken: process.env.NUXT_CMS_TOKEN,
    public: {
      appVersion: version,
      buildNumber: process.env.NUXT_PUBLIC_BUILD_NUMBER,
      environment: process.env.NUXT_PUBLIC_ENV || process.env.NODE_ENV,
      url: process.env.NUXT_PUBLIC_URL,
      backendUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL,
      fileBase: process.env.NUXT_PUBLIC_FILE_BASE,
      mbutton: { initial: { scale: 1 }, visible: { scale: 1 }, hovered: { scale: 1 }, tapped: { scale: 0.97 } },
    },
  },

  components: [
    // For All Components
    {
      path: '~/components',
      global: true,
    },
    // For Global-Components
    {
      path: '~/components/global',
      prefix: '',
      global: true,
    },
  ],

  image: {
    provider: 'directus',
    directus: {
      baseURL: 'https://cms.ariscorp.de/assets/',
      modifiers: {
        format: 'webp',
      },
    },
  },

  // directus: {
  //   authConfig: {
  //     refreshTokenCookieName: 'ams_refresh_token',
  //   },
  //   // cookieNameToken: 'ams_token',
  //   // cookieNameRefreshToken: 'ams_refresh_token',
  // },

  nuxtMarkdownRender: {
    as: 'div',
    options: {
      html: true,
    },
    global: true,
  },

  headlessui: {
    prefix: 'Headless',
  },

  ui: {
    icons: ['heroicons', 'ic', 'mdi'],
  },

  dayjs: {
    locales: ['en', 'de'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'de',
    defaultTimezone: 'Europe/Berlin',
  },

  typescript: {
    shim: false,
  },
});
