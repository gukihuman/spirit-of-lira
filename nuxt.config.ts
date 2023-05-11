export default defineNuxtConfig({
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
    dirs: [".guki/**", "models/**"],
  },
  components: {
    dirs: ["@/.guki/vue", "@/UI"],
  },
  plugins: ["@/.guki/utils/importer.ts", "@/.guki/utils/starter.ts"],

  css: ["@/tailwind.css"],
})
