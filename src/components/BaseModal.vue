<script setup>
const prop = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 px-4"
    >
      <div class="h-fit max-w-sm">
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>
