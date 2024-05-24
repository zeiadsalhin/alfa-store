<script setup>

</script>
<template>
    <div>
        <div class="mt-10">
            <h2 class="text-2xl mb-5">All Reviews</h2>
            <div class="text-lg space-y-1" v-for="(review, index) in reviews" :key="index">
                <div class="name flex-col p-2">
                    <v-rating class="mx-auto" color="yellow-darken-3" density="compact" :model-value="review.rating"
                        readonly></v-rating>
                    <h3 class="font-bold text-xl">{{ review.name }}</h3>
                </div>

                <p class="p-2">User review:<br />{{ review.text }}</p>
                <!-- <p>Rating: {{ review.rating }}</p> -->
                <div class="h-0.5 w-full bg-zinc-900 rounded-full mt-5 mb-5"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            reviews: null,
        };
    },
    mounted() {
        this.getReviews();
    },
    methods: {
        async getReviews() {
            const supabase = useSupabaseClient();
            const productId = parseInt(this.$route.params.id);
            try {
                const { data, error } = await supabase.from('Reviews').select().eq('post_id', productId);

                if (error) {
                    console.error(error);
                    // Handle error
                } else {
                    this.reviews = data
                    // console.log(data)
                }
            } catch (error) {
                console.error('Error submitting review:', error.message);
                // Handle error
            }
        }
    }
};
</script>