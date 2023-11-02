export default {
  n1: {
    text: () => `Kill bunbos ${PROGRESS.mobs.bunbo} / 30`,
    condition: () => PROGRESS.mobs.bunbo >= 30,
  },
}
