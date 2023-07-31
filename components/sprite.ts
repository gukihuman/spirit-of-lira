export default {
  active: "", // corresponds to state names
  startFrames: {}, // { idle: 11, move: 5 } default is 0
  // how many frames meet conditions consecutively
  framesValidated: 0,
  onValidation: "idle",
  lastChangeMS: 0,
  lastFlipMS: 0,
}
