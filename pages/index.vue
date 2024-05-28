<template>
    <div>
        <Ads />
        <Carousel />
        <v-container>
            <div class="bg-zinc-800 w-1/3 mx-auto h-0.5 mt-10 mb-5"></div>
            <div class="Title2 flex">
                <div class="bg-zinc-800 w-1.5 h-10 my-auto"></div>
                <h1 class="text-3xl p-5">Check out Latest Products</h1>
            </div>
            <ProductSlider />
            <div class="bg-zinc-800 w-1/3 mx-auto h-0.5 mt-10 mb-5"></div>
            <Newsletter />
        </v-container>
        <Footer />
        <div class="flex w-screen h-32 " style=" 
        background-attachment: fixed;
        background-position-x: center;
        background-image: url('/stripes.svg'); 
        background-repeat: no-repeat;
        background-size: cover"></div>
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
