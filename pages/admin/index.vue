<script setup>
import Swal from 'sweetalert2'
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const dataview = ref()
const name = ref()
const email = ref()
const signin = ref()

//seo 
useSeoMeta({
    title: `Alfa Store - Admin Panel`,
    ogTitle: `Alfa Store - Admin Panel`,
    description: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogDescription: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogImage: 'https://alfastorecommerce.netlify.app/mainicon.ico',
    twitterCard: 'summary_large_image',
})

onMounted(async () => {
    try {
        const { data, error } = await supabase.auth.getSession(); // get session status from local cookies

        if (data.session.user.user_metadata.role == 'admin') {  // access only for admins
            dataview.value = true
            console.log('this user is admin')
        } else {
            navigateTo("/user/account")
            console.log('this user is regular')
        }
    } catch (error) {
        console.log(error);
    }

});
</script>
<template>
    <div>
        <div v-if="dataview" class="md:mt-16">
            <v-layout>
                <v-navigation-drawer :permanent="true" v-if="$vuetify.display.mdAndUp">
                    <v-list-item :title="name" :subtitle="email"></v-list-item>
                    <v-divider>Manage</v-divider>
                    <v-list-item link to="/admin">Home</v-list-item>
                    <v-divider></v-divider>
                    <v-list-item link to="/admin/orders">Orders</v-list-item>
                    <v-list-item link to="/admin/products">Products</v-list-item>
                </v-navigation-drawer>




                <v-main style="min-height: 100px;">
                    <!-- <NuxtPage /> -->
                    <AdminAccountdetails />
                    <div class="w-11/12 rounded-lg md:p-10 p-2 text-center mx-auto "
                        :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'">
                        <div class="Management">
                            <div class="1 md:flex justify-around">
                                <div class="products md:w-full mt-10 md:p-5 py-5 px-1 rounded-lg"
                                    :class="theme.global.current.value.dark ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-black'">
                                    <v-icon size="30">mdi-cart</v-icon>
                                    <h1 class="text-3xl p-3">Start managing products</h1>
                                    <div class="h-1 w-1/2 mx-auto bg-zinc-950 mb-5 mt-5"></div>
                                    <Addproduct />
                                    <FetchProductsAdmin />
                                </div>
                                <div class="w-2 rounded-full bg-zinc-950 m-10"></div>
                                <div class="Ads md:w-full mt-10 md:p-5 py-5 px-1 rounded-lg"
                                    :class="theme.global.current.value.dark ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-black'">
                                    <AddAds />
                                    <FetchAds />
                                </div>
                            </div>
                            <div class="w-2 rounded-full bg-zinc-950 m-10"></div>
                            <div class="Orders md:w-full h-fit mt-10 md:p-5 py-5 px-1 rounded-lg"
                                :class="theme.global.current.value.dark ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-black'">
                                <FetchOrders />
                            </div>
                        </div>
                    </div>
                    <NuxtPage />
                    <!-- <Addproduct /> -->
                </v-main>
            </v-layout>
            <BottomNavAdmin />
        </div>
    </div>
</template>