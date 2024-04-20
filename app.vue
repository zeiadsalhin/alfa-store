<template>
  <div>
    <NuxtLayout>
      <v-app>
        <!-- <Nav /> -->
        <NuxtPage />
      </v-app>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
useSeoMeta({
  title: 'Alfa Store',
  ogTitle: 'Alfa Store',
  description: '',
  ogDescription: '',
  // ogImage: 'https://example.com/image.png',
  // twitterCard: 'summary_large_image',
})
</script>
