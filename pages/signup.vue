<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
import Swal from 'sweetalert2'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const isFocused1 = ref(false)
const isFocused2 = ref(false)
const isFocused3 = ref(false)
const isFocused4 = ref(false)
const errMsg = ref()
const displayname = ref('')
const email = ref('')
const password = ref('')
const capital = ref(false)
const special = ref(false)
const number = ref(false)
const minlength = ref(false)
const passwordStrength = computed(() => Math.min(password.value.length * 15, 100));
const showPassword = ref(false)
const phone = ref('')
const dataview = ref()
const authenticating = ref(false)
// show password
function toggleVisibility() {
    showPassword.value = !showPassword.value;
}
// validate password
function validatePassword() {
    var hasCapitalLetter = /[A-Z]/.test(password.value);
    var hasNumber = /\d/.test(password.value);
    var hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password.value);
    var hasMinLength = password.value.length >= 6;

    if (hasCapitalLetter) {
        // console.log('capital letter');
        capital.value = true
        // passwordStrengthColor
    } else {
        capital.value = false
    } if (hasNumber) {
        // console.log('has number');
        number.value = true
    } else {
        number.value = false
    } if (hasSpecialCharacter) {
        // console.log('has special');
        special.value = true
    } else {
        special.value = false
    } if (hasMinLength) {
        // console.log('min length reached');
        minlength.value = true
    } else {
        minlength.value = false
    }
}
const passwordStrengthColor = computed(() => {
    if (capital.value && special.value && number.value && minlength.value) {
        return 'green';
    } else if (capital.value || special.value || number.value) {
        return 'orange';
    } else {
        return 'red';
    }
});
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
            router.push({ path: '/login', query: { confirmemail: email.value, token: data.user.id } }) // Navigate to login and pass email and token
            // console.log(data);
        })

        // register user in newsletter
        const { data2, error2 } = await supabase.from('NewsletterSubs').insert({ email: email.value });
        if (error2) {
            Swal.fire({
                title: 'Error Submitting',
                icon: 'error',
                text: error2.message,
                toast: true,
                timer: 3000,
                showConfirmButton: false,
            })
            throw error2
        }; // throw console error
    } catch (error) {
        errMsg.value = error
        console.log(error)
        authenticating.value = false
    }
}

watch(user, () => {
    if (user.value) {
        // Redirect to protected page
        navigateTo('/')
    } else {
        dataview.value = true
    }
}, { immediate: true })
</script>
<template>
    <div class="back">
        <!--Form Body-->
        <!--will only render when no user exist-->
        <div v-if="dataview"
            :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-black'"
            class="p-1 md:p-10 mt-20 flex-col justify-center mx-auto h-fit w-10/12 rounded-md shadow-inner">
            <v-img src="/icon.ico" :class="theme.global.current.value.dark ? 'bg-inherit ' : 'bg-zinc-700'"
                class="p-5 mx-auto mb-5" width="350" alt="logo"></v-img>

            <h1 class="text-3xl md:text-5xl text-center font-bold p-2">Sign Up</h1>
            <div class="w-1/4 h-1 mt-5 rounded-xl mx-auto bg-gray-600 dark:bg-gray-9010"></div>

            <form id="form" class="p-5 text-center mx-auto justify-center flex-col w-full md:w-2/3"
                @submit.prevent="signUpNewUser">
                <div class="userdata fleax flex-arow w-full md:grid grid-cols-2  gap-1">
                    <!--Display error message if any-->
                    <p class="text-red-500" v-if="errMsg">{{ errMsg }}</p>
                    <div class="form mt-3 flex justify-center">
                        <label class=" text-lg md:text-xl text-right p-3">Name</label>
                        <input id="name" type="name" v-model="displayname" spellcheck="false"
                            :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-white text-black', isFocused1 ? 'ring-2' : 'ring-1'"
                            class=" ring-zinc-500 h-fit my-auto p-2 md:p-3 rounded-md focus:outline-none border-2  w-full"
                            @focus="isFocused1 = true" @blur="isFocused1 = false" required />
                    </div>
                    <!--Error Message-->
                    <p id="errorn" class="hidden text-sm text-red-700">Please Check your Name</p>

                    <div class="form mt-3 flex justify-center">
                        <label class="  text-lg md:text-xl  p-3">Email</label>
                        <input id="email" v-model="email" spellcheck="false"
                            :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black', isFocused2 ? 'ring-2' : 'ring-1'"
                            class=" ring-zinc-500  h-fit my-auto p-2 md:p-3 rounded-md focus:outline-none border-2  w-full"
                            type="email" @focus="isFocused2 = true" @blur="isFocused2 = false" required />

                    </div>
                    <!--Error Message email-->
                    <p id="errore" class="hidden text-sm text-red-700">Please Check your Email</p>
                </div>
                <div class="form mt-3 flex justify-cente">
                    <label class="  text-lg md:text-xl p-3">Phone</label>
                    <input id="phone" v-model="phone" spellcheck="false"
                        :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black', isFocused3 ? 'ring-2' : 'ring-1'"
                        class=" ring-zinc-500  h-fit my-auto p-2 md:p-3 rounded-md focus:outline-none border-2  w-full"
                        type="number" min="7" @focus="isFocused3 = true" @blur="isFocused3 = false" required />
                </div>

                <div class="form mt-3 mb-5 flex justify-center">
                    <label class=" text-lg md:text-xl text-center p-2">Password</label>
                    <div class="flex ring-zinc-500  w-full  rounded-md "
                        :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black', isFocused4 ? 'ring-2' : 'ring-1'">
                        <input id="password" v-model="password"
                            class="focus:outline-none rounded-md h-fit my-auto p-2 md:p-3 w-full"
                            :type="showPassword ? 'text' : 'password'" @input="validatePassword()" minlength="6"
                            @focus="isFocused4 = true" @blur="isFocused4 = false" required />
                        <v-icon class="my-auto m-2 " size="25" @click="toggleVisibility">
                            {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                    </div>
                </div>

                <!--Error Message password-->
                <p id="errorp" class="hidden text-sm text-red-700">Please Check your Password</p>
                <span class="tick-list block text-sm p-2 -mt-2 mb-5 space-y-1">
                    <div class="passwordchecker w-10/12 mx-auto">
                        <v-progress-linear v-if="password" :model-value="passwordStrength"
                            :color="passwordStrengthColor" height="5"></v-progress-linear>
                    </div>

                    <ul>Ex: Min 6 Characters and Must Include</ul>
                    <li :class="capital ? 'text-green-500' : 'text-red-600'"><v-icon size="20">{{ capital ?
                        'mdi-check' : 'mdi-close' }}</v-icon>Capital letter
                    </li>
                    <li :class="special ? 'text-green-500' : 'text-red-600'"><v-icon size="20">{{ special ?
                        'mdi-check' : 'mdi-close' }}</v-icon>Special Character
                    </li>
                    <li :class="number ? 'text-green-500' : 'text-red-600'"><v-icon size="20">{{ number ? 'mdi-check'
                        : 'mdi-close' }}</v-icon>At least one number
                    </li>
                    <li :class="minlength ? 'text-green-500' : 'text-red-600'"><v-icon size="20">{{ minlength
                        ? 'mdi-check' : 'mdi-close' }}</v-icon>Min length 6
                    </li>
                </span>
                <!--Submit button-->
                <button id="submitbtn" @click="" type="submit"
                    :class="theme.global.current.value.dark ? 'bg-zinc-900 text-white hover:bg-zinc-700' : 'bg-zinc-500 hover:bg-zinc-700 text-white hover:text-gray-50'"
                    class="px-5 py-2 w-32 rounded-md hover:cursor-pointer">
                    <v-progress-circular v-if="authenticating" width="2" size="20" color="darken-blue-4" class="m-1"
                        indeterminate></v-progress-circular>Sign Up
                </button>
                <!--separator-->
                <div class="flex w-fit space-x-5 mx-auto mt-10">
                    <div class=" w-1 h-8 my-auto rounded-xl mx-auto bg-gray-800">
                    </div>
                    <!--navigate to login page-->
                    <p class="mr-10 my-auto text-center">Already have an account?</p>
                    <NuxtLink to="/login" onclick=""
                        :class="theme.global.current.value.dark ? 'bg-zinc-600 text-white hover:bg-gray-600' : 'bg-zinc-900 hover:bg-zinc-800 text-white hover:text-gray-50'"
                        class="text-center mx-auto flex w-fit h-fit justify-center m-3 px-6 py-2 rounded-md hover:cursor-pointer">
                        login</NuxtLink>
                </div>
                <NuxtLink to="/" onclick="" :class="theme.global.current.value.dark ? 'text-zinc-400' : 'text-zinc-700'"
                    class="text-center mx-auto flex w-fit h-fit justify-center m-3 px-6 py-2 rounded-md hover:underline hover:cursor-pointer">
                    Help</NuxtLink>

            </form>
            <!--End of body-->
        </div>
    </div>
</template>
<style>
.tick-list {
    list-style-type: none;
}

.back {
    background-attachment: fixed;
    background-position-x: center;
    background-image: url('/stripes.svg');
    background-repeat: no-repeat;
    background-size: cover
}
</style>