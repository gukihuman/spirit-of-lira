module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui"],
        serif: ["ui-serif", "Georgia"],
        mono: ["Roboto Mono"],
        display: ["Boogaloo"],
      },
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
        "14": "repeat(14, minmax(0, 1fr))",
        "15": "repeat(15, minmax(0, 1fr))",
        "16": "repeat(16, minmax(0, 1fr))",
      },
      gridTemplateRows: {
        "7": "repeat(7, minmax(0, 1fr))",
        "8": "repeat(8, minmax(0, 1fr))",
        "9": "repeat(9, minmax(0, 1fr))",
        "10": "repeat(10, minmax(0, 1fr))",
      },
      gridColumnStart: {
        "14": "14",
        "15": "15",
        "16": "16",
        "17": "17",
      },
      gridColumnEnd: {
        "14": "14",
        "15": "15",
        "16": "16",
        "17": "17",
      },
      gridRowStart: {
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
      },
      gridRowEnd: {
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
      },
      gridColumn: {
        "span-13": "span 13 / span 13",
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
        "span-16": "span 16 / span 16",
      },
      gridRow: {
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10",
      },
    },
  },
}
