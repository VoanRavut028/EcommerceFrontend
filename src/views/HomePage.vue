<script setup lang="ts">
import NavbarView from "./NavbarView.vue";
import FooterView from "@/components/Footer.vue";
import WelcomeView from "./WelcomeView.vue";
</script>

<template>
  <div class="min-h-screen w-full bg-dominant">
    <div class="container mx-auto">
      <nav>
        <NavbarView></NavbarView>
      </nav>
      <main>
        <div class="">
          <WelcomeView></WelcomeView>
        </div>
      </main>
      <footer>
        <FooterView></FooterView>
      </footer>
    </div>
  </div>
</template>
