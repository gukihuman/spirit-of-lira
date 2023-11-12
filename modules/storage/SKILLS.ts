class Skills {
  collection = {
    attack: {
      offensive: true,
      revenge: true,
      damage: 1,
      manacost: 0,
      distance: 20,
      castMS: 1000,
      firstCastMS: 1000,
      delayMS: 200,
    },
  }
  component = {
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
    attackSoundId: undefined,
    // 📜 maybe move somewhere else
    firstCastState: true,
    // 🔧
    inject(entity, id) {
      entity.SKILLS.list.forEach((skill) => {
        entity.SKILLS.data[skill] = _.cloneDeep(SKILLS.collection[skill])
        if (entity.SKILLS.modify[skill]) {
          _.forEach(entity.SKILLS.modify[skill], (value, key) => {
            entity.SKILLS.data[skill][key] = value
          })
        }
      })
      delete entity.SKILLS.modify
    },
  }
}
export const SKILLS = new Skills()
