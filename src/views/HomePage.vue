<script setup lang="ts">
import NavbarView from "./NavbarView.vue";
import FooterView from "@/components/Footer.vue";
</script>

<template>
  <div class="container">
    <nav>
      <NavbarView></NavbarView>
    </nav>
    <main>
      <div class="h-[80vh] bg-amber-300"></div>
    </main>
    <footer>
      <FooterView></FooterView>
    </footer>
  </div>
</template>
