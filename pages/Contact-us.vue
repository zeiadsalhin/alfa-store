<script setup lang="ts">
import emailjs from '@emailjs/browser';
const phoneNumber = ref('NO DATA')
const email = ref('NO DATA')
const address = ref('NO DATA')
onMounted(() => {
    getcontacts()
})
const getcontacts = async () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    try {
        const { data, error } = await supabase.from('Contact-Details').select()
        phoneNumber.value = data[0].phone
        email.value = data[0].email
        address.value = data[0].address
        if (error) {
            console.log(error);
            throw error
        }

    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
}

// send email 
const snackbarshow = ref(false)
const loader = ref(false)

const sendEmail = (() => {
    snackbarshow.value = false,
        loader.value = true
    emailjs.sendForm('service_q9o17rp', 'template_0nfu6xe', document.querySelector('#form'), 'FdH-TOKxO9kI59c3N')
        .then((result) => {
            console.log('SUCCESS!', result.text);
            snackbarshow.value = true
            loader.value = false
            document.querySelector('#form').reset()
        }, (error) => {
            console.log('FAILED...', error);
        });
})
// const from_name = ref('Ali');
// const reply_to = ref('test@test.com');
// const subject = ref('Support');
// const message = ref();
// const mail = useMail()
// const sendEmail = (() => {
//     mail.send({
//         from: reply_to.value,
//         to: reply_to.value,
//         subject: subject.value,
//         text: message.value,
//     })
// })

//seo
// useSeoMeta({
//     title: 'Alfa Store - Contact Us',
//     ogTitle: 'Alfa Store -  Contact Us',
//     description: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
//     ogDescription: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
//     ogImage: 'https://alfastorecommerce.netlify.app/mainicon.ico',
//     twitterCard: 'summary_large_image',
// });
</script>
<template>
    <div class="my-aut py-2">
        <v-card class="mx-auto text-center md:w-1/2">
            <h1 class="text-3xl mt-10 font-bold">Contact Us</h1>
            <div class="h-0.5 w-2/3 mx-auto bg-zinc-800 rounded-full mt-5 mb-5"></div>
            <v-card-text>
                <div class="contact-info text-lg space-y-3 mb-10">
                    <p><v-icon class="mb-1 mx-1" size="20">mdi-phone</v-icon> Phone: <a class="hover:opacity-80"
                            :href="'tel:' + phoneNumber">{{
                                phoneNumber }}</a></p>
                    <p><v-icon class="mb-1 mx-1" size="20">mdi-email</v-icon> Email: <a class="hover:opacity-80"
                            :href="'mailto:' + email">{{
                                email }}</a></p>
                    <p><v-icon class="mb-1 mx-1" size="20">mdi-map</v-icon> Address: <br>{{ address }}</p>
                </div>
            </v-card-text>
        </v-card>
        <v-card variant="flat"
            class="contact mt-10a py-10 mb-10 md:w-11/12 mx-auto flex-col justify-center text-center bg-gray-800 dark:bg-gray-950 text-white">
            <h1 class="text-3xl dark:text-white text-center font-bold p-5">Need help?</h1>
            <p class="p-2">Please fill the form below to reach us:</p>
            <form id="form" class="space-y-2  mx-auto  w-9/12" @submit.prevent="sendEmail">
                <div class="md:aflex flex-row justify-center mb-5 md:w-1/3 mx-auto">
                    <input id="name" required
                        class="bg-gray-100 dark:bg-gray-300 placeholder-current text-black p-2 rounded-md focus:outline-none w-full mb-2"
                        placeholder="Name*" type="text" name="from_name">
                    <input id="email" required
                        class="bg-gray-100 dark:bg-gray-300 placeholder-current text-black p-2 rounded-md focus:outline-none w-full m-a1"
                        placeholder="Email*" type="email" name="reply_to">
                </div>
                <label class="text-xl">Message*</label><br>
                <textarea id="message" required
                    class="bg-gray-200 dark:bg-gray-300 placeholder-current text-black p-2 resize-none rounded-md focus:outline-none w-full md:w-1/3"
                    rows="5" placeholder="Your message" name="message"></textarea><br>
                <v-btn variant="tonal"
                    class="md:w-1/3 w-full px-a5 py-2a rounded-md hover:cursor-apointer hover:bga-gray-600 bg-agray-500"
                    type="submit"><v-progress-circular v-if="loader" width="2" size="18" color="zinc"
                        class="text-zinc-300 mr-1" indeterminate></v-progress-circular> Send</v-btn>

            </form>
        </v-card>
        <NotificationBar :snackbar="snackbarshow" icon="mdi-check-bold" message="Message Sent successfully!"
            :timeout="3000" />

    </div>
</template>
