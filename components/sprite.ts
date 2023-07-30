export default {
  //
  active: "idle", // non-move entities always idle
  startFrames: {}, // { idle: 11, attack: 5 } default is 0

  // how many frames meet conditions consecutively
  framesValidated: 0,
  onValidation: "idle",

  lastChangeMS: 0,
  lastFlipMS: 0,
}
