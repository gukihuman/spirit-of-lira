export default {
  //
  active: "idle", // even for non-move
  firstFrames: { idle: 0, move: 0, attack: 0, death: 0 },
  fade: true, // death dissapear

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
