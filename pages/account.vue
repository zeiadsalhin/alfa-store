<script setup>
import Swal from 'sweetalert2'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const dataview = ref()
const name = ref()
const phone = ref()
const email = ref()
const auth = ref()
onMounted(async () => {
    try {
        const { data, error } = await supabase.auth.getSession(); // get session status from local cookies

        if (data.session.user.user_metadata.role == 'admin') {  // Only access to regular users
            navigateTo("/admin")
            // console.log('this user is admin')
        } else {
            dataview.value = true
            name.value = data.session.user.identities[0].identity_data.first_name // Display registered username
            phone.value = data.session.user.identities[0].identity_data.phone// Display registered id
            email.value = data.session.user.identities[0].email // Display registered email
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
        <div v-if="dataview" class="mt-20 md:w-1/2 bg-zinc-900 p-10 text-center mx-auto text-white">
            <p class="font-semibold text-3xl">Welcome, {{ name }}</p>
            <div class="icon p-5"><v-icon size="100">mdi-account</v-icon></div>
            <v-btn @click="LogOut" min-height="40" min-width="120" class="m-5" color="grey-darken-3">Logout</v-btn>

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


        </div>
    </div>
</template>