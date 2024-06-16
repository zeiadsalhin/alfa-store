<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
import Swal from 'sweetalert2'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const dataview = ref()
const displayname = ref()
const phone = ref()
const email = ref()
const signin = ref()
const auth = ref()
onMounted(async () => {
    try {
        const { data, error } = await supabase.auth.getSession(); // get session status from local cookies
        console.log(data.session.user);
        if (data.session.user.user_metadata.role == 'admin') {  // Only access to regular users
            navigateTo("/admin")
            // console.log('this user is admin')
        } else {
            dataview.value = true
            displayname.value = data.session.user.identities[0].identity_data?.first_name || name // Display registered username
            phone.value = data.session.user.identities[0].identity_data.phone// Display registered id
            email.value = data.session.user.identities[0].email // Display registered email
            signin.value = data.session.user.identities[0].last_sign_in_at // last login
            auth.value = data.session.user.role // Display account status
            // console.log('this user is regular')

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
        <div v-if="dataview" class="mt-20 md:w-1/2  p-10 text-center mx-auto"
            :class="theme.global.current.value.dark ? 'text-white bg-zinc-900' : 'text-zinc-800 bg-zinc-100'">
            <p class="font-semibold text-3xl">Welcome, {{ displayname }}</p>
            <div class="icon p-5"><v-icon size="100">mdi-account</v-icon></div>
            <v-btn @click="LogOut" min-height="40" min-width="120" class="m-5" color="grey-darken-3">Logout</v-btn>
            <p class="mt-10">Last login: {{ signin.slice(0, 19).replace('T', ' ') }}</p>
            <div class="bg-zinc-800 w-1/3 mx-auto h-0.5 mt-10 mb-5"></div>
            <h1 class="text-2xl p-2">Account Details:</h1>
            <div class="w-full p-2 space-x-10">
                <label for="id" class="text-xl">Phone:</label>
                <label class="text-lg">{{ phone }}</label>
            </div>
            <div class="w-full py-2 flexs space-x-10">
                <label for="email" class="text-xl">Email:</label>
                <label class="text-lg">{{ email }}</label>
            </div>
            <div class="w-full py-2 space-x-10">
                <label for="auth" class="text-xl">Account:</label>
                <label class="text-lg">{{ auth }}</label>
            </div>
            <div class="bg-zinc-800 w-1/3 mx-auto h-0.5 mt-10 mb-5"></div>
            <ResetPassword />
            <UserAccountAddresses />
        </div>
    </div>
</template>