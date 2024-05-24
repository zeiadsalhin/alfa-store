<script setup>
import Swal from 'sweetalert2'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const dataview = ref()
const name = ref()

onMounted(async () => {
    try {
        const { data, error } = await supabase.auth.getSession(); // get session status from local cookies

        if (data.session.user.user_metadata.role == 'admin') {  // access only for admins
            dataview.value = true
            name.value = data.session.user.identities[0].identity_data.first_name // Display registered username
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
    <div v-if="dataview" class="mt-20 md:w-1/2 dark:bg-zinc-900 p-10 text-center mx-auto text-white">
        <p class="font-semibold text-3xl">Welcome, {{ name }}</p>
        <div class="icon p-5"><v-icon size="100">mdi-shield-account</v-icon></div>
        <v-btn @click="LogOut" min-height="40" min-width="120" class="m-5" color="grey-darken-3">Logout</v-btn>
        <div class="h-1 w-full bg-zinc-950 mb-5 mt-5"></div>
        <div class="products space-y-5 p-5">
            <h1 class="text-3xl">Start managing products</h1>
            <p class="p-5 text-2xl">Add product</p>
            <Addproduct />
        </div>
    </div>
</template>