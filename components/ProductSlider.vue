<template>
    <v-slide-group show-arrows1 center-active class="-pa-4" v-if="products">
        <v-slide-group-item v-for="(p, i) in products" :key="i">
            <v-card :to="`/products/${p.id}`" :color="theme.global.current.value.dark ? 'surface' : 'grey-lighten-2'"
                width="250" class="m-5">
                <v-img height="200" :src="JSON.parse(p.image)[0]" cover>
                    <template #placeholder>
                        <v-row class="fill-height" justify="center" align="center">
                            <v-progress-circular width="2" size="100" color="gray" indeterminate></v-progress-circular>
                        </v-row>
                    </template>
                </v-img>
                <v-card-title class="text-md-body-1 font-weight-bold">{{
                    p.name
                }}</v-card-title>
                <v-card-subtitle class="primary--text bg-[#D50000] text-white m-1 w-fit p-3 text-subtitle-1">

                    {{ settings?.currency + ' ' + (p.discount_price ? p.discount_price : p.price) }}
                </v-card-subtitle>
                <v-card-text>
                    <v-chip x-small label outlined class="mr-1" v-for="(t, i) in p.tags" :key="`prod${p.id}-${i}`">
                        {{ t }}
                    </v-chip>
                </v-card-text>
            </v-card>
        </v-slide-group-item>
    </v-slide-group>
    <v-slide-group v-else>
        <div class="loader p-10 mx-auto">
            <v-row class="fill-height" justify="center" align="center">
                <v-progress-circular width="2" size="50" color="primary" indeterminate></v-progress-circular>
            </v-row>
            <v-row>
                <p class="p-2">Products not Available</p>
            </v-row>
        </div>
    </v-slide-group>


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
            products: this.data,
            settings: null,
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
                const { data, error } = await supabase.from('Products').select();
                const { data: config, error: configerror } = await supabase
                    .from('store_config')
                    .select('*')

                this.settings = config[0]
                // console.log('Products:', data);
                this.products = data.slice().reverse()

            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        },

    },
}
</script>