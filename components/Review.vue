<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
</script>
<template>
    <div class="p-4 mt-10 ">
        <h1 class="text-2xl mb-10">Write a Review</h1>
        <form class="space-y-2" @submit.prevent="submitReview">

            <div class="name flex space-x-5 p-2 md:w-1/2 mx-auto">
                <label for="name">Name:</label>
                <input type="text" id="name"
                    :class="theme.global.current.value.dark ? 'bg-zinc-700' : 'bg-zinc-200 text-black'"
                    class="w-full p-2 bg-zinc-700 rounded-sm" v-model="review.name" required>
            </div>

            <div class="review flex space-x-2 p-2 md:w-1/2 mx-auto">
                <label for="text">Review:</label>
                <textarea cols="10" rows="5" id="text"
                    :class="theme.global.current.value.dark ? 'bg-zinc-700' : 'bg-zinc-200'"
                    class="w-full p-2 bg-zinc-700 rounded-sm" v-model="review.text" required></textarea>
            </div>

            <div class="rating flex p-2 md:w-1/2 mx-auto">
                <label for="rating" class="my-auto">Rating:</label>
                <!-- <input type="number" id="rating"  min="1" max="5" required> -->
                <v-rating class="mx-auto flex justify-center p-2 rounded-sm bg-zinc-950 w-48" color="yellow"
                    density="compact" v-model="review.rating"></v-rating>
            </div>

            <button type="submit" :class="theme.global.current.value.dark ? 'bg-zinc-900' : 'bg-zinc-500'"
                class="w-48 flex justify-center mx-auto p-2 ring-zinc-400 focus:ring-4 mt-10 bg-zinc-900 text-white rounded-sm">Submit
                Review</button>
        </form>
    </div>
</template>
<script>
import Swal from 'sweetalert2'
export default {
    data() {
        return {
            review: {
                name: '',
                text: '',
                rating: null,
            }
        };
    },
    methods: {
        async submitReview() {
            const supabase = useSupabaseClient();
            const productId = parseInt(this.$route.params.id);
            try {
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
                        name: '',
                        text: '',
                        rating: null
                    };
                }
            } catch (error) {
                console.error('Error submitting review:', error.message);
                // Handle error
            }
        }
    }
};
</script>