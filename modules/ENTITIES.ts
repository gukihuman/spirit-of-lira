type AddName<T> = T & { name: string }
class Entities {
  collection = {
    lira: {
      POSITION: { x: 6588, y: 6891 },
      SIZE: {
        width: 60,
        height: 90,
      },
      MOVE: {
        speed: 14,
      },
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
      },
    },
    bunbo: {
      SIZE: {
        width: 70,
        height: 60,
        bottom: 17,
      },
      SPRITE: {
        leaveAnimationConditions: {
          move: (entity, id) => {
            return SPRITE.getAnimation(id, "move")?.currentFrame === 0
          },
        },
        startFrames: { attack: 18 },
      },
      MOVE: {
        speed: 8,
      },
      SKILLS: {
        modify: {
          attack: {
            distance: 40,
            damage: 2,
            castMS: 2200,
            firstCastMS: 1400,
          },
        },
      },
      ATTRIBUTES: {
        health: 10,
      },
      STATE: {
        deadDelayMS: 1300,
      },
    },
    mousepoint: {
      POSITION: {
        x: -30,
        y: -30,
      },
      SPRITE: {},

      process(entity: { POSITION: any }, id: number) {
        let position = entity.POSITION
        if (!position) return

        if (GLOBAL.lastActiveDevice === "gamepad") {
          position.x = -30
          position.y = -30
          return
        }

        const finaldestination = WORLD.hero.MOVE.finaldestination
        if (!finaldestination) {
          position.x = -30
          position.y = -30
          return
        }
        position.x = finaldestination.x
        position.y = finaldestination.y

        if (!COORD.isWalkable(position.x, position.y)) {
          position.x = -30
          position.y = -30
        }

        const displacement = COORD.vectorFromPoints(
          position,
          WORLD.entities.get(WORLD.heroId).POSITION
        )
        const distance = displacement.distance
        const speedPerTick = COORD.speedPerTick(
          WORLD.entities.get(WORLD.heroId)
        )

        // hide
        // 📜 change tracked to track state, implement track state
        if (distance < speedPerTick || WORLD.hero.STATE.track) {
          position.x = -30
          position.y = -30
          return
        }

        const container = SPRITE.getContainer(id)
        const animation = SPRITE.getLayer(id, "animation")

        if (container && animation) {
          animation.angle += 80 * WORLD.loop.deltaSec
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
