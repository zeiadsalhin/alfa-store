<script setup>
import Swal from 'sweetalert2'
import { useTheme } from 'vuetify'
import { useMainStore } from '@/store';
const mainStore = useMainStore();
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
            name.value = data.session.user.identities[0].identity_data.first_name // Display registered username
            email.value = data.session.user.identities[0].identity_data.email
            const date = new Date(data.session.user.last_sign_in_at).toLocaleString('en-us')
            signin.value = date
            // console.log('component:', data);
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
            mainStore.clearCart();
            navigateTo("/login")
        })
    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <div>
        <div class="Information md:flex mt-20">
            <div class="mt-0 mx-auto p-5 w-fit m-5      ">
                <div class="icon flex justify-center p-5"><v-icon size="50">mdi-shield-account</v-icon>
                </div>
                <p class="font-semibold md:text-3xl text-2xl">Welcome, {{ name }}</p>
                <p class="mt-10">Last login: {{ signin }}</p>
                <v-btn @click="LogOut" min-height="40" min-width="120" class="m-5 mx-auto"
                    color="grey-darken-3">Logout</v-btn>
            </div>
            <StoreStatics />
        </div>
    </div>
</template>