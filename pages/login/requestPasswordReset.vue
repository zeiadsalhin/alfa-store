<script setup>
useSeoMeta({
    title: 'Alfa Store - Reset password',
    ogTitle: 'Alfa Store -  Reset password',
    description: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogDescription: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogImage: 'https://alfastorecommerce.netlify.app/mainicon.ico',
    twitterCard: 'summary_large_image',
})

import { useTheme } from 'vuetify'
const theme = useTheme();
const email = ref()
const errMsg = ref()
const succMsg = ref()

async function resetpassword() { // reset password by email link included token
    const supabase = useSupabaseClient()
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email.value, {
            redirectTo: 'https://alfastorecommerce.netlify.app/login/resetPassword',
        })
        console.log("link sent")
        succMsg.value = 'Link sent Successfully, please check your email' // display user message for success
    } catch (error) {
        console.log(error) // print error message for user
        errMsg.value = error
    }
}
</script>
<template>
    <div>
        <!--form body-->
        <!--renders on all states-->
        <div :class="theme.global.current.value.dark ? 'bg-zinc-900 text-white' : 'bg-zinc-100'"
            class="about mt-20 p-1 md:p-10 m-10 flex-co   l justify-center mx-auto w-11/12 h-fit shadow-inner rounded-md">
            <h1 class="text-2xl md:text-5xl  text-center font-bold p-4">Reset Password</h1>

            <div class="w-1/4 h-1 mt-5 rounded-xl mx-auto bg-zinc-800"></div>
            <form id="form" class="space-y-5 p-5 h-96 text-center mx-auto justify-center flex-col"
                @submit.prevent="resetpassword">
                <div class="form mt-3">
                    <label class="p-3 text-md md:text-xl block ">Enter your Email:</label>
                    <input placeholder="Enter your registered Email" id="email" v-model="email"
                        :class="theme.global.current.value.dark ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900'"
                        class=" placeholder:text-sm p-3 md:p-3 rounded-md outline outline-1 outline-zinc-500 focus:outline-2 w-2/3 md:w-1/4 "
                        type="email" required />
                </div>
                <!--Display error message if any-->
                <p class="text-red-500" v-if="errMsg">{{ errMsg }}</p>
                <!--Confirmation message-->
                <p class="text-green-600" v-if="succMsg">{{ succMsg }}</p>
                <button @click="" type="submit"
                    :class="theme.global.current.value.dark ? 'bg-zinc-950 text-white' : 'bg-zinc-700 text-white'"
                    class="px-5 py-2 md:w-1/4 mx-auto rounded-md hover:cursor-pointer hover:bg-zinc-600 hover:text-gray-800 bg-gray-800 ">
                    Send reset link
                </button>
            </form>
        </div>
    </div>
</template>