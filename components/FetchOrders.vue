<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loadingOrders = ref(true);
const tabledata = ref(false);
const updateSuccess = ref(false);
const OrderItems = ref({});
const OrderUpdate = ref({});
// const expanded = ref(false);
// Fetch Ads 
onMounted(() => {
    FetchOrdersData();
});
const FetchOrdersData = async () => {

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    try {
        const { data, error } = await supabase.from('user_orders').select('*');

        // console.log('Products:', data);
        OrderItems.value = data
        // console.log(data);
        tabledata.value = true
        loadingOrders.value = false
    } catch (error) {
        console.error('Error fetching Ads:', error.message);
    }
}
// Function to open image input
// const openFileInput = () => {
//     const fileInput = document.getElementById('image');
//     if (fileInput) {
//         fileInput.click();
//     }
// };

// // Define a ref to store the received user addresses from child
// const receivedUpdatedOrder = ref([]);

// // Handler function to receive the emitted user addresses from child
// const handleUpdateOrderDetails = (input) => {
//     receivedUpdatedOrder.value = input;
//     // addresserrorMessage.value = ''
//     console.log(receivedUpdatedOrder.value);
// };
// Define methods
const triggerOrderUpdate = () => {
    console.log('Triggering order update in parent component');
    // Perform your update logic here
};
</script>
<template>
    <div>
        <!--div to scroll to-->
        <div id="main"></div>
        <div class="h-1 w-1/6 mx-auto bg-zinc-800 mb-5 mt-5"></div>
        <p class="p-5 text-2xl">All Orders ({{ OrderItems.length }})</p>
        <div v-if="!loadingOrders" class="  text-left text-lg shadow-md w-full md:p-5 mx-auto">
            <div v-if="OrderItems.length != 0" class="flex md:table w-full mx-auto">
                <v-table height="fit" fixed-header density="default"
                    :theme="theme.global.current.value.dark ? 'dark' : 'light'">
                    <thead>
                        <tr>
                            <th class="text-left">
                                Order no.
                            </th>
                            <th class="text-left">
                                Order Details.
                            </th>
                            <th class="text-left">
                                Details
                            </th>
                            <th class="text-left">
                                Status
                            </th>
                            <th class="text-left">
                                At
                            </th>
                            <th>Track</th>
                        </tr>
                    </thead>
                    <tbody class="text-left">
                        <tr v-for="(order, index) in OrderItems" :key="index" class="h-20">
                            <td class="max-w-44 text-sm">{{ order.order_no }}</td>
                            <td class="max-w-40 text-sm">
                                <p v-for="(p, index) in order.order_details[0].items" :key="index"
                                    class="w-1 flex flex-col">
                                    {{ p.selectedOption ? p.selectedOption : 'no specific details' }}</p>
                            </td>
                            <td class="min-w-72">
                                <div class="flex w-full">
                                    <v-img :src="JSON.parse(order.order_details[0].items[0].product.image)[0]"
                                        class="my-auto" max-width="65" min-width="65" max-height="50" cover></v-img>
                                    <p class="ml-2 my-auto underline">{{ order.order_details[0].items[0].product.name
                                        }}
                                        (#{{ order.order_details[0].items[0].product.id }})
                                    </p>
                                </div>
                            </td>
                            <td class="min-w-40">{{ order.order_status[0].status }}</td>
                            <td class="min-w-32">{{ new Date(order.created_at).toLocaleString('en-US') }}</td>
                            <td>
                                <AdminOrderDialog :OrderItems="order" @trigger-update="triggerOrderUpdate" />
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
            <div v-else>No Orders yet</div>
        </div>
        <div v-else class="p-10">
            <p class="text-xl p-2"></p>
            <v-progress-circular color="dark-blue" indeterminate></v-progress-circular>
        </div>

        <!--editing Ad-->
        <div v-if="!loadingOrders" class="editP mt-10 p-2" id="editview">
            <!--success message-->
            <p v-if="updateSuccess" class="text-lg"><v-icon class="mx-1" color="green">mdi-check</v-icon>Ad details
                updated
                Successfully </p>
        </div>
        <div v-else class="p-10">
            <p class="text-xl p-2">Updating</p>
            <v-progress-circular color="dark-blue" indeterminate></v-progress-circular>
        </div>
    </div>
</template>