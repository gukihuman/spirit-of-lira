export default defineNuxtConfig({
  runtimeConfig: {
    OPEN_AI_KEY: process.env.OPEN_AI_KEY,
    HUGGINGFACE_TOKEN: process.env.HUGGINGFACE_TOKEN,
  },
  modules: [
    // "@/.guki/lib/glib.ts",
    "@nuxtjs/tailwindcss",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore"],
      },
    ],
  ],
  imports: {
    // lib is separated from .guki in case order is matter here (not sure)
    // lib must be first
    dirs: [".guki/lib/**.ts", ".guki/**", "models/**"],
  },
  components: {
    dirs: ["@/.guki/vue", "@/UI"],
  },
  plugins: ["@/.guki/utils/importer.ts", "@/.guki/utils/starter.ts"],

  css: ["@/tailwind.css"],
})
