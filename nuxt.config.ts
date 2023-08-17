export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
      title: "Spirit of Lira",
    },
  },
  runtimeConfig: {
    OPEN_AI_KEY: process.env.OPEN_AI_KEY,
    HUGGINGFACE_TOKEN: process.env.HUGGINGFACE_TOKEN,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore"],
      },
    ],
  ],
  imports: {
    dirs: ["core/**/*.{js,ts}", "modules/**/*.{js,ts}"],
  },
  components: [{ path: "@/interface", pathPrefix: false }],
  plugins: ["@/core/load.ts", "@/core/start.ts"],
  css: ["@/tailwind.css"],

  // important for correct work of importer
  vite: {
    assetsInclude: ["**/*.md"],
    build: {
      minify: false,
    },
  },

  // local build not working with sourcemap
  sourcemap: false,
})
