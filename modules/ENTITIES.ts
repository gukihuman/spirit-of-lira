class Entities {
    collection = {
        lira: {
            HERO: true,
            POS: { x: 6588, y: 6891 },
            SIZE: { width: 60, height: 153 },
            MOVE: { speed: 16 },
            SKILLS: {
                modify: {
                    attack: {
                        firstCastMS: 900,
                    },
                },
            },
            SPRITE: {
                startFrames: { idle: 11, walk: 8, run: 4, "attack-sword": 14 },
                effectHeightRatio: 0.45,
                effectWidthRatio: 0.25,
            },
            ATTRIBUTES: {
                health: 20,
                healthMax: 20,
                healthRegen: 0.2,
            },
        },
        bunbo: {
            SIZE: { width: 70, height: 60, bottom: 17 },
            SPRITE: {
                leaveAnimationConditions: {
                    move: (ent, id) => {
                        return (
                            SPRITE.getAnimation(id, "move")?.currentFrame === 0
                        )
                    },
                },
                startFrames: { attack: 18 },
            },
            MOVE: { speed: 10 },
            SKILLS: {
                modify: {
                    attack: {
                        distance: 40,
                        damage: 2,
                        castMS: 1600,
                        firstCastMS: 1400,
                        delayMS: 800,
                        audioStartMS: -200,
                    },
                },
            },
            ATTRIBUTES: {
                health: 10,
                healthMax: 10,
            },
            STATE: { deadDelayMS: 1300 },
        },
        mousepoint: {
            POS: { x: -30, y: -30 },
            SPRITE: {},
            process(ent: { POS: any }, id: number) {
                let POS = ent.POS
                if (!POS) return
                if (HERO.ent.STATE.active === "dead") {
                    HERO.reset_final_des()
                    return
                }

                if (GLOBAL.lastActiveDevice === "gamepad") {
                    POS.x = -30
                    POS.y = -30
                    return
                }

                const final_des = HERO.ent.MOVE.final_des
                if (!final_des) {
                    POS.x = -30
                    POS.y = -30
                    return
                }
                POS.x = final_des.x
                POS.y = final_des.y

                if (!COLLISION.is_coord_clear(POS)) {
                    POS.x = -30
                    POS.y = -30
                }

                const displacement = COORD.vectorFromPoints(POS, HERO.ent.POS)
                const distance = displacement.distance
                const speedPerTick = COORD.speedPerTick(HERO.ent)

                // hide
                // 📜 change tracked to track state, implement track state
                if (distance < speedPerTick || HERO.ent.STATE.track) {
                    POS.x = -30
                    POS.y = -30
                    return
                }

                const container = SPRITE.getContainer(id)
                const animation = SPRITE.getLayer(id, "animation")

                if (container && animation) {
                    animation.angle += 80 * LOOP.delta_sec
                    const scale = 1
                    container.scale = { x: 1, y: 0.5 }
                    container.scale.x *= scale
                    container.scale.y *= scale
                    const animationSprite = SPRITE.getAnimation(id, "idle")
                    if (!animationSprite) return
                    animationSprite.blendMode = PIXI.BLEND_MODES.OVERLAY
                    setTimeout(() => {
                        animationSprite.alpha = distance / 100
                    })
                }
            },
        },
    }
}
export const ENTITIES = new Entities()
