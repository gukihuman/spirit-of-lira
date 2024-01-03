const waveIntervalMS = 4000
const fadeDurationMS = 1800
const opacity_ratio = 0.35
const blur_ratio = 5
type Water = {
    POS: { x: number; y: number }
    id?: number
    rotate?: number
    scale?: number
    last_wave_ms?: number
    flip?: boolean
}
class River {
    displacement
    blur
    water: Water[] = [
        {
            POS: { x: 8370, y: 5190 },
            last_wave_ms: 100,
            rotate: -0.3,
            scale: 1.3,
        },
        {
            POS: { x: 8200, y: 5580 },
            last_wave_ms: -800,
            rotate: -0.5,
            scale: 0.9,
        },
        {
            POS: { x: 8170, y: 5920 },
            last_wave_ms: 300,
            rotate: -0.3,
        },
        {
            POS: { x: 7980, y: 6320 },
            last_wave_ms: -600,
            rotate: -0.2,
            scale: 0.9,
        },
        {
            POS: { x: 7850, y: 6700 },
            last_wave_ms: 100,
            rotate: -0.2,
        },
        {
            POS: { x: 7470, y: 7150 },
        },
        {
            POS: { x: 6900, y: 7550 },
            last_wave_ms: -600,
            rotate: -0.1,
            scale: 1.05,
        },
        {
            POS: { x: 6600, y: 7780 },
            last_wave_ms: 500,
            rotate: 0.1,
            scale: 1.08,
        },
        // second group
        {
            POS: { x: 8300, y: 5350 },
            last_wave_ms: -1300,
            rotate: -0.3,
        },
        {
            POS: { x: 8220, y: 5800 },
            last_wave_ms: -2500,
            rotate: -0.4,
        },
        {
            POS: { x: 8000, y: 6200 },
            last_wave_ms: -1900,
            scale: 0.9,
        },
        {
            POS: { x: 7930, y: 6550 },
            last_wave_ms: -2800,
            rotate: -0.3,
        },
        {
            POS: { x: 7630, y: 7000 },
            last_wave_ms: -1900,
        },
        {
            POS: { x: 7220, y: 7360 },
            rotate: 0.3,
            last_wave_ms: -2600,
            scale: 1.05,
        },
        {
            POS: { x: 6790, y: 7630 },
            rotate: -0.1,
            last_wave_ms: -1700,
            scale: 1.05,
        },
        {
            POS: { x: 6360, y: 7930 },
            rotate: 0.4,
            last_wave_ms: -2500,
            scale: 1,
        },
    ]
    async init() {
        const texture = PIXI.Texture.from(
            ASSETS.get_webp_path("displacement-map")
        )
        const displacementSprite = PIXI.Sprite.from(texture)
        this.displacement = new PIXI.filters.DisplacementFilter(
            displacementSprite
        )
        this.blur = new PIXI.filters.BlurFilter()
        this.blur.blur = blur_ratio
        this.displacement.scale.x = 25
        this.displacement.scale.y = 25
        for (const instance of this.water) {
            instance.id = await CREATOR.create("water-1", {
                SPRITE: {},
                POS: instance.POS,
            })
            const container = SPRITE.getContainer(instance.id)
            if (!container) return
            WORLD.sortable.removeChild(container)
            WORLD.ground.addChild(container)
            container.filters = [this.displacement, this.blur]
            const scale = { x: 1.15, y: 1.15 }
            if (instance.scale) {
                scale.x = instance.scale
                scale.y = instance.scale
            }
            container.scale.x = scale.x
            container.scale.y = scale.y
            if (instance.flip) container.scale.x *= -1
            if (instance.rotate) container.rotation = instance.rotate
            if (!instance.last_wave_ms) instance.last_wave_ms = 0
        }
    }
    process() {
        this.water.forEach((instance) => {
            if (!instance.id) return
            if (!instance.last_wave_ms) instance.last_wave_ms = 0
            if (!instance.rotate) instance.rotate = 0
            const animation = SPRITE.getLayer(instance.id, "animation")
            if (!animation) return
            animation.x -= 20 * (1 + instance.rotate) * LOOP.delta_sec
            animation.y += 20 * (1 - instance.rotate) * LOOP.delta_sec
            const currentTime = LOOP.elapsed
            const timeSinceLastWave = currentTime - instance.last_wave_ms
            if (timeSinceLastWave >= waveIntervalMS) {
                instance.last_wave_ms = currentTime
                if (animation) {
                    animation.x = 0
                    animation.y = 0
                }
            }
            let opacity = 0
            if (timeSinceLastWave < fadeDurationMS) {
                opacity = timeSinceLastWave / fadeDurationMS
            } else if (timeSinceLastWave > waveIntervalMS - fadeDurationMS) {
                opacity =
                    1 -
                    (timeSinceLastWave - (waveIntervalMS - fadeDurationMS)) /
                        fadeDurationMS
            } else {
                opacity = 1
            }
            if (animation) animation.alpha = opacity ** 2 * opacity_ratio
        })
    }
}
export const RIVER = new River()
