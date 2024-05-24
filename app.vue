<template>
  <NuxtLayout>
    <v-app>
      <Loader />
      <Nav />
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>
<script setup lang="ts">
useSeoMeta({
  title: 'Alfa Store',
  ogTitle: 'Alfa Store',
  description: '',
  ogDescription: '',
  ogImage: 'https://alfastorecommerce.netlify.app/logoc.png',
  twitterCard: 'summary_large_image',
})
</script>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.1s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;

}
</style>
