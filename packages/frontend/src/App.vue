<script setup lang="ts">
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { useHead } from "@unhead/vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

useHead({
  titleTemplate: (title) => `Nasdium ${title ? "- %s" : ""}`,
});

// Wait for the initial navigation (auth guard's /me check) before rendering.
const isRouterReady = ref<boolean>(false);

const router = useRouter();

router.isReady().finally(() => (isRouterReady.value = true));
</script>

<template>
  <UApp>
    <UContainer>
      <UProgress
        v-if="!isRouterReady"
        class="fixed inset-x-0 top-0"
        size="xs"
      />
      <RouterView v-else />
    </UContainer>
  </UApp>

  <VueQueryDevtools />
</template>
