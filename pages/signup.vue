<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
import Swal from 'sweetalert2'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const errMsg = ref()
const displayname = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const dataview = ref()
async function signUpNewUser() { // Registration new user
    try {
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
            <img src="/logoc.png" :class="theme.global.current.value.dark ? 'bg-inherit ' : 'bg-black'"
                class="p-2 mx-auto" width="350" alt="logo">
            <h1 class="text-3xl md:text-5xl text-center font-bold p-2">Sign Up</h1>
            <div class="w-1/4 h-1 mt-5 rounded-xl mx-auto bg-gray-600 dark:bg-gray-9010"></div>
            <form id="form" class="p-5 text-center mx-auto justify-center flex-col" @submit.prevent="signUpNewUser">
                <!--Display error message if any-->
                <p class="text-red-500" v-if="errMsg">{{ errMsg }}</p>
                <div class="form md:flex justify-center">
                    <label class="p-3 text-md md:text-xl text-right md:mr-14 mx-6">Name</label>
                    <input id="name" type="name" v-model="displayname" spellcheck="false"
                        class="bg-gray-300 text-black h-fit my-auto p-1 md:p-2 rounded-md focus:outline-none border-2  w-2/3 md:w-1/4 "
                        required />
                </div>
                <!--Error Message-->
                <p id="errorn" class="hidden text-sm text-red-700">Please Check your Name</p>

                <div class="form mt-3 md:flex justify-center">
                    <label class="px-4 py-3 text-md md:text-xl md:mr-20 mx-6">Email</label>
                    <input id="email" v-model="email" spellcheck="false"
                        class="bg-gray-300 text-black h-fit my-auto p-1 md:p-2 rounded-md focus:outline-none border-2  w-2/3 md:w-1/4 "
                        type="email" required />

                </div>
                <!--Error Message email-->
                <p id="errore" class="hidden text-sm text-red-700">Please Check your Email</p>

                <div class="form mt-3 md:flex justify-center">
                    <label class="px-4 py-3 text-md md:text-xl md:mr-20 mx-6">Phone</label>
                    <input id="phone" v-model="phone" spellcheck="false"
                        class="bg-gray-300 text-black h-fit my-auto p-1 md:p-2 rounded-md focus:outline-none border-2  w-2/3 md:w-1/4 "
                        type="text" typeof="tel" required />
                </div>

                <div class="form mt-3 mb-5 md:flex justify-center">
                    <label class="py-3 text-md md:text-xl text-center md:mr-5 mx-6">Password</label>
                    <input id="password" v-model="password"
                        class="bg-gray-300 text-black h-fit my-auto p-1 md:p-2 rounded-md focus:outline-none border-2  w-2/3 md:w-1/4 "
                        type="password" required />

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
                    class="px-5 py-2 w-32 rounded-md hover:cursor-pointer bg-gray-500 text-white hover:bg-gray-600 hover:text-gray-50">
                    Sign Up
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