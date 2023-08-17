const activeScene = {
  steps: [],
  images: ["lira-no-light"],
  md: "s1-start",
  text: "Um... Are you happy?",
  choices: [
    {
      text: "Not quite. Can you sit back as you were?",
      part: "",
      arrow: false,
    },
    {
      text: "Yeah. Good girl.",
      part: "s1-end",
      arrow: true,
    },
  ],
  x: 950,
  y: 620,
  hue: -30,
  focusedChoice: 0,
}
export const ACTIVE_SCENE = LIB.store(activeScene)
