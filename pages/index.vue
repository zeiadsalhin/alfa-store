<script setup>
// onMounted(() => {
//     // handleuser()
// })
// async function handleuser() {
//     const supabase = useSupabaseClient()
//     const { data, error } = await supabase.auth.getSession();
//     if (error) {
//         console.error('Error fetching session:', error.message);
//         return;
//     }
//     if (!data.session) {
//         console.log('no user found');

//     } else {
//         console.log('User is already logged in:');
//     }
// }
useSeoMeta({
    title: 'Alfa Store - Home',
    ogTitle: 'Alfa Store - Home',
    description: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogDescription: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogImage: 'https://alfastorecommerce.netlify.app/mainicon.ico',
    twitterCard: 'summary_large_image',
})
</script>
<template>
    <div>
        <Ads />
        <Carousel />
        <v-container>
            <div class="bg-zinc-800 w-1/3 mx-auto h-0.5 mt-10 mb-5"></div>
            <div class="Title2 flex">
                <div class="bg-zinc-800 w-1.5 h-10 my-auto"></div>
                <h1 class="md:text-3xl text-xl font-semibold p-5">Check out Latest Products</h1>
                <nuxt-link to="/products" class="my-auto hover:underline md:text-lg">view all</nuxt-link>
            </div>
            <ProductSlider />
            <div class="bg-zinc-800 w-1/3 mx-auto h-0.5 mt-10 mb-5"></div>
            <Newsletter />
        </v-container>
        <Footer />
    </div>
</template>
<script>
export default {
    data() {
        return {
            // products: null,
            // sale_items: null
        }
    },
    methods: {

    },
    mounted() {
        if (!localStorage.getItem(" scheme")) { localStorage.setItem("scheme", "customDarkTheme") }
    },
} </script>
