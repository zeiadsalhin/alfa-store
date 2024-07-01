<template>
    <div class="content">
        <div class="flex">
            <div class="bg-zinc-800 w-1.5 h-12 m-2 my-auto"></div>
            <p class="text-xl p-2">Get latest offers by subscribing to our newsletter</p>
        </div>
        <v-card rounded="md" class="m-10 pa-2 text-center w-11/12 md:w-1/3 mx-auto"
            :color="theme.global.current.value.dark ? 'grey-darken-4' : 'grey-lighten-4'" :dark='true'>
            <h2 class="text-3xl font-semibold p-2">Newsletter</h2>
            <p class="text-xl p-2">Subscribe</p>
            <form @submit.prevent="subscribe">
                <v-sheet color="transparent" class="mx-auto text-center p-2">
                    <v-text-field label="Email" type="email" variant="outlined" v-model="email" required></v-text-field>
                    <v-btn type="submit" outline min-height="50" block class="mx-auto text-left">Subscribe</v-btn>
                </v-sheet>
            </form>
        </v-card>

    </div>
</template>
<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
</script>
<script>
import Swal from 'sweetalert2'
export default {
    data() {
        return {
            email: null,
        }
    },
    methods: {
        async subscribe() {
            const supabase = useSupabaseClient();
            try {
                const { data, error } = await supabase.from('NewsletterSubs').insert({ email: this.email });

                if (error) {
                    console.error(error);
                    // Handle error
                    if (error.message.includes('duplicate key value')) {
                        Swal.fire({
                            title: 'Error Submitting',
                            icon: 'error',
                            text: 'Email already exists', // or any appropriate message
                            toast: true,
                            timer: 3000,
                            showConfirmButton: false,
                        });
                    } else {
                        Swal.fire({
                            title: 'Error Submitting',
                            icon: 'error',
                            text: error.message,
                            toast: true,
                            timer: 3000,
                            showConfirmButton: false,
                        });
                    }
                }
                this.email = '';
                Swal.fire({
                    title: 'Subscribed Successfuly',
                    icon: 'success',
                    text: 'Your email has been added to newsletter list', // or any appropriate message
                    toast: true,
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                // console.error('Error submitting review:', error.message);
            }
        }
    },
}
</script>