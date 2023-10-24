export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
      title: "Spirit of Lira",
    },
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
  ignore: ["whales/**"],
  imports: {
    dirs: ["boot/**/*.{js,ts}", "modules/**/*.{js,ts}"],
  },
  components: [{ path: "@/interface", pathPrefix: false }],
  plugins: ["@/boot/load.ts", "@/boot/start.ts"],
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
