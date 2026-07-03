<template>
  <div
    class="flex items-center flex-col justify-center bg-slate-50 px-10 animate-pulse"
  >
    <div class="w-md h-fit bg-white shadow-lg p-10 relative">
      <div class="space-y-3 mb-6">
        <div class="h-8 w-48 bg-gray-200 rounded"></div>
        <div class="h-4 w-64 bg-gray-200 rounded"></div>
      </div>

      <div class="space-y-5">
        <div v-for="i in 2" :key="i" class="space-y-2">
          <div class="h-4 w-16 bg-gray-200 rounded"></div>
          <div class="h-10 w-full bg-gray-200 rounded-lg"></div>
        </div>

        <div class="h-4 w-32 bg-gray-200 rounded"></div>
        <div class="h-10 w-full bg-gray-200 rounded-xl"></div>
      </div>

      <div class="mt-5 space-y-3">
        <div class="h-10 w-full bg-gray-200 rounded-xl"></div>
        <div class="h-10 w-full bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  </div>
</template>
