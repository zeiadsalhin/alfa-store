<template>
    <v-carousel class="mt-20 mb-5" height="40vh" :hide-delimiters="true" :show-arrows="false" :cycle="true"
        :interval="4000">
        <v-carousel-item v-if="items" v-for="(item, i) in items" :key="i" :src="item.image" height="40vh">
        </v-carousel-item>
        <v-carousel-item v-else>
            <div class="h-full flex justify-center p-10">
                <div class="m-10 p-5 my-auto shadow-sm">
                    <div class="flex justify-center text-zinc-400 p-5"><v-progress-circular color="dark-blue"
                            indeterminate></v-progress-circular>
                    </div>
                </div>

            </div>
        </v-carousel-item>
    </v-carousel>
    <div class="bg-zinc-800 w-11/12 mx-auto h-0.5"></div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
    data() {
        return {
            items: '',
        }
    },
    mounted() {
        this.fetchAds();
    },
    methods: {

        async fetchAds() {
            const supabase = useSupabaseClient()
            const user = useSupabaseUser()
            try {
                const { data, error } = await supabase.from('Ads').select('*');

                // console.log('Ads:', data);
                this.items = data

            } catch (error) {
                console.error('Error fetching Advertisements:', error.message);
            }
        },

    },
}

</script>

<style></style>