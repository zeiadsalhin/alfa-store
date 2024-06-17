<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading1 = ref(false)
const loading2 = ref(false)

// Define reactive variables
const userAddress = ref([]);
const editMode = ref(false);
const editedAddress = ref({});

// Fetch user's address on component mount
onMounted(() => {
    fetchAddresses();
})
const fetchAddresses = async () => {
    try {
        const { data, error } = await supabase
            .from('user_address')
            .select('*')
            .single();

        if (error) {
            throw error;
        }

        if (data) {
            userAddress.value = [data]; // Store fetched address in an array
            editedAddress.value = { ...userAddress.value[0] }; // Initialize editedAddress with user's address
        }
    } catch (error) {
        console.error('Error fetching user address:', error.message);
    }
}
// Function to enter edit mode and populate editedAddress with selected address
const editAddress = () => {
    editMode.value = true;
    editedAddress.value = { ...userAddress.value[0] }; // Copy the address to editedAddress
};

// Function to cancel edit mode and reset editedAddress
const cancelEdit = () => {
    editMode.value = false;
    editedAddress.value = {}; // Reset editedAddress
};

// Function to save the edited address
const saveAddress = async () => {
    loading1.value = true

    const { data, error } = await supabase.auth.getSession();
    const userId = data.session.user.id;

    // Update user's address with editedAddress
    userAddress.address = { ...editedAddress.value };

    try {
        // Save the edited address to Supabase
        const { data2, error } = await supabase
            .from('user_address')
            .upsert([{ uid: userId, ...editedAddress.value }], { onConflict: ['uid'] });

        if (error) {
            throw error;
        }
        fetchAddresses()
        // console.log('Address saved:', data2);
    } catch (error) {
        console.error('Error saving address:', error.message);
    }
    // Exit edit mode
    loading1.value = false
    editMode.value = false;
};
</script>
<template>
    <div class="mb-20">
        <h2 class="text-2xl font-semibold mb-10">Manage Addresses</h2>

        <div v-if="editMode">
            <form id="form" class="space-y-5 p-5 w-11/12 md:w-11/12 h-fit text-center mx-auto justify-center flex-col"
                @submit.prevent="saveAddress">
                <!--input fields-->
                <div class="mainfields grid grid-flow-row auto-cols-auto gap-6">
                    <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                        class="text flex w-full ">
                        <label for="street" class="p-2 font-semibold text-lg text-left my-auto">Street<span
                                class="required text-red-600">*</span>:</label>
                        <input id="street" name="street" v-model="editedAddress.street"
                            placeholder="Street name, address..." type="text" @focus="move" @blur="back"
                            class=" outline outline-1 outline-zinc-700 rounded-lg  px-2  text-black bg-transparent p-3 w-full"
                            :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                    </div>

                    <div class="2,3 grid grid-cols-2 grid-rows-1  gap-2">
                        <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                            class="text md:flex w-full text-left  mx-auto">
                            <label for="street" class="p-2 font-semibold text-lg my-auto">Building<span
                                    class="required text-red-600">*</span>:</label>
                            <input id="building" name="building" v-model="editedAddress.building"
                                placeholder="Building no." type="text" @focus="move" @blur="back"
                                class=" outline outline-1 px-2 outline-zinc-700 rounded-lg text-black bg-transparent p-3 w-full"
                                :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                        </div>
                        <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                            class="text md:flex  w-full text-left mx-auto">
                            <label for="street" class="p-2 font-semibold text-lg my-auto">Apartment<span
                                    class="required text-red-600">*</span>:</label>
                            <input id="apartment" name="apartment" v-model="editedAddress.apartment"
                                placeholder="Apartment, flat no." type="text" @focus="move" @blur="back"
                                class="outline outline-1 px-2 outline-zinc-700 rounded-lg  text-black bg-transparent p-3 w-full"
                                :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                        </div>
                    </div>

                    <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                        class="text md:flex   w-full text-left mx-auto">
                        <label for="street" class="p-2 font-semibold text-lg my-auto">Neighborhood<span
                                class="required text-red-600">*</span>:</label>
                        <input id="neighborhood" name="neighborhood" v-model="editedAddress.neighborhood"
                            placeholder="Neighborhood or district" type="text" @focus="move" @blur="back"
                            class="outline outline-1 px-2 outline-zinc-700 rounded-lg  text-black  bg-transparent  p-3 w-full"
                            :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                    </div>
                    <div class="5,6,7 grid md:grid-cols-3 grid-rows-3 md:grid-rows-1  gap-4 w-full">
                        <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                            class="text  outline outline-1 px-2 outline-zinc-700 rounded-lg  w-full ">
                            <input id="city" name="city" v-model="editedAddress.city" placeholder="City*" type="text"
                                @focus="move" @blur="back" class="text-black outline-none bg-transparent  p-3 w-full"
                                :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                        </div>
                        <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                            class="text  outline outline-1 px-2 outline-zinc-700 rounded-lg  w-full ">
                            <input id="state" name="state" v-model="editedAddress.state" placeholder="State*"
                                type="text" @focus="move" @blur="back"
                                class="text-black outline-none bg-transparent  p-3 w-full"
                                :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                        </div>
                        <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                            class="text  outline outline-1 px-2 outline-zinc-700 rounded-lg  w-full ">
                            <input id="postcode" name="postcode" v-model="editedAddress.postalCode"
                                placeholder="Post code*" type="number" min="4" @focus="move" @blur="back"
                                class="text-black outline-none bg-transparent  p-3 w-full"
                                :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                        </div>
                    </div>


                    <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                        class="text md:flex  w-full text-left mx-auto">
                        <label for="street" class="p-2 font-semibold text-lg my-auto">Country<span
                                class="required text-red-600">*</span>:</label>
                        <input id="country" name="country" v-model="editedAddress.country" placeholder="Country"
                            type="text" @focus="move" @blur="back"
                            class="outline outline-1 px-2 outline-zinc-700 rounded-lg  text-black outline-none bg-transparent text-lg p-3 w-full"
                            :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                    </div>
                </div>
                <!--Submit button-->
                <v-btn @click="" type="submit" min-width="150" min-height="40" color="green-lighten-1" elevation="1"
                    :disabled="false" variant="outlined"
                    :class="theme.global.current.value.dark ? ' text-white' : ' hover:bg-green-1a00 text-white hover:text-gray-5s0'"
                    class="m-5 text-lg rounded-md hover:cursor-pointer">
                    <v-progress-circular v-if="loading1" width="2" size="20" color="darken-blue-4" class="m-1"
                        indeterminate></v-progress-circular>
                    Save
                </v-btn>
                <v-btn @click="cancelEdit" type="button" min-width="150" min-height="40" color="red-lighten-1"
                    elevation="1" variant="tonal"
                    :class="theme.global.current.value.dark ? ' text-white' : ' hover:bg-red-100 text-white hover:text-gray-50'"
                    class="m-5 text-lg rounded-md hover:cursor-pointer">
                    <v-progress-circular v-if="loading2" width="2" size="20" color="darken-blue-4" class="m-1"
                        indeterminate></v-progress-circular>
                    cancel
                </v-btn>
            </form>
        </div>

        <div v-else class="flex justify-center space-x-4 text-left text-lg shadow-md w-full p-5 mx-auto">
            <div v-if="userAddress" v-for="(address, index) in userAddress" :key="index"
                class="space-y-5 w-fit p-5 outline outline-zinc-700 shadow-md">
                <strong>Street:</strong> {{ address.street }} <br>
                <strong>Building:</strong> {{ address.building }} <br>
                <strong>Apartment:</strong> {{ address.apartment }} <br>
                <strong>Neighborhood:</strong> {{ address.neighborhood }} <br>
                <strong>City:</strong> {{ address.city }} <br>
                <strong>State:</strong> {{ address.state }} <br>
                <strong>Postal Code:</strong> {{ address.postalCode }} <br>
                <strong>Country:</strong> {{ address.country }} <br>
                <v-btn @click="editAddress" class="ma-5 flex w-1/3 justify-center" min-height="40" min-width="150"
                    color="grey-lighten-2">Edit</v-btn>
            </div>
            <div v-else>No address available for this user.</div>
        </div>

        <div v-if="!editMode" class="add p-5">
            <v-btn><v-icon>mdi-plus</v-icon>Add New address</v-btn>
        </div>
    </div>
</template>