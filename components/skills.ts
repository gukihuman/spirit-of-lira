export default {
  active: "",
  slot1: "attack",
  slot2: "",
  slot3: "",
  slot4: "",
  list: ["attack"],
  data: {}, // filled from SKILLS constant 📜 do we need it here? may be take directly from SKILLS where its needed?
  modify: {}, // overwrite skills data
  lastFirstStartMS: Infinity, // first in a sequence
  lastDoneMS: Infinity, // includes delay after cast logic
  delayedLogicDone: true,
  audioDone: false,
  // 📜 maybe move somewhere else
  firstCastState: true,
  // 🔧
  inject(entity, id) {
    entity.skills.list.forEach((skill) => {
      entity.skills.data[skill] = _.cloneDeep(SKILLS.list[skill])
      if (entity.skills.modify[skill]) {
        _.forEach(entity.skills.modify[skill], (value, key) => {
          entity.skills.data[skill][key] = value
        })
      }
    })
    delete entity.skills.modify
  },
}
