<script setup lang="ts">
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { useHead } from "@unhead/vue";

useHead({
  titleTemplate: (title) => `Nasdium ${title ? "- %s" : ""}`,
});
</script>

<template>
  <UApp>
    <UContainer>
      <RouterView />
    </UContainer>
  </UApp>

  <VueQueryDevtools />
</template>
