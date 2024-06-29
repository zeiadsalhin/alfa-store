<template>
  <NuxtLayout>
    <v-app>
      <Loader />
      <Nav />
      <AdminNav v-if="$route.path.includes('/admin')" />
      <v-main>
        <NuxtPage />
      </v-main>
      <BottomNavAdmin v-if="$route.path.includes('/admin')" />
      <BottomNav v-if="$route.path.includes('/user')" />
    </v-app>
  </NuxtLayout>
</template>
<script setup lang="ts">
useSeoMeta({
  title: 'Alfa Store',
  ogTitle: 'Alfa Store',
  description: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
  ogDescription: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
  ogImage: 'https://alfastorecommerce.netlify.app/mainicon.ico',
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
