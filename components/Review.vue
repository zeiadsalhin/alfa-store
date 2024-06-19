<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
// Add review for registered users only
</script>
<template>
    <div v-if="loggedIn" class="p-4 mt-10 ">
        <h1 class="text-2xl mb-10">Write a Review</h1>
        <form class="space-y-2" @submit.prevent="submitReview">

            <div class="name flex space-x-5 p-2 md:w-1/2 mx-auto">
                <label for="name">Name<span class="required text-red-600">*</span>:</label>
                <input type="text" id="name"
                    :class="theme.global.current.value.dark ? 'bg-zinc-950' : 'bg-zinc-200 text-black'"
                    class="w-full p-2 bg-zinc-7a00 rounded-sm outline-none" v-model="review.name" readonly required>
            </div>

            <div class="review flex space-x-2 p-2 md:w-1/2 mx-auto">
                <label for="text">Review<span class="required text-red-600">*</span>:</label>
                <textarea cols="10" rows="5" id="text"
                    :class="theme.global.current.value.dark ? 'bg-zinc-700' : 'bg-zinc-200'"
                    class="w-full p-2 bg-zinc-7a00 rounded-sm" v-model="review.text" required></textarea>
            </div>

            <div class="rating flex p-2 md:w-1/2 mx-auto">
                <label for="rating" class="my-auto">Rating<span class="required text-red-600">*</span>:</label>
                <!-- <input type="number" id="rating"  min="1" max="5" required> -->
                <v-rating class="mx-auto flex justify-center p-2 rounded-sm bg-zinc-950 w-48" color="yellow"
                    density="compact" v-model="review.rating"></v-rating>
            </div>

            <button type="submit" :class="theme.global.current.value.dark ? 'bg-zinc-900' : 'bg-zinc-500'"
                class="w-48 flex justify-center mx-auto p-2 ring-zinc-400 focus:ring-4 mt-10 bg-zinc-900 text-white rounded-sm">
                <v-progress-circular v-if="Submitting" width="2" size="20" color="darken-blue-4" class="m-1"
                    indeterminate></v-progress-circular> Submit
                Review</button>
        </form>
    </div>
    <div v-else class="p-4 mt-10 flex-col justify-center mx-auto text-center space-y-5">
        <h1 class="my-auto text-xl font-semibold">Please Login to Add Review</h1>
        <v-btn @click="navigateTo('/login')" min-height="40" min-width="150" class="m-2"
            color="grey-darken-4">Login</v-btn>
    </div>
</template>
<script>
import Swal from 'sweetalert2'
export default {
    data() {
        return {
            loggedIn: false,
            Submitting: false,
            review: {
                name: null,
                text: '',
                rating: null,
            }
        };
    },
    mounted() {
        this.get_username()
    },
    methods: {
        async get_username() {
            const supabase = useSupabaseClient()
            const user = useSupabaseUser()
            try {
                const { data, error } = await supabase.auth.getSession(); // get session status from local cookies
                if (data.session) {
                    this.loggedIn = true
                    this.username = data.session.user.identities[0].identity_data.first_name || data.session.user.identities[0].identity_data.full_name
                    this.review.name = this.username
                } else {
                    // admin.value = false
                }
            } catch (error) {
                console.log(error);
            }
        },
        async submitReview() {
            const supabase = useSupabaseClient();
            const productId = parseInt(this.$route.params.id);
            this.Submitting = true
            try {
                if (this.review.rating != null) {
                    const { data, error } = await supabase.from('Reviews').insert({ post_id: productId, name: this.review.name, text: this.review.text, rating: this.review.rating });

                    if (error) {
                        console.error(error);
                        // Handle error
                    } else {
                        Swal.fire({
                            title: 'Success',
                            icon: 'success',
                            text: 'Review added successfully!',
                            toast: true,
                            timer: 2000,
                            showConfirmButton: false,
                        })

                        this.review = {
                            name: this.username,
                            text: '',
                            rating: null
                        };
                        this.Submitting = false
                    }
                } else {
                    Swal.fire({
                        title: 'Warning',
                        icon: 'warning',
                        text: 'Your rating is required',
                        toast: true,
                        timer: 2000,
                        showConfirmButton: false,
                    })
                    this.Submitting = true
                }
            } catch (error) {
                console.error('Error submitting review:', error.message);
                // Handle error
            }
        }
    }
};
</script>