module.exports = {
    theme: {
        extend: {
            fontFamily: {
                sans: ["montserrat", "system-ui"], // default
                fira: ["Fira Code"], // for numbers
                lilita: ["Lilita One"], // special numbers (e.g. level)
                roboto: ["Roboto Mono"],
                courgette: ["Courgette"],
                hat: ["Red Hat Display"],
                yatra: ["Yatra One"],
                kaushan: ["Kaushan Script"],
            },
            colors: {
                tan: "#cfc391",
                chestnut: "#a0492d",
                "sky-blue": "#67d1d4",
                "tigers-eye": "#e38337",
                "royal-brown": "#533c31",
                "dark-gunmetal": "#1a202a",
                "space-cadet": "#243551",
                "jelly-bean-blue": "#438a86",
            },
            animation: {
                "translate-y-menu": "translate-y-menu 800ms ease-in-out",
                "fade-in": "fade-in 150ms ease-in-out",
            },
            keyframes: {
                "translate-y-menu": {
                    "0%": { transform: "translateY(-80px)" },
                    "100%": { transform: "translateY(0)" },
                },
            },
        },
    },
    content: [
        "interface/**/*.{vue,js,ts}",
        ".guki/vue/**/*.{vue,js,ts}",
        "layouts/**/*.vue",
        "pages/**/*.vue",
        "composables/**/*.{js,ts}",
        "plugins/**/*.{js,ts}",
        "App.{js,ts,vue}",
        "app.{js,ts,vue}",
        "Error.{js,ts,vue}",
        "error.{js,ts,vue}",
        "content/**/*.md",
    ],
}
