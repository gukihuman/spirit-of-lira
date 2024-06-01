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
        // [
        //     "nuxt-electron",
        //     {
        //         build: [
        //             {
        //                 // Main-Process entry file of the Electron App.
        //                 entry: "electron/main.mjs",
        //                 win: {
        //                     icon: "public/favicon.png",
        //                 },

        //                 extraResources: [".output/server/**"],
        //             },
        //         ],
        //     },
        // ],
    ],
    ignore: ["whales/**", "sprout/**"],
    imports: {
        dirs: ["boot/**/*.{js,ts}", "modules/**/*.{js,ts}"],
    },
    components: [{ path: "@/interface", pathPrefix: false }],
    plugins: ["@/boot/load.ts", "@/boot/start.ts"],
    css: ["@/tailwind.css"],

    // important for correct work of importer
    vite: {
        assetsInclude: ["**/*.md"],
        build: { minify: false },
    },
    sourcemap: false, // save build not working with sourcemap
})
