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
    dirs: ["guki-tools/**", "models/**", "_old/**"],
  },

  css: ["@/css/tailwind.css"],
})
