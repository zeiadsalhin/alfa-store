<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();


// const updatedOrder = ref('Updated Order Info');
// // pass address to checkout
// // Define emits to emit events to parent
// const emits = defineEmits(['updated-order']); // Define the events emitted by the child component
// // Function to updated-order to the parent
// function emitUserAddresses(input) {
//     emits('updated-order', input);
//     console.log(updatedOrder.value);
// };

// Define props and emits
const props = defineProps({
    userOrders: {
        type: Object,
        required: true,
    },
});
const SelectedOrderData = ref(props.userOrders)
const emits = defineEmits(['trigger-update']);

// Define methods
const handleUpdateClick = () => {
    emits('trigger-update');
    console.log('Child:', SelectedOrderData.value);
    // console.log(JSON.parse(SelectedOrderData.value.order_details[0].items[0].product.image)[0]);
};

const dialog = ref(false)
</script>
<template>
    <div class="pa-4 text-center">
        <v-dialog v-model="dialog" :theme="theme.global.current.value.dark ? 'dark' : 'light'" close-delay="0"
            :opacity="0" class="bg-zinc-950 bg-opacity-80 backdrop-blur-sm" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn @click="handleUpdateClick" variant="outlined" elevation="1" prepend-icon="mdi-account"
                    text="View" v-bind="activatorProps" max-height="40"></v-btn>
            </template>
            <v-card prepend-icon="mdi-truck" title="Order Details">
                <v-card-text>
                    <div class="p-2 space-y-3">
                        <div class="title flex space-x-4">
                            <p class="font-bold">Order:</p>
                            <p class="text-md">{{ SelectedOrderData.order_no }}</p>
                        </div>
                        <div class="Details flex space-x-4">
                            <p class="font-bold">Details:</p>
                            <div class="Options">
                                <div class="flex opacity-80"
                                    v-for="(option, index) in SelectedOrderData.order_details[0].items" :key="index">
                                    <p class="">x{{ option.quantity }} - </p>
                                    <p>{{ option.selectedOption ? option.selectedOption : '' }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="payment flex space-x-4">
                            <p class="font-bold">Payment method:</p>
                            <p class="text-md">{{ SelectedOrderData.payment_method[0].option }}</p>
                        </div>
                        <div class="invoice flex space-x-4">
                            <p class="font-bold">Invoice:</p>
                            <p class="text-md">${{ SelectedOrderData.order_invoice[0].invoice_value }}</p>
                        </div>
                        <!-- <div class="flex w-full"> -->
                        <!-- <v-img :src="JSON.parse(SelectedOrderData.order_details[0].items[0].product.image)[0]"
                                class="my-auto" max-width="65" min-width="65" max-height="50" cover></v-img> -->
                        <!-- <p class="ml-2 my-auto underline"></p> -->
                        <!-- </div> -->
                        <div class="status flex space-x-4">
                            <p class="font-bold">Status:</p>
                            <p class="text-md">{{ SelectedOrderData.order_status[0].status }}</p>
                        </div>
                        <div class="reference flex space-x-4">
                            <p class="font-bold">Order_ref:</p>
                            <p class="text-md">{{ SelectedOrderData.order_ref }}</p>
                        </div>
                    </div>
                    <small class="text-caption text-medium-emphasis">*indicates required field</small>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

                    <v-btn color="surface-current" text="Ok" variant="tonal" @click="dialog = false"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>