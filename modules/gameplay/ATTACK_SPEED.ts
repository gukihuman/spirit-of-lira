class AttackSpeed {
    process() {
        MUSEUM.process_entity("SKILLS", (ent, id) => {
            const skill = ent.SKILLS.data[ent.SKILLS.active]
            if (!skill) return

            const s = SKILLS.collection[ent.SKILLS.active]
            skill.castMS = s.castMS / ent.ATTRIBUTES.attackSpeed
            skill.firstCastMS = s.firstCastMS / ent.ATTRIBUTES.attackSpeed
            skill.delayMS = s.delayMS / ent.ATTRIBUTES.attackSpeed
            skill.audioStartMS = s.audioStartMS / ent.ATTRIBUTES.attackSpeed

            const m =
                ENTITIES.collection[ent.name].SKILLS.modify[ent.SKILLS.active]
            if (m.castMS) {
                skill.castMS = m.castMS / ent.ATTRIBUTES.attackSpeed
            }
            if (m.firstCastMS) {
                skill.firstCastMS = m.firstCastMS / ent.ATTRIBUTES.attackSpeed
            }
            if (m.delayMS) {
                skill.delayMS = m.delayMS / ent.ATTRIBUTES.attackSpeed
            }
            if (m.audioStartMS) {
                skill.audioStartMS = m.audioStartMS / ent.ATTRIBUTES.attackSpeed
            }
        })
    }

    // called from CAST
    updateAnimationSpeed(ent, id) {
        let sprite
        if (ent.HERO) {
            // "attack-sword"
            const spriteName = SPRITE_UPDATE.getHeroCastSprite(
                HERO.ent,
                HERO.id
            )
            sprite = SPRITE.getAnimation(HERO.id, spriteName)
        } else {
            sprite = SPRITE.getAnimation(id, "attack")
        }
        if (!sprite) return
        sprite.animationSpeed =
            (1 / (CONFIG.max_fps / 10)) * ent.ATTRIBUTES.attackSpeed
    }
}
export const ATTACK_SPEED = new AttackSpeed()
