<template lang="pug">
fullscreen
    loading
    tn( type="long" ): game-window(
        :class="{ 'cursor-none': GLOBAL.firstUserGesture }"
    )
        viewport
        tn: overlay
        tn: inventory
        tn: settings
        tn( type="long" ): novel
        tn: audiomessage
        cursor( v-if="GLOBAL.firstUserGesture" )
</template>
<style>
.long-enter-active,
.long-leave-active {
    transition: opacity 1000ms ease;
}
.long-enter-from,
.long-leave-to {
    opacity: 0;
}
.fast-enter-active,
.fast-leave-active {
    transition: opacity 70ms ease;
}
.fast-enter-from,
.fast-leave-to {
    opacity: 0;
}
.default-enter-active,
.default-leave-active {
    transition: opacity 200ms ease;
}
.default-enter-from,
.default-leave-to {
    opacity: 0;
}
body {
    background-color: #1e293b;
}
/* disable scrollbar */
::-webkit-scrollbar {
    display: none;
}
</style>
