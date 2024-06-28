<script setup>
import Swal from 'sweetalert2'
import { useMainStore } from '~/store';
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const UID = ref(null);
const router = useRouter()
const mainStore = useMainStore();
const cartItems = computed(() => mainStore.items);

// access only if cart item !=0
onMounted(() => {
    if (cartItems.value.length == 0) {
        navigateTo('/cart')
    }
})
//data

const errorMessage = ref('')
const successMessage = ref('');
const dialogVisible = ref(false);
const paymenterrorMessage = ref('')
const addresserrorMessage = ref('')
const isDisabled = ref(false);
const notapplied = ref(true)
const rules = [
    (value) => {
        if (value) return true;
        return 'required';
    },
];

// Define a ref to store the received user addresses from child
const receivedAddresses = ref([]);

// Handler function to receive the emitted user addresses from child
const handleUserAddresses = (input) => {
    receivedAddresses.value = input;
    addresserrorMessage.value = ''
    // console.log(receivedAddresses.value);
};

const coupon = ref(null)
const paymentMethod = ref('COD');
const isPaymentD = ref(true);
const FinalPrice = ref(null)
const ShippingFee = ref(1.00);
const CheckoutPrice = ref(null);
const confirmorderloader = ref(false);
const FPMsg = ref(null)
const FPErMsg = ref(null)

//total price 
const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
        return total + (item.discountedPrice ? item.discountedPrice * item.quantity : item.product.price * item.quantity);
    }, 0);
});

// Apply Coupon
const couponapply = () => {
    isPaymentD.value = !isPaymentD.value;
    if (coupon.value == 'FREE') {
        console.log("coupon applied")
        const originalvalue = totalPrice.value;
        FinalPrice.value = Number((originalvalue * 0.001).toFixed(3))
        FPMsg.value = 'Congratulations! you got 99% discount'
        isDisabled.value = true;
        if (paymentMethod.value == 'COD') {
            CheckoutPrice.value = FinalPrice.value + ShippingFee.value
            // console.log(CheckoutPrice.value);
            mainStore.setCheckoutPrice(CheckoutPrice.value);
            // console.log('shipping fee added', FinalPrice.value + ShippingFee.value);
        } else {
            mainStore.setCheckoutPrice(FinalPrice.value);
            // console.log(FinalPrice.value); 
        }
        notapplied.value = false
    } else {
        FPErMsg.value = 'Please try another coupon'
    }
}

// remove coupon
const removecoupon = () => {
    mainStore.setCheckoutPrice(paymentMethod.value == 'COD' ? CheckoutPrice.value = totalPrice.value + ShippingFee.value : totalPrice.value);
    FinalPrice.value = totalPrice
    notapplied.value = true
    isPaymentD.value = !isPaymentD.value;
    isDisabled.value = false
    coupon.value = ''
    FPMsg.value = ''
}

// Clear coupon 
onBeforeMount(() => {
    removecoupon();
    // console.log("Coupon removed");
});

// Set invoice
const SetInvoice = () => {
    mainStore.setCheckoutPrice(paymentMethod.value == 'COD' ? CheckoutPrice.value = totalPrice.value + ShippingFee.value : totalPrice.value);
    // console.log(paymentMethod.value);
    // console.log('#' + mainStore.items[0].product.id + '-' + mainStore.items[0].product.name + '-' + mainStore.items[0].selectedOption + ' X' + mainStore.items[0].quantity);
}

// process
async function proccess() {
    // Require Address
    if (receivedAddresses.value == 0) {
        addresserrorMessage.value = 'Please Select Address'
        // scroll to error
        const viewp = document.getElementById('addresserror')
        var headerOffset = 120;
        var elementPosition = viewp.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        // console.log(receivedAddresses.value);
        return;
    }
    // Require payment Method
    if (!paymentMethod.value) {
        paymenterrorMessage.value = 'Please Select '
        // scroll to error
        const viewp = document.getElementById('paymethoderror')
        var headerOffset = 120;
        var elementPosition = viewp.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        return;
    }

    errorMessage.value = ''
    // Generating Order 
    try {
        confirmorderloader.value = true
        //get userID
        const { data, error } = await supabase.auth.getSession()
        if (data.session) {
            UID.value = data.session.user.id
        }
        // 
        const { error: insertError } = await supabase.from('user_orders').insert({
            uid: UID.value ? UID.value : 'Guest_' + receivedAddresses.value.name + '-' + receivedAddresses.value.phone,
            order_no: '#' + mainStore.items[0].product.id + '-' + mainStore.items[0].product.name + ' x' + mainStore.items[0].quantity,
            order_details: [{ items: mainStore.items, shippingAddress: receivedAddresses.value, invoice: mainStore.checkoutPrice }],
            order_status: [{ status: `${paymentMethod.value == 'VC' ? 'Received,Payment Pending' : 'Received'}` }],
            order_invoice: [{ invoice_value: mainStore.checkoutPrice }],
            payment_method: [{ option: paymentMethod.value }],
        });
        if (insertError) {
            console.log(insertError);
            return;
        }
        // Show user dialog
        setTimeout(() => {
            successMessage.value = 'Order Placed Successfully'
        }, 4000)

        // await Swal.fire({
        //     title: "Proceessing your order",
        //     icon: "info",
        //     allowEscapeKey: false,
        //     allowOutsideClick: false,
        //     timer: 3000,
        //     timerProgressBar: true,
        //     text: "Please Wait",
        //     showConfirmButton: false,
        // }).then(() => {
        // setTimeout(() => {
        //     Swal.fire({
        //         title: "Order Complete (Experimental, thank you for testing)",
        //         icon: "success",
        //         allowEscapeKey: false,
        //         allowOutsideClick: false,
        //         timer: 3000,
        //         timerProgressBar: true,
        //         text: "Thank you, your order will be shipped",
        //         showConfirmButton: false,
        //     });
        //    
        //     //  router.push("/user");
        // }, 4000);
        // })
        confirmorderloader.value = true
    } catch (error) {
        console.error('Error generating order:', error.message);
    }
};

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
    <div class="mt-12">
        <div class="text-center" v-if="cartItems.length == 0">
            <v-img class="d-block mx-auto" src="" width="500"></v-img>
            <p>No Items Just Yet</p>
        </div>
        <v-container v-else>
            <div class="h1 text-3xl text-center py-2">
                <h1 class="p-3">Checkout</h1>
                <div style="height: 0.01rem;" class="rounded-md w-full bg-slate-900"></div>
            </div>
            <!--Stepper-->
            <v-stepper-vertical color="gray" flat :theme="theme.global.current.value.dark ? 'dark' : 'light'"
                class=" mt-5 mb-10" :items="['Shipping Address', 'Payment Method', 'Coupon (Optional)']">
                <template #item.1>
                    <div class="1">
                        <p id="addresserror" v-if="addresserrorMessage != null"
                            class="bg-red-700 text-white text-md mb-3 rounded-sm">
                            {{ addresserrorMessage }}
                        </p>
                        <ShippingCheckout @selected-address="handleUserAddresses" />
                    </div>
                </template>
                <template #item.2>
                    <div class="2">
                        <div class="p-1">
                            <p id="paymethoderror" v-if="paymentMethod == null"
                                class="bg-red-700 text-white text-md mb-3a rounded-sm">
                                {{ paymenterrorMessage }}
                            </p>
                            <v-radio-group v-model="paymentMethod" @change="SetInvoice" :disabled="isPaymentD">
                                <div class="flex w-fit">
                                    <v-radio :disabled="true" label="Credit card (Soon)"></v-radio><v-icon
                                        class="my-auto ml-3 opacity-40">mdi-credit-card-fast</v-icon>
                                </div>
                                <div class="flex w-fit">
                                    <v-radio :disabled="true" value="VC"
                                        label="Pay with Vodafone Cash (VCN) (Soon)"></v-radio><v-icon
                                        class="my-auto ml-3 opacity-40">mdi-wallet-outline</v-icon>
                                </div>
                                <div class="flex w-fit">
                                    <v-radio value="COD" label="Cash on Delivery (COD)"></v-radio><v-icon
                                        class="my-auto ml-3 opacity-60">mdi-cash-fast</v-icon>
                                </div>
                            </v-radio-group>
                        </div>
                        <EPayments />
                    </div>
                </template>
                <template #item.3 prev-text="Back" next-text="Next">
                    <div class="3">
                        <!-- <div style="height: 0.01rem;" class="rounded-md w-full bg-slate-900"></div> -->
                        <p v-if="FPMsg" class="bg-green-700 text-white p-1 m-2">{{ FPMsg }}</p>
                        <p v-else class="bg-red-700 text-white m-2">{{ FPErMsg }}</p>
                        <div class="coupon md:flex md:space-x-5 p-2 md:w-2/3">
                            <p class="text-lg">Have coupon? :</p>
                            <v-text-field v-model="coupon" variant="outlined" density="compact"
                                :disabled="isDisabled"></v-text-field>
                            <v-btn v-if="notapplied" @click="couponapply" variant="tonal" class="">Apply</v-btn>
                            <v-btn v-else @click="removecoupon" variant="tonal" class="">Remove</v-btn>
                            <span class="p-2 opacity-50 text-sm">Hint: remove to edit payment method</span>
                        </div>
                    </div>
                </template>
            </v-stepper-vertical>
            <!-- <div style="height: 0.01rem;" class="rounded-md w-full bg-slate-900"></div> -->
            <!--price calculations-->
            <div class="price calculations md:w-9/12">
                <div class="subtotal flex justify-between mb-2 mt-5 text-lg">
                    <p>Total Sub:</p>
                    <p>${{ (FinalPrice > 0 && FinalPrice < totalPrice ? FinalPrice : totalPrice).toLocaleString('en-US')
                            }} (Including VAT%)</p>
                            <p v-if="FinalPrice < totalPrice" class="text-red-700 text-md">- 100%</p>
                </div>
                <div v-if="paymentMethod == 'COD'" class="shippingfee flex justify-between mb-5 mt-2 text-lg">
                    <p class="flex">Shipping
                        <ShippingDialog />
                    </p>
                    <p>${{ (ShippingFee).toLocaleString('en-US') }}</p>
                </div>
                <div class="total flex justify-between mb-5 mt-2 font-semibold text-2xl">
                    <p>Total:</p>
                    <p class="font-bold">${{ (FinalPrice > 0 && FinalPrice < totalPrice ? (paymentMethod == 'COD' ?
                        FinalPrice + ShippingFee : FinalPrice) : (paymentMethod == 'COD' ? totalPrice + ShippingFee :
                            totalPrice)).toLocaleString('en-US') }}</p>
                </div>
                <div class="w-11/12 mx-auto h-1 bg-zinc-800 rounded-xl"></div>
                <div class="SecuredCheckout mb-5 mt-5">
                    <p class="flex opacity-60"><v-icon class="mx-3">mdi-shield-check</v-icon>Secure Checkout
                        Guarantee
                    </p>
                </div>
            </div>

            <div class="pay mt-5 flex-col text-center">
                <!-- <Paypal /> -->
                <!-- <p>Or</p> -->
            </div>
            <div class="buttons flex justify-center w-f space-x-3 py-2">
                <v-btn nuxt to="/cart" min-width="100" min-height="45" depressed>Back</v-btn>
                <v-btn @click="proccess" type="submit" min-width="50" min-height="45" color="primary">
                    <v-progress-circular v-if="confirmorderloader" width="2" size="20" color="zinc"
                        class="text-zinc-300 mr-1" indeterminate></v-progress-circular>Complete Order ($
                    {{ (FinalPrice < totalPrice ? FinalPrice : totalPrice) + (paymentMethod == 'COD' ? ShippingFee : 0)
                        }}) <!-- & Pay (${{ (FinalPrice> 0 && FinalPrice < totalPrice ? FinalPrice :
                            totalPrice).toLocaleString('en-US') }}) -->
                </v-btn>
            </div>
            <OrderConfirmation :successMessage="successMessage" />
            <div class="payments space-y-5 p-5">
                <p>We accept:</p>
                <v-img src="/payments.webp" width="300"></v-img>
            </div>
        </v-container>
        <br /><br />
        <!-- <Footer /> -->
        <!-- <ScrollTop /> -->
    </div>
</template>