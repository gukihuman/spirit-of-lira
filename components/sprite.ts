export default {
  //
  active: "idle", // even for non-move
  startFrames: { idle: 0, move: 0, attack: 0, death: 0 },

  initial: {
    parent: "sortable", // direct stage container like "ground" or "sortable"
    randomFlip: true,
    randomFrame: true,
    loop: true,
  },

  // how many frames meet conditions consecutively
  framesValidated: 0,
  onValidation: "idle",

  lastChangeMS: 0,
  lastFlipMS: 0,
}
