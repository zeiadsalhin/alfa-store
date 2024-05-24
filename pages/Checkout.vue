<script setup>
import Swal from 'sweetalert2'
import { useMainStore } from '~/store';
const router = useRouter()
const mainStore = useMainStore();
const cartItems = computed(() => mainStore.items);

//data
const email = ref(null);
const name = ref(null);
const phone = ref(null);
const address = ref(null);
const city = ref(null);
const country = ref(null);
const cc = ref("4333-3387-8788-6620");
const expdate = ref("06/15");
const cvv = ref("123");
const errorMessage = ref('')
const rules = [
    (value) => {
        if (value) return true;
        return 'required';
    },
];
const FinalPrice = ref(null)


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
        return total + (item.product.price * item.quantity);
    }, 0);
});

// process
async function proccess() {
    if (!name.value || !email.value || !phone.value || !address.value || !city.value || !country.value || !cc.value || !expdate.value || !cvv.value) {
        errorMessage.value = 'Please fill out all fields.'
        return;
    }

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
</script>
<template>
    <div class="mt-20">
        <div class="text-center" v-if="cartItems.length == 0">
            <v-img class="d-block mx-auto" src="" width="500"></v-img>
            <p>No Items Just Yet</p>
        </div>
        <v-container v-else>
            <div class="mb-3" v-if="cartItems.length > 0">
                <div class="h1 text-3xl p-5">
                    <h1>Shipping Address</h1>
                </div>
            </div>
            <v-form lazy-validation ref="form" class="mt-10" @submit.prevent="proccess">

                <p v-if="errorMessage" class="error bg-red-700 text-white p-1">{{ errorMessage }}</p>
                <p class="font-weight-bold p-2">Personal & Delivery</p>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="email" :rules="rules" outlined label="Email" type="email"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="name" :rules="rules" outlined label="Full Name"
                            type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="phone" :rules="rules" outlined label="Phone" type="tel"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="address" :rules="rules" outlined label="Address"
                            type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="city" :rules="rules" outlined label="City" type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="country" :rules="rules" outlined label="Country"
                            type="text"></v-text-field>
                    </v-col>
                </v-row>
                <p class="font-weight-bold p-2">Credit card</p>
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
                <div class="total flex space-x-5 mb-5 mt-5 text-2xl">
                    <p>Total Sub:</p>
                    <p>${{ (FinalPrice > 0 && FinalPrice < totalPrice ? FinalPrice : totalPrice).toLocaleString('en-US')
                            }} + VAT%</p>
                            <p v-if="FinalPrice" class="text-red-700 text-md">- 100%</p>
                </div>

                <p v-if="FPMsg" class="bg-green-700 text-white p-1 m-2">{{ FPMsg }}</p>
                <p v-else class="bg-red-700 text-white m-2">{{ FPErMsg }}</p>
                <div class="buttons flex justify-center w-f space-x-3 py-2">
                    <v-btn nuxt to="/cart" min-width="100" min-height="45" depressed>Back</v-btn>
                    <v-btn @click="proccess" type="submit" min-width="50" min-height="45" color="primary">Complete &
                        Pay
                        (${{ (FinalPrice > 0 && FinalPrice < totalPrice ? FinalPrice :
                            totalPrice).toLocaleString('en-US') }})</v-btn>
                </div>
            </v-form>
            <div class="payments space-y-5 p-5">
                <p>We accept:</p>
                <v-img src="/payments.webp" width="300"></v-img>
            </div>
        </v-container>
        <br /><br />
        <Footer />
    </div>
</template>