// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    dirs: [
      // no files import, but with * work like dirs
      "guki-game-manager/*index.ts",
      "guki-game-manager/*auto-importer.ts",
      "old/**",
    ],
  },

  css: ["@/css/tailwind.css"],
})
