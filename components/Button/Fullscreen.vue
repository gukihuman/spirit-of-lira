<template>
  <div class="relative text-gray-300">
    <button @click="toggle()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="absolute"
        :style="style"
      >
        <path
          d="M16.5 6a3 3 0 00-3-3H6a3 3 0 00-3 3v7.5a3 3 0 003 3v-6A4.5 4.5 0 0110.5 6h6z"
        />
        <path
          d="M18 7.5a3 3 0 013 3V18a3 3 0 01-3 3h-7.5a3 3 0 01-3-3v-7.5a3 3 0 013-3H18z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
function toggle() {
  toggleFullscreen();
}
const style = computed(() => {
  let size = 60 * scale() + "px";
  let margin = 20 * scale() + "px";
  return {
    width: size,
    height: size,
    right: margin,
    top: margin,
  };
});
</script>
