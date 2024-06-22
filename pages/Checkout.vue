<script setup>
import Swal from 'sweetalert2'
import { useMainStore } from '~/store';
const router = useRouter()
const mainStore = useMainStore();
const cartItems = computed(() => mainStore.items);

//data
const expanded = ref(false);
const cc = ref("4333-3387-8788-6620");
const expdate = ref("06/15");
const cvv = ref("123");
const errorMessage = ref('')
const isDisabled = ref(false);
const notapplied = ref(true)
const rules = [
    (value) => {
        if (value) return true;
        return 'required';
    },
];
const coupon = ref(null)
const FinalPrice = ref(null)
const FPMsg = ref(null)
const FPErMsg = ref(null)


// Card format
const formatcard = () => {
    cc.value = cc.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1-').slice(0, 19)
}
//expiration date Format 
const formatexp = () => {
    expdate.value = expdate.value.replace(/\D/g, '').replace(/^(.{2})(.{1,})$/, '$1/$2').slice(0, 5);
};

// CVV Format
const formatcvv = () => {
    cvv.value = cvv.value.replace(/\D/g, '').slice(0, 3);;
};

//total price 
const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
        return total + (item.discountedPrice || item.product.price * item.quantity);
    }, 0);
});

// Apply Coupon
const couponapply = () => {
    if (coupon.value == 'FREE') {
        console.log("coupon applied")
        const originalvalue = totalPrice.value;
        FinalPrice.value = (originalvalue * 0.001).toFixed(2)
        FPMsg.value = 'Congratulations! you got 99% discount'
        isDisabled.value = true;
        mainStore.setDiscountedPrice(FinalPrice);
        notapplied.value = false
    } else {
        FPErMsg.value = 'Please try another coupon'
    }
}

// remove coupon
const removecoupon = () => {
    mainStore.setDiscountedPrice(0);
    notapplied.value = true
    isDisabled.value = false
    coupon.value = ''
    FPMsg.value = ''
}

// Clear coupon 
onBeforeMount(() => {
    removecoupon();
    // console.log("Coupon removed");
});

// process
async function proccess() {
    // if (!name.value || !email.value || !phone.value || !address.value || !city.value || !country.value || !cc.value || !expdate.value || !cvv.value) {
    //     errorMessage.value = 'Please fill out all fields.'
    //     return;
    // }

    errorMessage.value = ''
    await Swal.fire({
        title: "Proceessing your order",
        icon: "info",
        allowEscapeKey: false,
        allowOutsideClick: false,
        timer: 3000,
        timerProgressBar: true,
        text: "Please Wait",
        showConfirmButton: false,
    });
    await Swal.fire({
        title: "Order Complete",
        icon: "success",
        allowEscapeKey: false,
        allowOutsideClick: false,
        timer: 3000,
        timerProgressBar: true,
        text: "Thank you, your order will be shipped",
        showConfirmButton: false,
    });
    //Remove items from cart
    mainStore.clearCart();
    router.push("/");
}
//seo
useSeoMeta({
    title: 'Alfa Store - SecureCheckout',
    ogTitle: 'Alfa Store -  SecureCheckout',
    description: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogDescription: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogImage: 'https://alfastorecommerce.netlify.app/mainicon.ico',
    twitterCard: 'summary_large_image',
})
</script>
<template>
    <div class="mt-20">
        <div class="text-center" v-if="cartItems.length == 0">
            <v-img class="d-block mx-auto" src="" width="500"></v-img>
            <p>No Items Just Yet</p>
        </div>
        <v-container v-else>
            <ShippingCheckout />
            <div class="h1 text-xl mt-10">
                <h1>Payment Method:</h1>
            </div>
            <p class="p-1 mt-5">
                <v-radio-group>
                    <v-radio :disabled="true" label="Credit card (Soon)"></v-radio>
                    <v-radio value="VC" label="Pay with Vodafone Cash (VCN)"></v-radio>
                    <v-radio value="COD" label="Cash on Delivery (COD)"></v-radio>
                </v-radio-group>
            </p>
            <div class="creditCard" v-if="expanded">
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="cc" @input="formatcard" :rules="rules" outlined
                            label="Credit Card Number"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="expdate" @input="formatexp" :rules="rules" outlined
                            label="Exp date"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="cvv" @input="formatcvv" :rules="rules" outlined
                            label="Security code/CVV"></v-text-field>
                    </v-col>
                </v-row>
            </div>
            <div class="total flex space-x-5 mb-5 mt-5 text-2xl">
                <p>Total Sub:</p>
                <p>${{ (FinalPrice > 0 && FinalPrice < totalPrice ? FinalPrice : totalPrice).toLocaleString('en-US') }}
                        + VAT%</p>
                        <p v-if="FinalPrice" class="text-red-700 text-md">- 100%</p>
            </div>

            <p v-if="FPMsg" class="bg-green-700 text-white p-1 m-2">{{ FPMsg }}</p>
            <p v-else class="bg-red-700 text-white m-2">{{ FPErMsg }}</p>
            <div class="coupon md:flex md:space-x-5 p-2 md:w-2/3">
                <p class="text-lg">Have coupon? :</p>
                <v-text-field v-model="coupon" variant="outlined" density="compact"
                    :disabled="isDisabled"></v-text-field>
                <v-btn v-if="notapplied" @click="couponapply" variant="tonal" class="">Apply</v-btn>
                <v-btn v-else @click="removecoupon" variant="tonal" class="">Remove</v-btn>
                <span class="p-2 opacity-50 ">Hint: use Code FREE to get 99%</span>
            </div>
            <div class="pay mt-5 flex-col text-center">
                <!-- <Paypal /> -->
                <!-- <p>Or</p> -->
            </div>
            <div class="buttons flex justify-center w-f space-x-3 py-2">
                <v-btn nuxt to="/cart" min-width="100" min-height="45" depressed>Back</v-btn>
                <v-btn @click="proccess" type="submit" min-width="50" min-height="45" color="primary">Complete Order
                    <!-- &
                    Pay
                    (${{ (FinalPrice > 0 && FinalPrice < totalPrice ? FinalPrice : totalPrice).toLocaleString('en-US')
                        }}) -->
                </v-btn>
            </div>
            <div class="payments space-y-5 p-5">
                <p>We accept:</p>
                <v-img src="/payments.webp" width="300"></v-img>
            </div>
        </v-container>
        <br /><br />
        <Footer />
        <!-- <ScrollTop /> -->
    </div>
</template>