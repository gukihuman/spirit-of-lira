<template lang="pug">
//- text box
div(class="absolute" :style="textBoxStyle")
  //- transparent border
  div(class="absolute rounded-3xl w-full h-full bg-gradient-to-b from-dark-gunmetal to-space-cadet opacity-[0.20]")
  //- internal text box
  div(
    class="-z-10 absolute w-full h-full opacity-[0.65]" :style="internalTextBoxStyle"
  )
    div(class="w-full h-full rounded-3xl bg-gradient-to-b from-dark-gunmetal to-space-cadet")
  //- text
  div(
    v-show="NOVEL.echo.showText"
    class="my-7 mx-11 leading-10 font-semibold text-[28px] text-slate-300"
  )
    span(
      v-for='(word, index) in textArray'
      :key='index'
      class='opacity-0 cursor-default'
      :style='wordStyle(index)'
    ) {{ word + " " }}
</template>
<script setup lang="ts">
const props = defineProps(["layer"])
const addPauses = (array, arrayWithPauses) => {
    array.forEach((word) => {
        if (word.includes("...")) arrayWithPauses.push(word, "", "", "")
        else if (word.includes("?") || word.includes("!") || word.includes("."))
            arrayWithPauses.push(word, "", "")
        else if (word.includes(",")) arrayWithPauses.push(word, "")
        else arrayWithPauses.push(word)
    })
}
const textArray = computed(() => {
    let text = NOVEL.echo[props.layer].text
    if (!text) return
    let array: string[] = [].concat(text.split(" "))
    let arrayWithPauses: string[] = []
    addPauses(array, arrayWithPauses)
    return arrayWithPauses
})
const textBoxStyle = computed(() => {
    return {
        "margin-left": `${NOVEL.echo[props.layer].x}px`,
        "margin-top": `${NOVEL.echo[props.layer].y}px`,
        width: `${CONFIG.novel.textBoxWidth}px`,
        height: `${CONFIG.novel.textBoxHeight}px`,
    }
})
const internalTextBoxStyle = computed(() => {
    return { padding: `${CONFIG.novel.border}px` }
})
const wordStyle = computed(() => {
    return (index) => {
        const duration = `${(0.8 - CONFIG.novel.textSpeed / 180).toFixed(1)}s`
        const delay = `${((index / 10) * (100 - CONFIG.novel.textSpeed)) / 25}s`
        return {
            animation: `fade-in ${duration} ${delay} forwards cubic-bezier(0.11, 0, 0.5, 0)`,
            filter: "blur(1px)",
        }
    }
})
</script>
<style>
@keyframes fade-in {
    100% {
        opacity: 1;
        filter: blur(0);
    }
}
</style>
