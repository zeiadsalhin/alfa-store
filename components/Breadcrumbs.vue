<template>
    <v-breadcrumbs :items="breadcrumbItems"></v-breadcrumbs>
</template>

<script setup>
const router = useRouter()
const currentRoute = router.currentRoute.value

const breadcrumbItems = ref([])

const generateBreadcrumbs = (route) => {
    const pathSegments = route.path.split('/').filter(segment => segment !== '')

    return pathSegments.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
}

const updateBreadcrumbs = () => {
    breadcrumbItems.value = generateBreadcrumbs(currentRoute)
}

watch(() => currentRoute, updateBreadcrumbs, { immediate: true })

onMounted(updateBreadcrumbs)


</script>