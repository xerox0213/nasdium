<script setup lang="ts">
definePage({
  name: "not-found",
});
</script>

<template>
  <UPage>
    <UPageBody>
      <UError
        :error="{
          statusCode: 404,
          statusMessage: 'Page not found',
          message: 'The page you are looking for does not exist.',
        }"
      />
    </UPageBody>
  </UPage>
</template>
