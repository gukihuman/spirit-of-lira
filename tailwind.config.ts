module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["montserrat", "system-ui"], // default
        fira: ["Fira Code"], // for numbers
        lilita: ["Lilita One"], // special numbers (e.g. level)
        roboto: ["Roboto Mono"],
      },
      colors: {
        tan: "#cfc391",
        chestnut: "#a0492d",
        "dark-gunmetal": "#1a202a",
        "space-cadet": "#243551",
        "jelly-bean-blue": "#438a86",
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
