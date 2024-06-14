<script setup>
import { useTheme } from 'vuetify'
import ContactUs from '~/pages/Contact-us.vue';
const theme = useTheme();
const date = new Date().getFullYear()
</script>
<template>
    <div class="custom-card transition ease-in-out duration-300 w-full h-32 -mb-12"
        :class="theme.global.current.value.dark ? 'bg-[#111] ' : 'bg-[#444]'">
    </div>
    <v-card :tile="true" :flat="true" class="pa-md-10 pa-5 text-center" color="surface">
        <div class="main md:flex flex-row justify-around p-5">
            <div class="1 p-5">
                <v-img src="/icon.ico" class="p-5 mx-auto" width="250" alt="logo"></v-img>
            </div>
            <div class="2 p-5 flex flex-col">
                <p class="text-lg text-left font-weight-bold mt-5 mb-2">Shop</p>
                <nuxtLink :to="b.link" color="surface" class="space-y-1 brightness-75 hover:brightness-100 flex"
                    v-for="(b, i) in navigation" :key="`navigation${i}`" fab depressed>
                    <p>{{ b.name }}</p>
                    <!-- <v-icon>{{ b.icon }}</v-icon> -->
                </nuxtLink>
            </div>
            <div class="3 p-5">
                <p class="text-md font-weight-bold mt-5 mb-2">Store by</p>
                <p class="text-md mt-4 mb-2">ZiadSalhin@github</p>
                <p class=" mb-5">
                    <a href="https://github.com/zeiadsalhin"
                        class="my-auto brightness-50 hover:brightness-100 transform transition ease-in-out duration-400 ">
                        Follow me:
                        <v-icon icon="mdi-github" size="large"></v-icon>
                    </a>
                </p>
            </div>
            <div class="4 p-5 shadow-2xla">
                <p class="text-md mt-5 mb-2">Stay connected</p>
                <h2 class="text-xl font-weight-bold py-2">Alfa Store Ltd</h2>
                <div class="text-center p-2">
                    <v-btn color="surface" class="mr-2" v-for="(b, i) in sm" :key="`sm${i}`" fab depressed>
                        <v-icon>{{ b.icon }}</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>
        <br />
        <!-- <br /> -->
        <ContactUs />
        <!-- <div class="h-0.5 w-1/3 mx-auto bg-zinc-800 rounded-full mt-5 mb-5"></div> -->
        <p class="opacity-80 mt-5">©{{ date }} - Alfa Stores</p>
    </v-card>

</template>

<script>
export default {
    data() {
        return {
            sm: [
                { icon: "mdi-facebook", link: "#" },
                { icon: "mdi-twitter", link: "#" },
                { icon: "mdi-instagram", link: "#" },
                { icon: "mdi-youtube", link: "#" },
            ],
            navigation: [
                { icon: "", name: "Home", link: "/" },
                { icon: "", name: "Products", link: "/products" },
                { icon: "", name: "News", link: "#" },
                { icon: "", name: "Offers", link: "#" },
                { icon: "", name: "Contact Us", link: "/Contact-us" },
            ],
        };
    },
};
</script>
<style>
.custom-card {
    width: 100%;
    position: relative;
    z-index: 9;
    border-top-right-radius: 1000px 0px;
    border-top-left-radius: 8000px 400px;
}
</style>
