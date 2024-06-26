<template>
    <div class="p-5 space-y-7">
        <h1 class="text-center text-3xl font-semibold">Cart</h1>
        <div v-if="items">
            <div class=" space-y-5">
                <div v-for="(item, index) in items" :key="index" class="my-auto">
                    <div style="height: 0.01rem;" class="rounded-md w-full bg-slate-800"></div>
                    <div class="item flex my-auto max-auto y-2">
                        <div class="image w-fit max-h-fit  my-auto p-2"><v-img min-width="120" max-width="120"
                                min-height="120" max-height="120" class="el rounded-sm" height="100%"
                                :src="JSON.parse(item.product.image)[0]" cover></v-img>
                        </div>
                        <div class="info my-auto p-2 w-fit">
                            <div class="name text-lg font-normal">{{ item.product.name }}</div>
                            <div class="price font-bold">Price: {{ settings?.currency + ' ' +
                                (item.discountedPrice ? item.discountedPrice :
                                    item.product.price)
                                }}
                            </div>
                            <div class="option font-thin" v-if="item.selectedOption">Option: {{ item.selectedOption }}
                            </div>
                            <div class="price font-light">Quantity: x{{ item.quantity }}</div>
                            <div class="remove flex my-auto space-x-2 p-2 mt-2"><button @click="removeFromCart(index)"
                                    class="bg-red-700 text-white my-auto px-2 py-1 rounded-md">Remove</button>
                                <nuxt-link :to="`/products/${item.product.id}`"
                                    class="bg-green-700 text-white my-auto px-2 py-1 rounded-md">View</nuxt-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="h-0.5 rounded-md w-full bg-slate-800"></div>
                <div v-if="items.length != 0" class="total px-4 mb-5 text-xl">Subtotal: {{ settings?.currency + ' ' +
                    totalPrice.toLocaleString('en-US') }}</div>
            </div>
            <div v-if="items.length != 0" class="text-xl text-center mb-10"><v-btn variant="tonal" color="red-lighten-1"
                    @click="clearCart" class="w-11/12 text-white my-2a p-2.5a rounded-md" min-height="40"><v-icon
                        size="25">mdi-delete-outline</v-icon><v-progress-circular v-if="clearing" size="20" class="mx-3"
                        color="dark-blue" indeterminate></v-progress-circular>Clear
                    Cart</v-btn>
                <v-btn to="Checkout" color="grey-darken-3
" class="w-11/12 bg-gray-600 my-2 p-2.5 text-lg rounded-md" min-height="40"><v-icon size="20"
                        class="mx-1">mdi-lock-outline</v-icon>
                    Checkout({{ settings?.currency + ' ' + totalPrice.toLocaleString('en-US') }})
                </v-btn>
            </div>
            <div v-else class="empty text-center">
                <h1 class="mb-5">Cart is Empty</h1>
                <v-btn to="/" class=" bg-slate-800 px-5 text-xl rounded-md">Home
                </v-btn>
            </div>

            <div v-if="items.length != 0" class="payments space-y-5">
                <p>We accept:</p>
                <v-img src="/payments.webp"></v-img>
            </div>
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

<script setup lang="ts">
import { useMainStore } from '@/store';

const mainStore = useMainStore();
const cartItems = ref([]);
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const settings = ref()
const items = computed(() => mainStore.items);
onBeforeMount(async () => {
    try {
        const { data: config, error: configerror } = await supabase
            .from('store_config')
            .select('*')

        settings.value = config[0]
        await mainStore.fetchCartFromSupabase();

    } catch {
        console.log('error fetching cart from database');

    }
});

//seo 
useSeoMeta({
    title: computed(() => `Alfa Store - Cart (${items.value ? items.value.length : 'Empty Cart'})`),
    ogTitle: computed(() => `Alfa Store - Cart (${items.value ? items.value.length : 'Empty Cart'})`),
    description: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogDescription: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogImage: 'https://alfastorecommerce.netlify.app/mainicon.ico',
    twitterCard: 'summary_large_image',
})
// console.log('cart page items:', items.value);

// Calculate the total price of all items in the cart
const totalPrice = computed(() => {
    let total = 0;
    items.value.forEach(item => {
        total += item.discountedPrice ? item.discountedPrice * item.quantity : item.product.price * item.quantity; // Adjust according to your cart item structure
    });
    return total;
});

const removeFromCart = async (index) => {
    // console.log(index);

    await mainStore.removeFromCart(index);
    // setTimeout(() => {
    //     fetchCartItems()
    // }, 1000);
};

const clearing = ref(false)

const clearCart = () => {
    clearing.value = true
    mainStore.clearCart();
    setTimeout(() => {
        // fetchCartItems()
    }, 1000);
};
</script>