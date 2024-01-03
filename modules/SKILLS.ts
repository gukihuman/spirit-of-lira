class Skills {
    collection = {
        attack: {
            offensive: true,
            revenge: true,
            damage: 1,
            energyCost: 0,
            distance: 20,
            castMS: 1000,
            firstCastMS: 1000,
            delayMS: 200,
            audioStartMS: -100, // based on cast done time
            audioDone: true,
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
        castStartMS: Infinity,
        castAndDelayMS: Infinity, // includes delay after cast logic
        delayedLogicDone: true,
        pre_cast_logic_done: false,
        was_visual_effect: false,
        audioDone: false,
        attackSoundTimeId: undefined,
        // 📜 maybe move somewhere else
        firstCastState: true,
        // 🔧
        inject(ent, id) {
            ent.SKILLS.list.forEach((skill) => {
                ent.SKILLS.data[skill] = _.cloneDeep(SKILLS.collection[skill])
                if (ent.SKILLS.modify[skill]) {
                    _.forEach(ent.SKILLS.modify[skill], (value, key) => {
                        ent.SKILLS.data[skill][key] = value
                    })
                }
            })
            delete ent.SKILLS.modify
        },
    }
}
export const SKILLS = new Skills()
