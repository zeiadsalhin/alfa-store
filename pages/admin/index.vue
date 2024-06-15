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

onMounted(async () => {
    try {
        const { data, error } = await supabase.auth.getSession(); // get session status from local cookies

        if (data.session.user.user_metadata.role == 'admin') {  // access only for admins
            dataview.value = true
            name.value = data.session.user.identities[0].identity_data.first_name // Display registered username
            email.value = data.session.user.identities[0].identity_data.email
            signin.value = data.session.user.last_sign_in_at
            console.log('this user is admin')
        } else {
            navigateTo("/account")
            console.log('this user is regular')
        }
    } catch (error) {
        console.log(error);
    }

});


async function LogOut() {
    try {
        const { error } = await supabase.auth.signOut()
        Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'You Signed out successfully',
            toast: true,
            timer: 1000,
            showConfirmButton: false,
        }).then(() => {
            navigateTo("/login")
        })
    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <div>
        <div v-if="dataview" class="mt-16">
            <v-layout>
                <v-navigation-drawer :permanent="true" v-if="$vuetify.display.mdAndUp">
                    <v-list-item :title="name" :subtitle="email"></v-list-item>
                    <v-divider>Manage</v-divider>
                    <v-list-item link to="/admin">Home</v-list-item>
                    <v-divider></v-divider>
                    <v-list-item link to="/admin/orders">Orders</v-list-item>
                    <v-list-item link to="/admin/products">Products</v-list-item>
                </v-navigation-drawer>
                <v-bottom-navigation v-else permanent>
                    <v-btn to="/">
                        <v-icon>mdi-home</v-icon>
                        Home
                    </v-btn>
                    <v-btn to="/admin/orders">
                        <v-icon>mdi-cart</v-icon>
                        Orders
                    </v-btn>
                    <v-btn to="/admin/products">
                        <v-icon>mdi-truck</v-icon>
                        Products
                    </v-btn>
                    <v-btn to="/admin/products">
                        <v-icon>mdi-account</v-icon>
                        Account
                    </v-btn>
                </v-bottom-navigation>
                <v-main style="min-height: 300px;">
                    <div class="mt-20 p-5 w-fit m-5      ">
                        <div class="icon flex justify-center p-5"><v-icon size="50">mdi-shield-account</v-icon></div>
                        <p class="font-semibold md:text-3xl text-2xl">Welcome, {{ name }}</p>
                        <!-- <p class="mt-10">Last login: {{ signin.slice(0, 19).replace('T', ' ') }}</p> -->
                        <v-btn @click="LogOut" min-height="40" min-width="120" class="m-5 mx-auto"
                            color="grey-darken-3">Logout</v-btn>
                    </div>
                    <div class="w-fit dark: md:p-10 p-5 text-center mx-auto "
                        :class="theme.global.current.value.dark ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-black'">

                        <div class="h-1 w-full bg-zinc-950 mb-5 mt-5"></div>
                        <div class="products space-y-5 md:p-5">
                            <h1 class="text-3xl">Start managing products</h1>
                            <p class="p-5 text-2xl">Add product</p>
                            <Addproduct />
                        </div>
                    </div>
                    <NuxtPage />
                    <!-- <Addproduct /> -->
                </v-main>
            </v-layout>
        </div>
    </div>
</template>