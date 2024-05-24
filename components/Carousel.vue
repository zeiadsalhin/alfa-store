<template>
    <v-carousel height="80vh" hide-delimiter-background>
        <v-carousel-item v-if="items" v-for="(item, i) in items" :key="i" :src="item.image" cover>
            <v-img height="100vh">
                <v-container class="fill-height mt-32">
                    <v-row dense>
                        <v-col md="7">
                            <div class="pa-md-10 pa-3 rounded-lg black--text text-white text-center text-md-left"
                                style="background-color: rgba(0, 0, 0, 0.5)">
                                <h2 class="text-md-h4 text-h5">
                                    {{ item.name }}
                                </h2>
                                <p
                                    class="text-h7 inline-block mr-4 mt-2 text-red-70 line-through decoration-2 decoration-red-700">
                                    {{ (Math.random() * (item.price * 1.3 - item.price) + item.price).toFixed() + ' $'
                                    }}
                                </p>-30% off
                                <p class="text-h5 primary--text mt-3">
                                    {{ item.price + ' $' }}
                                </p>
                                <p class="text-md-body-2 md:mb-5 mb-2"></p>
                                <v-btn depressed :to="`/products/${item.id}`" color="primary" class="text-capitalize"
                                    min-height="40">Check It Out</v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-img>
        </v-carousel-item>
        <v-carousel-item v-else>
            <div class="h-full flex justify-center p-10">
                <div class="m-10 p-5 bg-zinc-900 my-auto shadow-sm">
                    <div class="flex justify-center text-white p-5"><v-progress-circular color="dark-blue"
                            indeterminate></v-progress-circular>
                    </div>
                </div>

            </div>
        </v-carousel-item>
    </v-carousel>
</template>

<script>
import Swal from 'sweetalert2'

export default {
    data() {
        return {
            sale_items: true,
            items: '',
        }
    },
    mounted() {
        this.fetchProducts();
    },
    methods: {

        async fetchProducts() {
            const supabase = useSupabaseClient()
            const user = useSupabaseUser()
            try {
                const { data, error } = await supabase.from('Products').select('*');

                // console.log('Products:', data);
                this.items = data

            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        },

    },
}

</script>

<style></style>