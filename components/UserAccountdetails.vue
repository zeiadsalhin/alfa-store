<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
import Swal from 'sweetalert2'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const dataview = ref()
const avatar = ref()
const displayname = ref()
const phone = ref()
const isDisabledp = ref(true);
const email = ref()
const isDisablede = ref(true);
const signin = ref()
const auth = ref()
onMounted(() => {
    FetchUserData()
})
//fetch user data
async function FetchUserData() {
    try {
        const { data, error } = await supabase.auth.getSession(); // get session status from local cookies
        // console.log(data.session.user);
        if (data.session.user.user_metadata.role == 'admin') {  // Only access to regular users
            navigateTo("/admin")
            // console.log('this user is admin')
        } else {
            dataview.value = true
            avatar.value = data.session.user.identities[0].identity_data.avatar_url
            displayname.value = data.session.user.identities[0].identity_data.first_name || data.session.user.identities[0].identity_data.full_name // Display registered username
            phone.value = data.session.user.phone// Display registered id
            email.value = data.session.user.identities[0].email // Display registered email 
            const date = new Date(data.session.user.last_sign_in_at).toLocaleString('en-us')// last login
            signin.value = date
            auth.value = data.session.user.role // Display account status
            // console.log('user phone: ', data.session.user.phone)
        }
    } catch (error) {
        console.log(error);
    }
}

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

async function UpdatePhone() {
    try {
        // // verify otp
        // const { error: otpRequestError } = await supabase.auth.api.sendOtp('sms', newPhoneNumber.value);
        // if (otpRequestError) {
        //     throw new Error('Failed to send OTP. Please try again later.');
        // }

        // // Step 2: Prompt user for OTP and verify
        // const token = prompt('Please enter the OTP sent to your new number:');
        // if (!token) return; // Handle cancellation or empty input

        // const { error: verifyError } = await supabase.auth.verifyOtp({
        //     phone: newPhoneNumber.value,
        //     token,
        //     type: 'phone_change'
        // });
        // if (verifyError) {
        //     console.error('Error verifying OTP:', verifyError.message);
        //     alert(`Error verifying OTP: ${verifyError.message}`);
        //     return;
        // }

        const { data, error: updateError } = await supabase.auth.updateUser({
            phone: phone.value
        })
        if (updateError) {
            throw updateError
        } else {
            isDisabledp.value = true
            FetchUserData();
        }

    } catch (error) {
        console.log(error);
    }
}

// update email
async function UpdateEmail() {
    try {
        // // verify otp
        // const { error: otpRequestError } = await supabase.auth.api.sendOtp('sms', newPhoneNumber.value);
        // if (otpRequestError) {
        //     throw new Error('Failed to send OTP. Please try again later.');
        // }

        // // Step 2: Prompt user for OTP and verify
        // const token = prompt('Please enter the OTP sent to your new number:');
        // if (!token) return; // Handle cancellation or empty input

        // const { error: verifyError } = await supabase.auth.verifyOtp({
        //     phone: newPhoneNumber.value,
        //     token,
        //     type: 'phone_change'
        // });
        // if (verifyError) {
        //     console.error('Error verifying OTP:', verifyError.message);
        //     alert(`Error verifying OTP: ${verifyError.message}`);
        //     return;
        // }

        const { data, error: updateError } = await supabase.auth.updateUser({
            email: email.value
        })
        if (updateError) {
            throw updateError
        } else {
            isDisabledp.value = true
            FetchUserData();
        }

    } catch (error) {
        console.log(error);
    }
}
</script>
<template>
    <div>
        <div v-if="dataview" class="mt-16 md:w-1/2  p-10 text-center mx-auto"
            :class="theme.global.current.value.dark ? 'text-white bg-zinc-900' : 'text-zinc-800 bg-zinc-100'">
            <p class="font-semibold text-3xl">Welcome, {{ displayname }}</p>
            <div class="icon p-5"><v-img v-if="avatar" :src="avatar" width="120" class="mx-auto rounded-full"></v-img>
                <v-icon v-else size="100">mdi-account</v-icon>
            </div>
            <v-btn @click="LogOut" min-height="40" min-width="120" class="m-5" color="grey-darken-3">Logout</v-btn>
            <p class="mt-10">Last login: {{ signin.slice(0, 19).replace('T', ' ') }}</p>
            <div class="bg-zinc-800 w-1/3 mx-auto h-0.5 mt-10 mb-5"></div>
            <div class="details text-left">
                <h1 class="text-2xl p-2">Account Details:</h1>
                <div class="phone">
                    <form @submit.prevent="UpdatePhone" class="w-full flex py-2 space-x-3">
                        <label for="id" class="text-xl my-auto">Phone:</label>
                        <input :disabled="isDisabledp" :value="phone" v-model="phone" class="text-lg p-0.5 my-auto w-32"
                            :class="isDisabledp ? '' : 'outline outline-1'" required></input>
                        <v-btn v-if="isDisabledp" @click="isDisabledp = false" max-height="30" max-width="10"
                            variant="tonal"><v-icon>{{
                                isDisabledp ?
                                    'mdi-pencil' : '' }}</v-icon></v-btn>
                        <div v-else class="cancelandupdatebutton">
                            <v-btn @click="UpdatePhone" max-height="30" max-width="10" variant="tonal"
                                class="m-1"><v-icon>{{
                                    isDisabledp ?
                                        '' : 'mdi-content-save' }}</v-icon>
                            </v-btn>
                            <v-btn @click="isDisabledp = true" max-height="30" max-width="10" variant="tonal"
                                class="mx-1"><v-icon>{{
                                    isDisabledp ?
                                        '' : 'mdi-close' }}</v-icon>
                            </v-btn>
                        </div>
                    </form>
                </div>
                <div class="email">
                    <form @submit.prevent="UpdateEmail" class="w-full flex py-2 space-x-4">
                        <label for="id" class="text-xl my-auto">Email:</label>
                        <input :disabled="isDisablede" :value="email" v-model="email"
                            class="text-lg p-0.5 my-auto w-fit" :class="isDisablede ? '' : 'outline outline-1'"
                            required></input>
                        <v-btn v-if="isDisablede" @click="isDisablede = false" max-height="30" class="w-10"
                            variant="tonal"><v-icon>{{
                                isDisablede ?
                                    'mdi-pencil' : '' }}</v-icon></v-btn>
                        <div v-else class="cancelandupdatebutton">
                            <v-btn @click="UpdatePhone" max-height="30" max-width="10" variant="tonal"
                                class="m-1"><v-icon>{{
                                    isDisablede ?
                                        '' : 'mdi-content-save' }}</v-icon>
                            </v-btn>
                            <v-btn @click="isDisablede = true" max-height="30" max-width="10" variant="tonal"
                                class="mx-1"><v-icon>{{
                                    isDisablede ?
                                        '' : 'mdi-close' }}</v-icon>
                            </v-btn>
                        </div>
                    </form>
                </div>
                <div class="authenticationstate w-full py-2 space-x-5">
                    <label class="text-xl">Account:</label>
                    <label for="auth" class="text-lg my-auto">{{ auth }}</label>
                    <template v-if="auth == 'authenticated'">
                        <v-icon class="mb-1" size="25">mdi-check-decagram</v-icon>
                    </template>
                </div>
            </div>
            <div class="bg-zinc-800 w-1/3 mx-auto h-0.5 mt-10 mb-5"></div>
            <ResetPassword />
            <div class="bg-zinc-800 w-1/3 mx-auto h-0.5 mt-10 mb-5"></div>
            <UserAccountOrders />
            <UserAccountAddresses />
        </div>
    </div>
</template>