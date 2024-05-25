<script setup>

</script>
<template>
    <div>
        <div class="mt-10">
            <h2 class="text-2xl mb-5">All Reviews ({{ total }})</h2>
            <div class="text-lg space-y-1" v-for="(review, index) in reviews" :key="index">
                <div class="name flex-col p-2">
                    <h3 class="font-bold text-xl px-2 mb-4">{{ review.name }}</h3>
                    <div class="fle justify-start mt-2">
                        <v-rating class="m-auto" color="yellow-darken-3" density="compact" :model-value="review.rating"
                            readonly></v-rating>
                        <p class="px-2 text-sm opacity-70">at {{ review.created_at.slice(0, 10) }}
                            {{ review.created_at.slice(11, 16) }}</p>
                    </div>

                </div>

                <p class="px-4">User review:<br />{{ review.text }}</p>
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
            total: null,
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
                    this.total = data.length
                    // console.log(data.length)
                }
            } catch (error) {
                console.error('Error submitting review:', error.message);
                // Handle error
            }
        }
    },
    computed: {
        totalreviews() {
            // return this.data.length;
        }
    }
};
</script>