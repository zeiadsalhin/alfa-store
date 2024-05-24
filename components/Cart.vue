<template>
    <div class="p-5 space-y-7">
        <h1 class="text-center text-3xl font-semibold">Cart</h1>
        <ul class=" space-y-5">

            <li v-for="(item, index) in cartItems" :key="index" class="flex my-auto mx-auto space-x-1">

                <div class="image w-44 max-h-36 p-2"><v-img width="100%" class="el rounded-lg" height="100%"
                        :src="item.product.image" cover></v-img>
                </div>
                <div class="info my-auto p-2 w-fit">
                    <div class="name">{{ item.product.name }}</div>
                    <div class="price">Price: ${{ item.product.price }}</div>
                    <div class="price">X {{ item.quantity }}</div>
                    <div class="remove flex my-auto space-x-2 p-2 mt-2"><button @click="removeFromCart(index)"
                            class="bg-red-700 my-auto px-2 py-1 rounded-md">Remove</button>
                        <nuxt-link :to="`/products/${item.product.id}`"
                            class="bg-green-700 my-auto px-2 py-1 rounded-md">View</nuxt-link>
                    </div>
                </div>
            </li>
            <div class="h-1 rounded-md w-full bg-slate-950"></div>
            <div v-if="cartItems.length != 0" class="total px-4 text-xl">Total Price: ${{
                totalPrice.toLocaleString('en-US') }}</div>
        </ul>
        <div v-if="cartItems.length != 0" class="md:1flex mx-auto text-xl text-center md:1space-x-5 "><v-btn
                variant="tonal" color="red-lighten-1" @click="clearCart"
                class="w-11/12 text-white my-2 p-2.5 rounded-md">Clear
                Cart</v-btn>
            <v-btn to="Checkout" color="grey-darken-3
" class="w-11/12 bg-gray-600 my-2 p-2.5 text-lg rounded-md">
                Checkout(${{ totalPrice.toLocaleString('en-US') }})
            </v-btn>
        </div>
        <div v-else class="empty text-center">
            <h1 class="mb-5">Cart is Empty</h1>
            <v-btn to="/" class=" bg-slate-800 px-5 text-xl rounded-md">Home
            </v-btn>
        </div>

        <div v-if="cartItems.length != 0" class="payments space-y-5">
            <p>We accept:</p>
            <v-img src="/payments.webp"></v-img>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/store';

const mainStore = useMainStore();
const cartItems = computed(() => mainStore.items);

// Calculate the total price of all items in the cart
const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
});

const removeFromCart = (index) => {
    mainStore.removeFromCart(index);
};

const clearCart = () => {
    mainStore.clearCart();
};
</script>