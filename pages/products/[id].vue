<script setup>
import Swal from 'sweetalert2'
import { useMainStore } from '@/store';

const mainStore = useMainStore();

const addToCart = (product) => {
    mainStore.addToCart(product);

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
        <v-container v-if="product" class="mt-20">
            <v-row justify="center">
                <v-col cols="11" md="7">
                    <h2 class="text-center text-h4 font-weight-bold">
                        {{ product.name }}
                    </h2>
                    <div class="mt-2 text-center">
                        <v-rating readonly half-increments class="p-5" color="yellow darken-2"
                            background-color="grey lighten-1" :value="product.ratings" dense size="20"></v-rating>
                        <v-chip small label outlined class="mr-1" v-for="(t, i) in product.tags"
                            :key="`prod${product.id}-${i}`">
                            {{ t }}
                        </v-chip>
                    </div>
                    <br />
                    <v-img width="100%" class="el rounded-lg" height="50vh" :src="product.image"></v-img>
                    <p class="mt-5 mb-5">
                        {{ product.description }}
                    </p>
                    <p class="text-h5 mb-7">
                        Price: {{ product.price + ' $' }}
                    </p>
                    <Colors />
                    <br />
                    <v-btn @click="addToCart(product)" min-height="45" min-width="150" class="m-2" color="primary">Add
                        To Cart</v-btn>
                    <v-btn @click="addToCart(product), navigateTo('/checkout')" min-height="45" min-width="120"
                        class="m-2" color="lighten-gray">Buy Now</v-btn>
                    <v-btn v-if="admin" @click="DeleteProducts" min-height="45" min-width="150" class="m-2"
                        color="red-darken-4">Delete
                        product</v-btn>
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
        <ScrollTop />
    </div>
</template>

<script>
export default {
    data() {
        return {
            product: null,
        };
    },
    mounted() {
        this.fetchProducts();
    },
    methods: {

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
                // console.log(this.product.name)

            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
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

                // console.log(productId)
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