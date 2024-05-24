<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
import Swal from 'sweetalert2'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const isFocused1 = ref(false)
const isFocused2 = ref(false)
const isFocused3 = ref(false)
const isFocused4 = ref(false)
const errMsg = ref()
const displayname = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const phone = ref('')
const dataview = ref()
const authenticating = ref(false)
// show password
function toggleVisibility() {
    showPassword.value = !showPassword.value;
}

async function signUpNewUser() { // Registration new user
    try {
        authenticating.value = true
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                data: {
                    first_name: displayname.value,
                    // last_name: 'second name',
                    // role: 'user',
                    phone: phone.value,
                },
            }
        })

        if (error) { throw error }; // throw console error
        // successMsg.value = 'Success'
        console.log('Signed up successfully')
        Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'You Signed Up successfully',
            toast: true,
            timer: 2000,
            showConfirmButton: false,
        }).then(() => {
            navigateTo("Login") // Navigate to login
        })
    } catch (error) {
        errMsg.value = error
        console.log(error)
        authenticating.value = false
    }
}

watch(user, () => {
    if (user.value) {
        // Redirect to protected page
        return navigateTo('/')
    } else {
        dataview.value = true
    }
}, { immediate: true })
</script>
<template>
    <div>
        <!--Form Body-->
        <!--will only render when no user exist-->
        <div v-if="dataview"
            class="p-1 md:p-10 1my-5 mt-20 flex-col justify-center mx-auto h-fit w-11/12 rounded-md shadow-inner">
            <v-img src="/logoc.png" :class="theme.global.current.value.dark ? 'bg-inherit ' : 'bg-zinc-900'"
                class="p-2 mx-auto" width="350" alt="logo"></v-img>

            <h1 class="text-3xl md:text-5xl text-center font-bold p-2">Sign Up</h1>
            <div class="w-1/4 h-1 mt-5 rounded-xl mx-auto bg-gray-600 dark:bg-gray-9010"></div>

            <form id="form" class="p-5 text-center mx-auto justify-center flex-col w-full"
                @submit.prevent="signUpNewUser">
                <!--Display error message if any-->
                <p class="text-red-500" v-if="errMsg">{{ errMsg }}</p>
                <div class="form flex justify-center  w-full md:w-1/3  mx-auto">
                    <label class="p-3 text-md md:text-xl text-right md:mr-14 mr-7">Name</label>
                    <input id="name" type="name" v-model="displayname" spellcheck="false"
                        :class="theme.global.current.value.dark ? 'bg-zinc-700 text-white' : 'bg-white text-black', isFocused1 ? 'ring-2' : 'ring-1'"
                        class=" ring-zinc-500 h-fit my-auto p-1 md:p-2 rounded-md focus:outline-none border-2  w-full"
                        @focus="isFocused1 = true" @blur="isFocused1 = false" required />
                </div>
                <!--Error Message-->
                <p id="errorn" class="hidden text-sm text-red-700">Please Check your Name</p>

                <div class="form mt-3 flex justify-center  w-full md:w-1/3  mx-auto">
                    <label class="px-4 py-3 text-md md:text-xl md:mr-20 mr-6">Email</label>
                    <input id="email" v-model="email" spellcheck="false"
                        :class="theme.global.current.value.dark ? 'bg-zinc-700 text-white' : 'bg-zinc-100 text-black', isFocused2 ? 'ring-2' : 'ring-1'"
                        class=" ring-zinc-500  h-fit my-auto p-1 md:p-2 rounded-md focus:outline-none border-2  w-full"
                        type="email" @focus="isFocused2 = true" @blur="isFocused2 = false" required />

                </div>
                <!--Error Message email-->
                <p id="errore" class="hidden text-sm text-red-700">Please Check your Email</p>

                <div class="form mt-3 flex justify-center w-full md:w-1/3  mx-auto">
                    <label class="px-4 py-3 text-md md:text-xl md:mr-20 mr-4">Phone</label>
                    <input id="phone" v-model="phone" spellcheck="false"
                        :class="theme.global.current.value.dark ? 'bg-zinc-700 text-white' : 'bg-zinc-100 text-black', isFocused3 ? 'ring-2' : 'ring-1'"
                        class=" ring-zinc-500  h-fit my-auto p-1 md:p-2 rounded-md focus:outline-none border-2  w-full"
                        type="text" typeof="tel" @focus="isFocused3 = true" @blur="isFocused3 = false" required />
                </div>

                <div class="form mt-3 mb-5 flex justify-center w-full md:w-1/3 mx-auto">
                    <label class="py-3 text-md md:text-xl text-center md:mr- mr-6">Password</label>
                    <input id="password" v-model="password"
                        :class="theme.global.current.value.dark ? 'bg-zinc-700 text-white' : 'bg-zinc-100 text-black', isFocused4 ? 'ring-2' : 'ring-1'"
                        class=" ring-zinc-500 h-fit my-auto p-1 md:p-2 rounded-md focus:outline-none border-2  w-full md:w-full "
                        :type="showPassword ? 'text' : 'password'" @focus="isFocused4 = true" @blur="isFocused4 = false"
                        required />
                    <v-icon class="my-auto m-1 " size="25" @click="toggleVisibility">
                        {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                </div>
                <!--Error Message password-->
                <p id="errorp" class="hidden text-sm text-red-700">Please Check your Password</p>
                <span class="block text-sm opacity-40 p-2 -mt-2 mb-5 space-y-1">
                    <ul>Ex: Min 6 Characters and Must Include</ul>
                    <li>Capital letter</li>
                    <li>Special Character</li>
                    <li>At least one number</li>
                </span>
                <!--Submit button-->
                <button id="submitbtn" @click="" type="submit"
                    :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-500 hover:bg-zinc-700 text-white hover:text-gray-50'"
                    class="px-5 py-2 w-32 rounded-md hover:cursor-pointer">
                    <v-progress-circular v-if="authenticating" width="2" size="20" color="darken-blue-4" class="m-1"
                        indeterminate></v-progress-circular>Sign Up
                </button>
                <!--separator-->
                <div class="">
                    <div class="relative md:w-1/4 h-1 m-5 rounded-xl mx-auto bg-gray-800">

                    </div>
                </div>
                <!--navigate to login page-->
                <p class="m-5 text-center">Already have an account?</p>
                <NuxtLink to="/login" onclick=""
                    class="text-center mx-auto flex w-48 justify-center px-5 py-2 rounded-md hover:cursor-pointer dark:bg-gray-800 text-white hover:bg-gray-600 ">
                    login</NuxtLink>
            </form>
            <!--End of body-->
        </div>
    </div>
</template>