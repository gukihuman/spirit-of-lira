module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["montserrat", "system-ui"],
        serif: ["ui-serif", "Georgia"],
        mono: ["Roboto Mono"],
        display: ["Boogaloo"],
      },
      colors: {
        "sand-100": "#cfc391",
        "sand-200": "#bdad7b",
        "sand-300": "#a08854",
        "sand-400": "#916c35",
        "sand-500": "#98601a",
        "sand-700": "#724814",
        "tomato-600": "#a0492d",
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
