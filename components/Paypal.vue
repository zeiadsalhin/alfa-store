<template>
    <div>
        <div class="w-60 mx-auto" ref="paypalContainer"></div>
        <button v-if="perror" class="text-red-500">Error: {{ perror }}</button>
    </div>
</template>

<script setup>
// load payment info 
import { useMainStore } from '~/store';
const router = useRouter()
const mainStore = useMainStore();
const cartItems = computed(() => mainStore.items);
const discount = computed(() => mainStore.discountedPrice);

const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
});

const loaded = ref(false);
const paidFor = ref(false);
const perror = ref(null)

// Update product price based on discount value
watch(discount, (newValue, oldValue) => {

    product.price = newValue < totalPrice.value && newValue > 0 ? newValue : totalPrice.value;
});
const product = {
    price: totalPrice.value,
    description: "Thank you for buying",
};


const setLoaded = () => {
    loaded.value = true;
    paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [
                    {
                        description: product.description,
                        amount: {
                            currency_code: "USD",
                            value: product.price
                        }
                    }
                ]
            });
        },
        onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            paidFor.value = true;
            mainStore.pushOrder(order)
            router.push('/orders/')
            mainStore.clearCart();
        },
        onError: err => {
            console.log(err);
            perror.value = err
        },
        style: {
            tagline: false,
            layout: 'horizontal',
            color: 'black',
            shape: 'sharp',
            label: 'pay',
            borderRadius: 1,
        }
    }).render(paypalContainer.value);
};

// Load PayPal SDK script when component is mounted
const paypalContainer = ref(null); // Define a ref for the PayPal container
onMounted(() => {
    setLoaded()
});

</script>