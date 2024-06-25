<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()

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
const FetchedOrderData = ref()
const emits = defineEmits(['trigger-update', 'refetch-orders']);
// const emit = defineEmits();

// Define methods
const handleUpdateClick = () => {
    emits('trigger-update');
    // console.log('Child:', SelectedOrderData.value);
    // console.log(JSON.parse(SelectedOrderData.value.order_details[0].items[0].product.image)[0]);
};
const refetchOrders = () => {
    emits('refetch-orders');
    dialog.value = false
    // console.log('Child:', SelectedOrderData.value);
    // console.log(JSON.parse(SelectedOrderData.value.order_details[0].items[0].product.image)[0]);
};

// Copy
const copyToClipboard = () => {
    const textToCopy = SelectedOrderData.value.order_ref;
    navigator.clipboard.writeText(textToCopy)
}

const overlay = ref(false)
// Cancel Order
const CancelOrder = async () => {
    overlay.value = true
    const { data, error } = await supabase.auth.getSession()
    // UID.value = data.session.user.id
    try {
        // Save the edited address to Supabase
        const { data, error } = await supabase
            .from('user_orders')
            .update({ order_status: [{ status: 'Canceled' }] })
            .eq('order_ref', SelectedOrderData.value.order_ref)
        if (error) {
            throw error;
        } else {
            const { data, error } = await supabase
                .from('user_orders')
                .select()
                .eq('order_ref', SelectedOrderData.value.order_ref)
            FetchedOrderData.value = [data][0]
            SelectedOrderData.value = FetchedOrderData.value[0]
            // console.log(SelectedOrderData.value);
            // console.log(FetchedOrderData.value);
            if (error) { throw error } else { overlay.value = false }

        }
    } catch (error) {
        console.log(error);
    }
}
const dialog = ref(false)
</script>
<template>
    <div class="pa-4 text-center">
        <v-dialog v-model="dialog" :theme="theme.global.current.value.dark ? 'dark' : 'light'" close-delay="0"
            :opacity="0" class="bg-zinc-950 bg-opacity-80 backdrop-blur-sm" max-width="800">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn @click="handleUpdateClick" variant="tonal" elevation="1" v-bind="activatorProps" max-height="40"
                    max-width="40" min-width="30" class="text-h7"><v-icon size="20">mdi-chevron-right</v-icon></v-btn>
            </template>
            <v-card prepend-icon="mdi-truck" title="Order Details">
                <v-card-text>
                    <div class="p-2 space-y-3">
                        <div class="title flex space-x-4">
                            <p class="font-bold">Order:</p>
                            <p class="text-md">{{ SelectedOrderData?.order_no }}</p>
                        </div>
                        <div class="Details flex space-x-4">
                            <p class="font-bold">Details:</p>
                            <div class="Options">
                                <div class="flex opacity-80"
                                    v-for="(option, index) in SelectedOrderData?.order_details[0]?.items" :key="index">
                                    <p class="">x{{ option.quantity }} - </p>
                                    <p>{{ option.selectedOption ? option.selectedOption : '' }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="payment flex space-x-4">
                            <p class="font-bold">Payment method:</p>
                            <p class="text-md">{{ SelectedOrderData?.payment_method[0]?.option }}</p>
                        </div>
                        <div class="invoice flex space-x-4">
                            <p class="font-bold">Invoice:</p>
                            <p class="text-md">${{ SelectedOrderData?.order_invoice[0]?.invoice_value }}</p>
                        </div>
                        <!-- <div class="flex w-full"> -->
                        <!-- <v-img :src="JSON.parse(SelectedOrderData.order_details[0].items[0].product.image)[0]"
                                class="my-auto" max-width="65" min-width="65" max-height="50" cover></v-img> -->
                        <!-- <p class="ml-2 my-auto underline"></p> -->
                        <!-- </div> -->
                        <div class="status flex space-x-4">
                            <p class="font-bold">Status:</p>
                            <p class="text-md">{{ SelectedOrderData?.order_status[0]?.status }}</p>
                        </div>
                        <div class="reference flex space-x-4">
                            <p class="font-bold">Order_ref:</p>
                            <p class="text-md">{{ SelectedOrderData?.order_ref }} <v-icon @click="copyToClipboard"
                                    size="15" class="hover:cursor-pointer">mdi-content-copy</v-icon></p>
                        </div>
                        <p class="text-md">
                        <p class="font-bold">Last Update:</p>{{ new
                            Date(SelectedOrderData?.updated_at).toLocaleString('en-us') }}
                        </p>
                        <v-btn @click="CancelOrder" v-if="SelectedOrderData?.order_status[0]?.status != 'Canceled'"
                            variant="flat" color="red" elevation="1" prepend-icon="mdi-cancel" text="Cancel order"
                            max-height="40"></v-btn>

                        <v-alert v-if="SelectedOrderData?.order_status[0]?.status == 'Canceled'"
                            text="Request In progress" title="Order Canceled" type="error" color="red"></v-alert>

                        <!--Overlay-->
                        <v-overlay :model-value="overlay" theme="light"
                            class="align-center justify-center bg-zinc-950 bg-opacity-50 backdrop-blur-sm">
                            <div class="flex flex-col justify-center">
                                <v-progress-circular class="mx-auto" color="primary" size="34"
                                    indeterminate></v-progress-circular>
                                <p class="m-4">Cancelling Order...</p>
                            </div>
                        </v-overlay>
                    </div>
                    <small class="text-caption text-medium-emphasis">*indicates required field</small>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

                    <v-btn color="surface-current" text="Ok" variant="tonal" @click="refetchOrders"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>