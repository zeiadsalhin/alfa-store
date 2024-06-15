<script setup>
import Swal from 'sweetalert2'
import { useMainStore } from '@/store';
const selectedoption = ref('');
const handleOptionSelected = (option) => {
    selectedoption.value = option;
    console.log('Selected option:', option);
};

const mainStore = useMainStore();

const addToCart = (product) => {
    if (selectedoption.value) {
        mainStore.addToCart(product, selectedoption.value);
    } else {
        Swal.fire({
            title: 'Warning!',
            icon: 'warning',
            text: 'You must select an option',
            toast: true,
            timer: 2000,
            showConfirmButton: false,
        })
    }
    // console.log(selectedoption.value); // Log the value of selectedoption
};

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const admin = ref(false)

// Display delete button for admin only 
onMounted(async () => {
    try {
        const { data, error } = await supabase.auth.getSession(); // get session status from local cookies

        if (data.session.user.user_metadata.role == 'admin') {  // access only for admins
            admin.value = true
        } else {
            admin.value = false
        }
    } catch (error) {
        console.log(error);
    }

});
</script>
<template>
    <div>
        <div v-if="product">
            <v-container class="mt-20">
                <v-row justify="center">
                    <v-col cols="11" md="7">
                        <h2 class="text-center text-h4 font-weight-bold">
                            {{ product.name }}
                        </h2>
                        <div class="mt-2 md:flex justify-center text-center">
                            <v-rating readonly half-increments class="p-5" color="yellow darken-2"
                                background-color="grey lighten-1" :model-value="reviews" dense size="20"></v-rating>
                            <p class="my-auto md:mr-5">{{ reviews ? reviews : 0 }} out of 5</p>
                            <v-chip small label outlined class="mr-1 mt-5" v-for="(t, i) in product.tags"
                                :key="`prod${product.id}-${i}`">
                                {{ t }}
                            </v-chip>
                        </div>
                        <br />
                        <v-img width="100%" class="el rounded-lg" height="50vh" :src="product.image"></v-img>
                        <p class="mt-5 mb-5">
                            {{ product.description }}
                        </p>
                        <div v-if="product.discount_price" class="discounted price flex space-x-1 py-1 opacity-80 ">
                            <p class="mt-2 font-semibold">Original Price:</p>
                            <p
                                class="text-h7 inline-block mr-4 mt-2 text-red-70 line-through decoration-2 decoration-red-700">
                                {{ ((product.price)).toFixed() + ' $'
                                }}
                            </p>
                            <p class="mr-4 mt-2">-% {{ ((product.discount_price / product.price) * 100).toFixed() }}
                                off
                            </p>
                        </div>
                        <p class="text-h5 mb-7">
                            Price:
                            {{ (product.price - product.discount_price) + ' $' }}
                        </p>
                        <Colors :options="product.options" @option-selected="handleOptionSelected" />
                        <br />
                        <div class="button flex flex-col md:flex-row">
                            <div v-if="product.stock">
                                <v-btn @click="addToCart(product)" min-height="45" min-width="150" class="m-2" color="">
                                    <v-icon size="30" class="m-1 w-full">mdi-cart</v-icon>Add To Cart</v-btn>
                                <v-btn @click="addToCart(product), navigateTo('/checkout')" min-height="45"
                                    min-width="120" class="m-2" color="grey-lighten-1"><v-icon size="30"
                                        class="m-1">mdi-credit-card-fast-outline</v-icon>Buy
                                    Now</v-btn>
                            </div>
                            <div v-else>
                                <v-btn :readonly="true" min-height="45" min-width="150" class="m-2" color="">
                                    <v-icon size="30" class="m-1 w-full">mdi-cancel</v-icon>Out of stock</v-btn>
                            </div>
                            <v-btn v-if="admin" @click="DeleteProductBegin" min-height="45" min-width="150" class="m-2"
                                color="red-darken-4">Delete
                                product</v-btn>
                        </div>
                    </v-col>

                </v-row>
                <div class="added mt-5 px-5">
                    <p class="">Available from:</p>
                    <p class="text-left opacity-80">
                        {{ product.created_at.slice(0, 10) }}
                        {{ product.created_at.slice(11, 16) }}
                    </p>
                </div>
                <Review />
                <div class="h-1 w-full bg-zinc-800 rounded-full mt-5"></div>
                <AllReviews />
            </v-container>
            <br /><br />
            <Footer />
        </div>
        <div v-else class="loader mt-32 w-full h-full">
            <div class="p-5 flex-col justify-center mx-auto">
                <div class="flex justify-center p-5"><v-progress-circular color="dark-blue"
                        indeterminate></v-progress-circular>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            product: null,
            reviews: null,
        };
    },
    mounted() {
        this.fetchProducts();
        this.getreviews();
    },
    methods: {
        async getreviews() {
            const supabase = useSupabaseClient()
            const productId = parseInt(this.$route.params.id);
            try {
                const { data, error } = await supabase
                    .from('Reviews')
                    .select('rating')
                    .eq('post_id', `${productId}`)

                // get average reviews
                const sum = data.reduce((acc, review) => acc + review.rating, 0);
                const average = sum / data.length;
                this.reviews = average;
                // console.log('Average Rating:', average);
                if (error) {
                    console.log(error.message);
                }

            } catch (error) {
                console.error('Error fetching rating:', error.message);
            }
        },
        async fetchProducts() {
            const supabase = useSupabaseClient()
            const user = useSupabaseUser()
            const productId = parseInt(this.$route.params.id);
            try {

                const { data, error } = await supabase
                    .from('Products')
                    .select('*')
                    .eq('id', `${productId}`)

                this.product = data[0]
                // console.log(this.product.stock)

            } catch (error) {
                console.error('Error fetching products:', error.message);
            }

        },
        DeleteProductBegin() {
            Swal.fire({
                title: 'Warning!',
                icon: 'warning',
                text: 'This product will be deleted!',
                // toast: true,
                // timer: 2000,
                showConfirmButton: true,
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    // console.log("deleted");
                    this.DeleteProducts();
                } else {
                    // console.log('no');
                }
            });
        },
        // Delete product by admin
        async DeleteProducts() {
            const supabase = useSupabaseClient()
            try {
                const route = useRoute()
                const productId = parseInt(route.params.id);
                const { error } = await supabase
                    .from('Products')
                    .delete()
                    .eq('id', productId)

                console.log(productId)
                if (error) {
                    console.log(error)
                } else {

                    const { error } = await supabase
                        .storage
                        .from('products_images')
                        .remove([`${this.product.name}`]);
                    if (error) {
                        console.log(error)
                    } else {
                        // console.log('Deleted image');
                        Swal.fire({
                            title: 'Success',
                            icon: 'success',
                            text: 'Product deleted successfully!',
                            toast: true,
                            timer: 2000,
                            showConfirmButton: false,
                        }).then(() => { navigateTo('/') })
                    }
                }

            } catch (error) {
                console.log(error)
            }
        },
    },
};
</script>

<style></style>