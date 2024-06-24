<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading1 = ref(false)
const loading2 = ref(false)

// Define reactive variables
const userOrders = ref([]);
const loadingOrders = ref(true)
// Fetch user's orders on component mount
onMounted(() => {
    fetchUserOrders();
})
const fetchUserOrders = async () => {
    const { data, error } = await supabase.auth.getSession()
    const id = data.session.user.id
    try {
        const { data, error } = await supabase
            .from('user_orders')
            .select('*')
            .eq('uid', id)

        if (error) {
            throw error;
        }
        if (data) {
            userOrders.value = [data]; // Store fetched orders in an array
            // editedAddress.value = userOrders.value; // Initialize editedAddress with user's address
            // console.log(userOrders.value[0][3].order_details[0].items);
            loadingOrders.value = false
        }
    } catch (error) {
        console.error('Error fetching user address:', error.message);
    }
}
// Function to view selected order
const viewOrder = (orderId) => {
    navigateTo('/user/orders/' + userOrders.value[0][orderId].order_ref)

}
</script>
<template>
    <div class="mb-20">
        <v-icon class="m-2" size="30">mdi-truck</v-icon>
        <h2 class="text-2xl font-bold mb-2">Manage Orders</h2>
        <v-btn to="orders" variant="tonal" elevation="1" max-height="30"
            class="mb-5 mt-2"><v-icon>mdi-chevron-right</v-icon>view all orders</v-btn>
        <div v-if="!loadingOrders" class="  text-left text-lg shadow-md w-full md:p-2 mx-auto">
            <div v-if="userOrders[0].length != 0" class="flex md:table mx-auto">
                <v-table height="fit" fixed-header density="default"
                    :theme="theme.global.current.value.dark ? 'dark' : 'light'">
                    <thead>
                        <tr>
                            <th class="text-left">
                                Order ID
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
                            <th>Track</th>
                        </tr>
                    </thead>
                    <tbody class="text-left">
                        <tr v-for="(order, index) in userOrders[0]" :key="index" class="h-28">
                            <td class="max-w-44 text-sm">{{ order.order_ref }}</td>
                            <!-- <td class="max-w-44 text-sm">{{ order.order_no }}</td> -->
                            <td class="max-w-40 text-sm"><p v-for="(p, index) in order.order_details[0].items" :key="index" class="w-1 flex flex-col">{{p.selectedOption?p.selectedOption:'no specific details'}}</p></td>
                            <td class="w-full">
                                <div class="flex min-w-60">
                                    <v-img :src="JSON.parse(order.order_details[0].items[0].product.image)[0]"
                                        class="my-auto" max-width="65" min-width="65" max-height="50" cover></v-img>
                                    <p class="ml-2 my-auto underline">{{ order.order_details[0].items[0].product.name
                                        }}
                                        (#{{ order.order_details[0].items[0].product.id }})
                                    </p>
                                </div>
                            </td>
                            <td class="">{{ order.order_status[0].status }}</td>
                            <td>
                                <v-btn @click="viewOrder(index)" variant="outlined" elevation="1" max-width="5"
                                    max-height="30">view</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
            <div v-else>No Orders available for this user.</div>
        </div>
        <div v-else>
            <div class="flex justify-center w-full">
                <div class=" shadow-sm">
                    <div class="flex w-full justify-center text-zinc-950 p-10"><v-progress-circular color="dark-blue"
                            indeterminate></v-progress-circular>
                    </div>
                </div>

            </div>
        </div>
        <!-- <div v-if="!editMode" class="add p-5">
            <v-btn @click="newaddresstrigger"><v-icon>mdi-plus</v-icon>Add New
                address</v-btn>
        </div> -->
    </div>
</template>