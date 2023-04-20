export default {
  name: "hero",
  sprite: new URL("/assets/hero/hero.json", import.meta.url).href,

  // 📜 make coordinates valid
  x: 1920 / 2,
  y: 1080 / 2,

  process: function () {},
} as gUnique
