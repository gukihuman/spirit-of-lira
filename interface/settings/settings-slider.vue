<template lang="pug">
div(
    class="absolute w-[420px] h-[70px] rounded-3xl hover:brightness-[1.15] transition-all duration-[150ms] ease-in-out"
    @mousedown="startDrag"
    @click="startDrag(); TIME.next(onDrag)"
    ref="sliderRef"
)
    img(
        :src="ASSETS.webp_paths['settings-slider-bg']"
        class="absolute h-full object-none object-left"
        draggable="false"
    )
    img(
        :src="ASSETS.webp_paths['settings-slider']"
        class="absolute h-full object-left object-none"
        :style="style_object"
        draggable="false"
    )
</template>
<script setup lang="ts">
const props = defineProps(["setting"])
const sound_width = computed(() => {
    return 360 * SETTINGS.echo.general[props.setting] + 30
})
const style_object = computed(() => {
    return {
        width: sound_width.value + "px",
    }
})
const isDragging = ref(false)
const sliderRef = ref(null)
let drag_time_token = ""
const startDrag = (event) => {
    if (event) event.preventDefault()
    isDragging.value = true

    drag_time_token = TIME.every(10, onDrag)
}
const update_volume_throttled = _.throttle(AUDIO.update_volume, 50)
const onDrag = () => {
    if (!isDragging.value) return

    if (!INPUT.mouse.pressed.includes(0)) {
        isDragging.value = false
        TIME.cancel(drag_time_token)
    }
    const sliderElement: any = sliderRef.value
    if (!sliderElement) return

    // const rect = sliderElement.getBoundingClientRect()
    // rect.left and rect.width are problematic in some cases with global ratio
    // so manually 836 and 420
    const adjusted_left = 836 + 25 // 836 this style
    const adjusted_width = 420 - 50 // 420 always
    SETTINGS.echo.general[props.setting] = Math.max(
        0,
        Math.min(1, (COORD.mouseOfScreen().x - adjusted_left) / adjusted_width)
    )
    update_volume_throttled()
}

const endDrag = () => {
    isDragging.value = false
}
</script>
