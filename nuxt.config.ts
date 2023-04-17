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
    dirs: ["guki-tools/**", "ts/**", "_old/**"],
  },

  css: ["@/css/tailwind.css"],
})
