<template>
    <div>
        <div class="w-full h-[20vh]" style="background-image: url('/pattern.svg');background-size: cover;"></div>
        <div class="mt-2">
            <h1 class="text-3xl font-semibold p-5 ">Products</h1>
            <!--Search-->
            <v-text-field prepend-inner-icon="mdi-magnify" outlined v-model="search" clearable
                placeholder="Search product name, price ..." class="w-10/12 mx-auto"></v-text-field>

            <v-container v-if="search" class="w-1/2">
                <div v-if="filteredProducts.length != 0" class="w-11/12 justify-center flex flex-wrap gap-4">
                    <div v-for="(p, i) in filteredProducts" :key="`product${p.id}-${i}`" class="w-fit">
                        <v-fade-transition>
                            <v-card :to="'/products/' + p.id"
                                :color="theme.global.current.value.dark ? 'surface' : 'grey-lighten-3'"
                                class="mb-5 mx-auto ml-6">
                                <v-img :src="JSON.parse(p.image)[0]" width="300" height="200" cover>
                                    <template #placeholder>
                                        <v-row class="fill-height" justify="center" align="center">
                                            <v-progress-circular width="2" size="100" color="gray"
                                                indeterminate></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>
                                <v-card-title class="text-md-body-1 font-weight-bold">{{
                                    p.name.length > 25 ? (p.name).slice(0, 25) + '...' : p.name
                                }}</v-card-title>
                                <div v-if="p.discount_price" class="discount price flex mb-5">
                                    <v-card-subtitle class="primary--text w-fit text-h6">
                                        {{ settings?.currency + ' ' + p.discount_price }}
                                    </v-card-subtitle>
                                    <v-card-subtitle
                                        class="primary--text line-through decoration-red-600 decoration-2 w-fit mt-1">
                                        {{ settings?.currency + ' ' + p.price }}
                                    </v-card-subtitle>
                                </div>
                                <v-card-subtitle v-else class="primary--text pb-4 text-h6">
                                    {{ settings?.currency + ' ' + p.price }}
                                </v-card-subtitle>
                                <v-card-text>
                                    <v-chip x-small label outlined class="mr-1" v-for="(t, i) in p.tags"
                                        :key="`prod${p.id}-${i}`">
                                        {{ t }}
                                    </v-chip>
                                </v-card-text>
                            </v-card>
                        </v-fade-transition>
                    </div>
                </div>
                <div v-else>
                    <h1 class="text-xl font-semibold text-center p-3">No Results</h1>
                </div>
                <div class="h-1 w-full rounded-full bg-zinc-700 mb-10"></div>
                <h1 class="text-2xl font-semibold text-center">All Products</h1>
            </v-container>
            <!---->
            <div v-if="products">
                <v-container class="w-1/2">
                    <div v-if="products" class="w-11/12 justify-center flex flex-wrap gap-4">
                        <div v-for="(p, i) in products" :key="`product${p.id}-${i}`" class="w-fit">
                            <v-fade-transition>
                                <v-card :to="'/products/' + p.id"
                                    :color="theme.global.current.value.dark ? 'surface' : 'grey-lighten-3'"
                                    class="mb-5 mx-auto ml-6">
                                    <v-img :src="JSON.parse(p.image)[0]" width="300" height="200" cover>
                                        <template #placeholder>
                                            <v-row class="fill-height" justify="center" align="center">
                                                <v-progress-circular width="2" size="100" color="gray"
                                                    indeterminate></v-progress-circular>
                                            </v-row>
                                        </template>
                                    </v-img>
                                    <v-card-title class="text-md-body-1 font-weight-bold">{{
                                        p.name.length > 25 ? (p.name).slice(0, 25) + '...' : p.name
                                        }}</v-card-title>
                                    <div v-if="p.discount_price" class="discount price flex mb-5">
                                        <v-card-subtitle class="primary--text w-fit text-h6  mt-0.5">
                                            {{ settings?.currency + ' ' + p.discount_price }}
                                        </v-card-subtitle>
                                        <v-card-subtitle
                                            class="pa-1 bg-[#D50000] text-white rounded-sm font-w-bold my-auto w-fit">-%
                                            {{ (((p.price - p.discount_price) / p.price) * 100).toFixed() }}
                                        </v-card-subtitle>
                                        <!-- <v-card-subtitle
                                            class="primary--text line-through decoration-[#D50000] decoration-2 text- w-fit mt-1">
                                            {{ settings?.currency + ' ' + p.price }}
                                        </v-card-subtitle> -->
                                    </div>
                                    <v-card-subtitle v-else class="primary--text pb-4 text-h6">
                                        {{ settings?.currency + ' ' + p.price }}
                                    </v-card-subtitle>
                                    <v-card-text>
                                        <v-chip x-small label outlined class="mr-1" v-for="(t, i) in p.tags"
                                            :key="`prod${p.id}-${i}`">
                                            {{ t }}
                                        </v-chip>
                                    </v-card-text>
                                </v-card>
                            </v-fade-transition>
                        </div>
                    </div>
                    <!-- </div> -->
                </v-container>
                <br /><br />
                <Footer />
            </div>
            <div v-else class="loader w-full h-full">
                <div class="p-5 flex-col justify-center mx-auto">
                    <div class="flex justify-center p-5"><v-progress-circular color="dark-blue"
                            indeterminate></v-progress-circular>
                    </div>
                    <p class="p-2 text-center">Products not Available at the moment</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
useSeoMeta({
    title: 'Alfa Store - All Products',
    ogTitle: 'Alfa Store -  All products',
    description: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogDescription: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogImage: 'https://alfastorecommerce.netlify.app/mainicon.ico',
    twitterCard: 'summary_large_image',
})
</script>
<script>


export default {
    data() {
        return {
            categories: null,
            products: null,
            search: null,
            settings: null,
        };
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
                // console.log('Products:', JSON.parse(data[2].image)[0]);
                this.products = data
                // console.log(JSON.parse(this.products[2].image.replace(/[\[\]']/g, '')));
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        },

    },
    computed: {
        filteredProducts() {
            if (!this.products || !this.search) return this.products;
            return this.products.filter((p) => {
                const s = this.search.toLowerCase();
                const n = p.name.toLowerCase();
                const price = p.price.toString();
                const sprice = p.salePrice?.toString() || "";
                return (
                    n.includes(s) ||
                    price.includes(s) ||
                    sprice.includes(s)
                );
            });
        },
    },
}
</script>