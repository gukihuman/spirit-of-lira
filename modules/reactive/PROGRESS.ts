const progress = {
  scenes: [],
  mobs: {
    bunbo: 0, // adds even if killed not by hero for now
  },
}
export const PROGRESS = LIBRARY.store(progress)
