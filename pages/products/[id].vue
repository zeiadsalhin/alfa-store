<script setup>
import Swal from 'sweetalert2'
import { useMainStore } from '@/store';
const selectedoption = ref('');
const props = defineProps({
    product: Object,
    reviews: Array
});
const product = ref(props.product);
const reviews = ref(props.reviews);
const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const admin = ref(false)

// START
onMounted(() => {
    ddb();
    fetchProducts();
    getreviews();
})

//seo 
useSeoMeta({
    title: computed(() => `Alfa Store - ${product.value ? product.value.name : 'Loading Product..'}`),
    ogTitle: computed(() => `Alfa Store - ${product.value ? product.value.name : 'Loading Product..'}`),
    description: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogDescription: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogImage: 'https://alfastorecommerce.netlify.app/mainicon.ico',
    twitterCard: 'summary_large_image',
})

const handleOptionSelected = (option) => {
    selectedoption.value = option;
    console.log('Selected option:', option);
};
// add to cart
const mainStore = useMainStore();

const addToCart = (product) => {
    if (product.options) {
        if (selectedoption.value) {
            mainStore.addToCart(product, selectedoption.value, product.discount_price);
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
    } else {
        mainStore.addToCart(product, selectedoption.value, product.discount_price);
        console.log('no options', selectedoption.value);
    }

};
// Buy now
const ExpressCheckout = (product) => {
    if (product.options) {
        if (selectedoption.value) {
            mainStore.addToCart(product, selectedoption.value, product.discount_price).then(() => { navigateTo('/checkout') });
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
    } else {
        mainStore.addToCart(product, selectedoption.value, product.discount_price).then(() => { navigateTo('/checkout') });
        console.log('no options', selectedoption.value);
    }

};

// Display delete button for admin only 
const ddb = async () => {
    try {
        const { data, error } = await supabase.auth.getSession(); // get session status from local cookies

        if (data.session.user.user_metadata.role == 'admin') {  // access only for admins
            admin.value = true
        } else {
            admin.value = false
        }
    } catch (error) {
        // console.log(error);
    }

}

// get reviews
const getreviews = async () => {
    const supabase = useSupabaseClient()
    const productId = parseInt(route.params.id);
    try {
        const { data, error } = await supabase
            .from('Reviews')
            .select('rating')
            .eq('post_id', `${productId}`)

        // get average reviews
        const sum = data.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / data.length;
        reviews.value = average;
        // console.log('Average Rating:', reviews.value);
        if (error) {
            console.log(error.message);
        }

    } catch (error) {
        console.error('Error fetching rating:', error.message);
    }
}

// get product data
const settings = ref()
const fetchProducts = async () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const productId = parseInt(route.params.id);
    try {

        const { data, error } = await supabase
            .from('Products')
            .select('*')
            .eq('id', `${productId}`)

        product.value = data[0]
        // console.log(product.value.name)
        // console.log('images are: ', JSON.parse(this.product.image));

        const { data: config, error: configerror } = await supabase
            .from('store_config')
            .select('*')

        settings.value = config[0]
        // console.log(settings.value.currency);
    } catch (error) {
        console.error('Error fetching products:', error.message);
    }

};

// delete product confirm
const DeleteProductBegin = () => {
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
            DeleteProducts();
        } else {
            // console.log('no');
        }
    });
}

// Delete product by admin
const DeleteProducts = async () => {
    const supabase = useSupabaseClient()
    try {
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
                .remove([`${product.value.name}`]);
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
};

</script>
<template>
    <div>
        <div v-if="product">
            <v-container class="mt-20">
                <Breadcrumbs />
                <v-row justify="center">
                    <v-col cols="11" md="11">
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
                        <div class="md:w-9/12 mx-auto">
                            <v-carousel height="50vh" cycle :hide-delimiters="false" delimiter-icon="mdi-square"
                                hide-delimiter-background show-arrows="hover">
                                <template v-slot:prev="{ props }">
                                    <v-btn color="grey-darken-4" variant="elevated"
                                        @click="props.onClick"><v-icon>mdi-chevron-left</v-icon></v-btn>
                                </template>
                                <template v-slot:next="{ props }">
                                    <v-btn color="grey-darken-4" variant="elevated"
                                        @click="props.onClick"><v-icon>mdi-chevron-right</v-icon></v-btn>
                                </template>
                                <v-carousel-item v-for="(img, i) in JSON.parse(product.image)" :key="i" :src="img"
                                    cover></v-carousel-item>
                            </v-carousel>
                        </div>
                        <p class="mt-20 mb-5">
                            {{ product.description }}
                        </p>
                        <div v-if="product.discount_price">
                            <div class="discounted price flex space-x-1 py-1 opacity-80 ">
                                <p class="mt-2 font-semibold">Original Price:</p>
                                <p
                                    class="text-h7 inline-block mr-4 mt-2 text-red-70 line-through decoration-2 decoration-red-700">
                                    {{ settings?.currency + ' ' + ((product.price)).toFixed()
                                    }}
                                </p>
                                <p class="mr-4 mt-1 p-1.5 bg-[#D50000] text-white rounded-sm font-bold">-% {{
                                    (((product.price -
                                        product.discount_price) /
                                        product.price) *
                                        100).toFixed() }}
                                    off
                                </p>
                            </div>
                            <p class="text-h5 mb-7">
                                Price:
                                {{ settings?.currency + ' ' + (product.discount_price) }}
                            </p>
                        </div>
                        <div v-else>
                            <p class="text-h5 mb-4">
                                Price:
                                {{ settings?.currency + ' ' + (product.price) }}
                            </p>
                        </div>
                        <Colors v-if="product.options" :options="product.options"
                            @option-selected="handleOptionSelected" />
                        <br />
                        <div class="button flex flex-col md:flex-row mb-5">
                            <div v-if="product.stock" class="md:flex">
                                <v-btn @click="addToCart(product)" min-height="45" min-width="150"
                                    class="md:m-2 my-2 w-full md:w-1/3" color="">
                                    <v-icon size="30" class="mx-2">mdi-cart</v-icon>Add To Cart</v-btn>
                                <v-btn @click="ExpressCheckout(product)" min-height="45" min-width="120"
                                    class="md:m-2 my-2 w-full md:w-1/3" color="grey-lighten-1"><v-icon size="30"
                                        class="mx-2">mdi-credit-card-fast-outline</v-icon>Buy
                                    Now</v-btn>
                                <v-btn v-if="admin" @click="DeleteProductBegin" min-height="45" min-width="120"
                                    class="md:m-2 my-2 w-full md:w-1/3" color="red-darken-4">Delete
                                    product</v-btn>
                            </div>
                            <div v-else>
                                <v-btn :readonly="true" min-height="45" class="m-1 mb-10  w-full">
                                    <v-icon size="30" class="m-1">mdi-cancel</v-icon>Out of stock</v-btn>
                            </div>

                        </div>
                    </v-col>

                </v-row>

                <div class="merchant w-full amx-auto p-3">
                    <div class="h-0.5 w-full mx-auto bg-zinc-900 rounded-full"></div>
                    <p class="p-1 mt-5 text-lg font-semibold">Details:</p>
                    <div class="1 flex">
                        <p class="px-2 py-1 opacity-80">Sold by: </p>
                        <p class="px-2 py-1">Alfa Store</p>
                    </div>
                    <div class="2 flex">
                        <p class="px-2 py-1 opacity-80">Ship by: </p>
                        <p class="px-2 py-1">Alfa Store</p>
                    </div>
                    <div class="3 flex">
                        <p class="px-2 py-1 opacity-80">Return: </p>
                        <p class="px-2 py-1">Eligible within 14 days</p>
                    </div>
                    <div class="4 flex">
                        <p class="px-2 py-1 opacity-80">Payment: </p>
                        <p class="px-2 py-1">secureCheckout</p>
                    </div>
                </div>
                <div class="added mt-5 px-5">
                    <p class="">Available from:</p>
                    <p class="text-left opacity-80">
                        {{ product.created_at.slice(0, 10) }}
                        {{ product.created_at.slice(11, 16) }}
                    </p>
                </div>
                <div class="images w-full mx-auto mt-20">
                    <h1 class="p-5 text-2xl font-bold">Images:</h1>
                    <v-img v-for="(img, i) in JSON.parse(product.image)" :key="i" width="90%" class="el mx-auto m-5"
                        height="100%" :src="img"></v-img>
                </div>
                <div class="h-0.5 w-1/2 mx-auto bg-zinc-600 rounded-full mt-32"></div>
                <Review />
                <!-- <div class="h-1 w-full bg-zinc-800 rounded-full mt-5"></div> -->
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
<style>
/* <-- remove scoped here if you have it*/
/* .v-carousel__controls { */
/* background: gray; */
/* opacity: 1; */
/* } */

.v-carousel__controls__item {
    color: #09090b
}
</style>

<script>

</script>

<style></style>