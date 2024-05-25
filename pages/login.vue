<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const errMsg = ref()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const dataview = ref()
const authenticating = ref(false)
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
        <!--Login Form Body-->
        <!--will only render when no user exist-->
        <div v-if="dataview"
            class="p-1 md:p-5 md:my-20 mt-32 flex-col justify-center mx-auto w-11/12 h-fit shadow-2xl rounded-md bg-">
            <v-img src="/logoc.png" :class="theme.global.current.value.dark ? 'bg-inherit ' : 'bg-zinc-900'"
                class="p-2 mx-auto" width="350" alt="logo"></v-img>
            <h1 class="text-3xl md:text-5xl text-center font-bold p-5">Log in</h1>

            <div class="w-1/4 h-1 mt-5 rounded-xl mx-auto bg-gray-600 dark:bg-gray-900"></div>
            <form id="form" class="space-y-5 p-5 w-11/12 md:w-1/2 h-fit text-center mx-auto justify-center flex-col"
                @submit.prevent="signIn">
                <!--input fields-->
                <div :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'"
                    class="text relative outline outline-1 px-2 outline-zinc-700 rounded-lg my-auto w-11/12 mx-auto">
                    <label :class="theme.global.current.value.dark ? 'text-white' : 'bg-zinc-100 text-zinc-800'"
                        class="label hover:cursor-text text-left absolute top-4 bg-inherit rounded-md px-2 text-lg font-semibold"
                        for="email">Email</label>
                    <input id="email" name="email" v-model="email" placeholder="" type="email" @focus="move"
                        @blur="back" class="text-black outline-none bg-transparent text-lg mt-4 mb-3 w-full"
                        :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                </div>
                <!---->
                <div class="password flex ml-4">
                    <div :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'"
                        class="pass mt-4 relative outline outline-1 px-2 outline-zinc-700 rounded-lg my-auto w-11/12 mx-auto">
                        <label :class="theme.global.current.value.dark ? 'text-white' : 'text-zinc-800'"
                            class="labelp hover:cursor-text text-left absolute top-4 bg-inherit rounded-md px-2 text-lg font-semibold"
                            for="pass">Password</label>
                        <input id="pass" name="password" v-model="password" placeholder="" @focus="movep" @blur="backp"
                            class="text-black outline-none bg-transparent text-lg mt-4 mb-3 w-full   "
                            :class="theme.global.current.value.dark ? 'text-white' : 'text-black'"
                            :type="showPassword ? 'text' : 'password'" required>

                    </div>
                    <div class="mt-8">
                        <v-icon class="ml-1" size="25" @click="toggleVisibility">
                            {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                    </div>
                </div>
                <!--Display error message if any-->
                <p class="text-red-500" v-if="errMsg">{{ errMsg }}</p>

                <!--Submit button-->
                <button @click="" type="submit"
                    :class="theme.global.current.value.dark ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-zinc-700 hover:bg-zinc-500 text-white hover:text-gray-50'"
                    class="px-5 m-5 py-2 w-44 text-lg rounded-md hover:cursor-pointer">
                    <v-progress-circular v-if="authenticating" width="2" size="20" color="darken-blue-4" class="m-1"
                        indeterminate></v-progress-circular>
                    Log in
                </button>
                <!--Return to Sign Up page-->
                <NuxtLink to="/signup"><button
                        class="px-5 m-5 py-2 w-fit hover:cursor-pointer mx-auto block hover:underline">
                        return to Sign Up
                    </button></NuxtLink>
            </form>
        </div>
        <!--End of Body-->
    </div>
</template>