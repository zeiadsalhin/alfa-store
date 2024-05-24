<template>
    <div>
        <Carousel />
        <v-container>
            <h1 class="text-3xl p-5">Check out</h1>
            <ProductSlider />
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
        if (!localStorage.getItem("scheme")) {
            localStorage.setItem("scheme", "dark")
        }
    },
}
</script>
