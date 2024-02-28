<template>
    <div>
        <div
            class="absolute w-fit h-fit z-[10] hover:brightness-[1.15] transition duration-150 ease-in-out"
            :style="style"
            @mouseover="INTERFACE.buttonHover = true"
            @mouseleave="INTERFACE.buttonHover = false"
            @click="TALK.emit()"
        >
            <talk-bg
                class="z-[-10] ml-[0px] w-[calc(100%-0px)] scale-[1.1] contrast-[0.9]"
            />
            <p
                mark="setting name"
                class="mx-[40px] my-[16px] text-[25px] font-semibold pointers-events-none z-[20] text-tan"
            >
                Talk
            </p>
            <hotkey-icon class="top-[38px] left-[87px]" inputEvent="talk" />
        </div>
    </div>
</template>
<script setup lang="ts">
const style = computed(() => {
    return {
        left: INTERFACE.talkPOS.x + 80 + "px",
        top: INTERFACE.talkPOS.y + "px",
    }
})
</script>
