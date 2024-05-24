<template>
    <div class="mt-20">
        <h1 class="text-3xl p-5 ">Products</h1>
        <!--Search-->
        <v-text-field prepend-inner-icon="mdi-magnify" outlined v-model="search" clearable
            placeholder="Search product name, price ..." class="w-10/12 mx-auto"></v-text-field>

        <v-container v-if="search" class="w-1/2">
            <div v-if="filteredProducts.length != 0" class="w-11/12 justify-center flex flex-wrap gap-4">
                <div v-for="(p, i) in filteredProducts" :key="`product${p.id}-${i}`" class="w-fit">
                    <v-fade-transition>
                        <v-card :to="'/products/' + p.id" color="surface" class="mb-5 mx-auto ml-6">
                            <v-img :src="p.image" width="300" height="200" cover>
                                <template #placeholder>
                                    <v-row class="fill-height" justify="center" align="center">
                                        <v-progress-circular width="2" size="100" color="gray"
                                            indeterminate></v-progress-circular>
                                    </v-row>
                                </template>
                            </v-img>
                            <v-card-title class="text-md-body-1 font-weight-bold">{{
                                p.name
                                }}</v-card-title>
                            <v-card-subtitle class="primary--text pb-3">
                                ${{ p.price }}
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
        <v-container v-if="products" class="w-1/2">
            <div v-if="products" class="w-11/12 justify-center flex flex-wrap gap-4">
                <div v-for="(p, i) in products" :key="`product${p.id}-${i}`" class="w-fit">
                    <v-fade-transition>
                        <v-card :to="'/products/' + p.id" color="surface" class="mb-5 mx-auto ml-6">
                            <v-img :src="p.image" width="300" height="200" cover>
                                <template #placeholder>
                                    <v-row class="fill-height" justify="center" align="center">
                                        <v-progress-circular width="2" size="100" color="gray"
                                            indeterminate></v-progress-circular>
                                    </v-row>
                                </template>
                            </v-img>
                            <v-card-title class="text-md-body-1 font-weight-bold">{{
                                p.name
                            }}</v-card-title>
                            <v-card-subtitle class="primary--text pb-3">
                                ${{ p.price }}
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
        <div v-else class="loader w-full h-full">
            <div class="p-5 flex-col justify-center mx-auto">
                <div class="flex justify-center p-5"><v-progress-circular color="dark-blue"
                        indeterminate></v-progress-circular>
                </div>
                <p class="p-2 text-center">Products not Available at the moment</p>
            </div>
        </div>
        <br /><br />
        <Footer />
    </div>
</template>
<script>


export default {
    data() {
        return {
            categories: null,
            products: null,
            search: null,
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

                // console.log('Products:', data);
                this.products = data

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