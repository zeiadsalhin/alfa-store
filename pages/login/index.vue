<script setup>
useSeoMeta({
    title: 'Alfa Store - Login',
    ogTitle: 'Alfa Store -  Login',
    description: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogDescription: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogImage: 'https://alfastorecommerce.netlify.app/mainicon.ico',
    twitterCard: 'summary_large_image',
})

import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()
const errMsg = ref()
const emailconfirm = computed(() => route.query.confirmemail)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const dataview = ref()
const authenticating = ref(false)
const props = defineProps(['emailtest']);
function move() {
    document.querySelector(".label").classList.add("-translate-y-8")
    document.querySelector(".label").classList.add("-translate-x-1")
    document.querySelector(".text").classList.add("outline")
}
function back() {
    if (document.querySelector("#email").value == '') {
        document.querySelector(".label").classList.remove("-translate-y-8")
        document.querySelector(".label").classList.remove("-translate-x-2")
    } else {
        document.querySelector(".text").classList.add("outline-2")
    }
}
function movep() {
    document.querySelector(".labelp").classList.add("-translate-y-8")
    document.querySelector(".labelp").classList.add("-translate-x-1")
    document.querySelector(".pass").classList.add("outline")
}
function backp() {
    if (document.querySelector("#pass").value == '') {
        document.querySelector(".labelp").classList.remove("-translate-y-8")
        document.querySelector(".labelp").classList.remove("-translate-x-2")
    } else {
        document.querySelector(".pass").classList.add("outline-2")
    }
}
// show password
function toggleVisibility() {
    showPassword.value = !showPassword.value;
}

// sign in email
const signIn = async () => {
    authenticating.value = true
    const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,

    })
    if (error) console.log(error)
    errMsg.value = error
    authenticating.value = false
}

// sign in google
const signInGoogle = async () => {
    authenticating.value = true
    const supabase = useSupabaseClient()
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google'
        })

        if (error) {
            throw error
        }
        // authenticating.value = false
    } catch (error) {
        console.log(error);
    }
}

// sign in github
const signInGithub = async () => {
    authenticating.value = true
    const supabase = useSupabaseClient()
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github'
        })

        if (error) {
            throw error
        }
        // authenticating.value = false
    } catch (error) {
        console.log(error);
    }
}

watch(user, () => {
    if (user.value) {
        // Redirect to protected page
        return navigateTo('/admin')
    } else {
        dataview.value = true
    }
}, { immediate: true })
</script>
<template>
    <div>
        <!--Login Form Body-->
        <!--will only render when no user exist-->
        <div v-if="dataview"
            class="p-1 md:p-5 md:my-20 mt-20 flex-col justify-center mx-auto w-11/12 h-fit shadow-2xl rounded-md bg-">
            <v-img src="/icon.ico" :class="theme.global.current.value.dark ? 'bg-inherit ' : 'bg-zinc-800'"
                class="p-2 mx-auto" width="350" alt="logo"></v-img>
            <!--Confirmation-->
            <p v-if="emailconfirm"
                class="fleax flex-roaw w-10/12 mt-5 mx-auto shadow-md rounded-sm bg-green-600 text-white my-2 p-3">A
                confirmation
                sent to Your
                email:
            <p class="underline inline-block">{{ emailconfirm
                }}</p>, Please confirm it before signing in.</p>
            <h1 class="text-3xl mb-5 md:text-5xl text-center font-bold p-5">Log in</h1>

            <!-- <div class="w-1/4 h-1 mt-5 rounded-xl mx-auto bg-gray-600 dark:bg-gray-900"></div> -->
            <!--login with google-->
            <div class="md:flex flex-row justify-center text-center mx-auto p-3">
                <v-btn @click="signInGoogle" min-height="45" min-width="150" class="m-2" color="blue-darken-3">
                    <v-icon size="30" class="m-1 w-full">mdi-google</v-icon>Login With Google</v-btn>
                <v-btn @click="signInGithub" min-height="45" min-width="150" class="m-2" color="gry">
                    <v-icon size="30" class="m-1 w-full">mdi-github</v-icon>Login With Github</v-btn>
            </div>

            <!--Separator-->
            <div class="flex justify-center mx-auto w-11/12 md:w-1/3 p-3">
                <div class="w-1/2 h-1 my-auto rounded-xl mx-auto bg-zinc-900 opacity-80"></div>
                <p class="text-center my-auto text-xl font-semibold w-16">Or</p>
                <div class="w-1/2 h-1 my-auto rounded-xl mx-auto bg-zinc-900 opacity-80"></div>
            </div>
            <form id="form" class="space-y-5a p-5 w-11/12 md:w-1/3 h-fit text-center mx-auto justify-center flex-col"
                @submit.prevent="signIn">
                <!--input fields-->
                <div :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'"
                    class="text relative outline outline-1 px-2 outline-zinc-700 rounded-lg my-auto w-11/12 mx-auto">
                    <label :class="theme.global.current.value.dark ? 'text-white' : 'bg-zinc-100 text-zinc-800'"
                        class="label hover:cursor-text text-left absolute top-4 bg-inherit rounded-md px-2 text-lg font-semibold"
                        for="email">Email*</label>
                    <input id="email" name="email" v-model="email" placeholder="" type="email" @focus="move"
                        @blur="back" class="text-black outline-none bg-transparent text-lg mt-4 mb-3 w-full"
                        :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                </div>
                <!---->
                <div :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'"
                    class="pass mt-5 relative outline outline-1 px-2 outline-zinc-700 rounded-lg my-auto w-11/12 mx-auto flex">
                    <label :class="theme.global.current.value.dark ? 'text-white' : 'text-zinc-800'"
                        class="labelp hover:cursor-text text-left absolute top-4 bg-inherit rounded-md px-2 text-lg font-semibold"
                        for="pass">Password*</label>
                    <input id="pass" name="password" v-model="password" placeholder="" @focus="movep" @blur="backp"
                        class="text-black outline-none bg-transparent text-lg mt-4 mb-3 w-full   "
                        :class="theme.global.current.value.dark ? 'text-white' : 'text-black'"
                        :type="showPassword ? 'text' : 'password'" required>
                    <div class="my-auto m-2">
                        <v-icon class="my-auto" size="25" @click="toggleVisibility">
                            {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                    </div>
                </div>
                <div class="options flex justify-between text-sm mt-1">
                    <NuxtLink to="/login/oneClickLogin"><button type="button"
                            class="py-2 opacity-70 w-fit hover:cursor-pointer amx-auto bloack hover:underline">
                            OneClick Login
                        </button></NuxtLink>
                    <NuxtLink to="/login/requestPasswordReset"><button type="button"
                            class="py-2 opacity-70 w-fit hover:cursor-pointer amx-auto bloack hover:underline">
                            Forget Password?
                        </button></NuxtLink>
                </div>
                <!--Display error message if any-->
                <p class="text-red-500" v-if="errMsg">{{ errMsg }}</p>

                <!--Submit button-->
                <v-btn @click="" type="submit" max-height="44" min-height="44" variant="tonal" prepend-icon="mdi-login"
                    :ripple="false" :elevation="1" class="m-5 w-44 text-lg rounded-md hover:cursor-pointer">
                    <v-progress-circular v-if="authenticating" width="2" size="20" color="darken-blue-4" class="m-1"
                        indeterminate></v-progress-circular>
                    Log in
                </v-btn>
                <div class="flex w-fit space-x-5 mx-auto mt-8">
                    <!--navigate to login page-->
                    <p class="mr- my-auto text-center">Don't have an account?</p>
                    <NuxtLink to="/signup"><button type="button"
                            class="py-2 opacity-70 w-fiat mx-auto block hover:underline">
                            Sign Up
                        </button></NuxtLink>
                </div>
                <!--Return to Sign Up page-->
                <!-- <NuxtLink to="/signup"><button
                        class="px-5 m-5 py-2 w-fit hover:cursor-pointer mx-auto block hover:underline">
                        return to Sign Up
                    </button></NuxtLink> -->
            </form>
        </div>
        <!--End of Body-->
    </div>
</template>