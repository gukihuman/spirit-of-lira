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
    dirs: [".guki/**"],
  },
  components: {
    dirs: ["@/.guki/vue", "@/UI"],
  },
  plugins: ["@/.guki/boot/importer.ts", "@/.guki/boot/starter.ts"],
  css: ["@/tailwind.css"],
  vite: {
    build: {
      minify: false,
    },
  },

  // local build not working with sourcemap
  sourcemap: false,
})
