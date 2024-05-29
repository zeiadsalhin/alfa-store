<script setup>
import Swal from 'sweetalert2'
import { useTheme } from 'vuetify'
const theme = useTheme();
// const route = useRoute()
const router = useRouter()
const password = ref('')
const passwordconfirm = ref('')
const showPassword = ref(false)
const errMsg = ref()
const supabase = useSupabaseClient()
// onBeforeMount(() => {
//     handleuser()
// })

//import Auth client
// import { createClient } from '@supabase/supabase-js'

// const router = useRouter()
// const client = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)
// refs for inputs
// const pass1 = ref()
// const pass2 = ref()
// const errMsg = ref()
const succMsg = ref()
const dataview = ref()

// definePageMeta({
//     middleware: ["notauth"]// will not be loaded when there is no Authentication
// })

// get user info from cookies to render form if exist
onMounted(async () => {
    try {
        const { data, error } = await supabase.auth.getSession(); // get session info
        if (data.session) {
            dataview.value = true // render form when Token received
        } else {
            // router.push("/login")
        }
    } catch (error) {
        console.log(error);
    }

});
// show password
function toggleVisibility() {
    showPassword.value = !showPassword.value;
}

async function resetpassword() {// password reset for user
    try {
        if (password.value == passwordconfirm.value) {
            const { data, error } = await supabase.auth.updateUser({// update user info
                password: password.value
            })
            // display success message and redirect to login page
            console.log("updated")
            errMsg.value = ''
            succMsg.value = 'Password updated successfully'

            setTimeout(() => {
                router.push("/login")
            }, 1000);


        } else {
            errMsg.value = 'Password not match'// display error if passwords not match
        }

    } catch (error) {
        console.log(error)
        errMsg.value = error // display error message from API
    }
}

//Regex password
// function checkpassword() {
//     const input = document.querySelector("#pass1")
//     const b = document.querySelector("#submitbtn")
//     const e = document.querySelector("#errorp")

//     if (input.value.length < 6) {// min 6 and max 30
//         input.classList.add("border-red-500")
//         e.classList.remove("hidden")
//     } else {
//         if (input.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,30}$/)) { // Regex validation
//             input.classList.remove("border-red-500")
//             input.classList.add("border-green-500")
//             e.classList.add("hidden")
//             b.removeAttribute("disabled", "true")// prevent submit
//         } else {
//             input.classList.add("border-red-500")
//             e.classList.remove("hidden")
//             b.setAttribute("disabled", "true")// allow submit
//         }

//     }
// }
</script>
<template>
    <div class="my-auto md:w-1/2 mx-auto">
        <h1 class="text-2xl font-bold p-5">Reset password:</h1>
        <form @submit.prevent="resetpassword" class="p-5">
            <div class="password grid md:grid-cols-2">
                <div class="1 p-2">
                    <label for="password" :class="theme.global.current.value.dark ? 'text-white' : 'text-zinc-800'"
                        class="labelp text-left rounded-md text-lg font-semibold">Enter
                        New
                        password:</label>
                    <div :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'"
                        class="pass mt-2 outline outline-1 px-2 outline-zinc-700 rounded-lg my-auto w-11/12 mx-auto flex">
                        <input id="pass" name="password" v-model="password" placeholder="password"
                            class="text-black outline-none bg-transparent text-lg py-3 w-full   "
                            :class="theme.global.current.value.dark ? 'text-white' : 'text-black'"
                            :type="showPassword ? 'text' : 'password'" required>
                        <div class="my-auto m-2">
                            <v-icon class="my-auto" size="25" @click="toggleVisibility">
                                {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                        </div>
                    </div>
                </div>
                <div class="2 p-2">
                    <label for="password" :class="theme.global.current.value.dark ? 'text-white' : 'text-zinc-800'"
                        class="labelp text-left rounded-md text-lg font-semibold">Confirm
                        New
                        password:</label>
                    <div :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'"
                        class="pass mt-2 outline outline-1 px-2 outline-zinc-700 rounded-lg my-auto w-11/12 mx-auto flex">
                        <input id="pass2" name="password" v-model="passwordconfirm" placeholder="Confirm password"
                            class="text-black outline-none bg-transparent text-lg py-3 w-full   "
                            :class="theme.global.current.value.dark ? 'text-white' : 'text-black'"
                            :type="showPassword ? 'text' : 'password'" required>
                        <div class="my-auto m-2">
                            <v-icon class="my-auto" size="25" @click="toggleVisibility">
                                {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                        </div>
                    </div>
                </div>

            </div>
            <p v-if="errMsg" class=" text-md text-red-700">{{ errMsg }}</p>
            <v-btn type="submit" class="ma-5 flex w-1/3 justify-center" min-height="40"
                color="grey-darken-2">Reset</v-btn>
        </form>
    </div>
</template>