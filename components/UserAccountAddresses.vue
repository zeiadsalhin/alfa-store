<script setup>
import Swal from 'sweetalert2'
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading1 = ref(false)
const loading2 = ref(false)

// Define reactive variables
const userAddress = ref([]);
const usernewAddress = ref([]);
const editMode = ref(false);
const editedAddress = ref();
const newaddress = ref(false)
const loadingAddresses = ref(true)
// Fetch user's address on component mount
onMounted(() => {
    fetchAddresses();
})
const fetchAddresses = async () => {
    const { data, error } = await supabase.auth.getSession()
    const id = data.session.user.id
    try {
        const { data, error } = await supabase
            .from('user_address')
            .select('*')
            .eq('uid', id)

        if (error) {
            throw error;
        }
        if (data) {
            userAddress.value = [data]; // Store fetched address in an array
            editedAddress.value = userAddress.value; // Initialize editedAddress with user's address
            // console.log(userAddress.value);
            loadingAddresses.value = false
        }
    } catch (error) {
        console.error('Error fetching user address:', error.message);
    }
}
// Function to enter edit mode andadd new address, populate editedAddress with selected address
const newaddresstrigger = () => {
    newaddress.value = true
    editAddress()
}



// begin edit address
const id = ref();
const updateValue = (addressId) => {
    id.value = addressId;
    // console.log('id value', id.value);
    editAddress()
};
const editAddress = () => {
    editMode.value = true;

    if (newaddress.value == false) {
        userAddress.value = editedAddress.value[0][id.value];
        // userAddress.value = {  }
        // console.log('editing User address:', editedAddress.value[0][id.value]);
    } else {
        userAddress.value = []
        usernewAddress.value = userAddress.value;
        // console.log('una', usernewAddress.value);
    }
};

// Function to cancel edit mode and reset editedAddress
const cancelEdit = () => {
    editMode.value = false;
    editedAddress.value = []; // Reset editedAddress
    userAddress.value = []
    fetchAddresses()
};

// Function to save the edited, new addresses
const saveAddress = async () => {
    if (newaddress.value == false) {
        // console.log('uploading edited address');
        loading1.value = true

        const { data, error } = await supabase.auth.getSession();
        const userId = data.session.user.id;

        try {
            // Save the edited address to Supabase
            const { data2, error } = await supabase
                .from('user_address')
                .upsert([{ uid: userId, ...editedAddress.value[0][id.value] }]);
            // , { onConflict: ['uid'] }
            if (error) {
                throw error;
            }
            fetchAddresses()
            // console.log('Address saved:', data2);
        } catch (error) {
            console.error('Error saving address:', error.message);
        }

    } else {
        newaddress.value = false
        // console.log('uploading new address');
        loading1.value = true

        const { data, error } = await supabase.auth.getSession();
        const userId = data.session.user.id;

        try {
            // Save the new address to Supabase
            const { data2, error } = await supabase
                .from('user_address')
                .upsert([{ uid: userId, ...usernewAddress.value }]);
            // , { onConflict: ['uid'] }
            if (error) {
                throw error;
            }
            fetchAddresses()
            // console.log('address to add', usernewAddress.value);
            // console.log('Address saved:', data2);
        } catch (error) {
            console.error('Error saving address:', error.message);
        }
    }

    // Exit edit mode
    loading1.value = false
    editMode.value = false;
};

// delete address
// delete confirm
const DeleteAddressBegin = (addressId) => {
    id.value = addressId;
    Swal.fire({
        title: 'Warning!',
        icon: 'warning',
        text: 'This Address will be deleted!',
        showConfirmButton: true,
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            DeleteAddress();
        } else {
        }
    });
}

// Delete Address from database
const DeleteAddress = async () => {
    const supabase = useSupabaseClient()
    try {
        const { error } = await supabase
            .from('user_address')
            .delete()
            .eq('id', id.value)

        // console.log(userAddress.value)
        if (error) {
            console.log(error)
        } else {

            // const { error } = await supabase
            //     .storage
            //     .from('products_images')
            //     .remove([`${product.value.name}`]);
            // if (error) {
            //     console.log(error)
            // } else {
            // console.log('Deleted image');
            Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Address deleted successfully!',
                toast: true,
                timer: 2000,
                showConfirmButton: false,
            }).then(() => { fetchAddresses() })
            // }
        }

    } catch (error) {
        console.log(error)
    }
};
</script>
<template>
    <div class="mb-20">
        <v-icon class="m-2" size="30">mdi-home</v-icon>
        <h2 class="text-2xl font-bold mb-10">Manage Delivery Addresses</h2>

        <div v-if="editMode && editedAddress">
            <form id="form" class="space-y-5 p-5 w-11/12 md:w-11/12 h-fit text-center mx-auto justify-center flex-col"
                @submit.prevent="saveAddress">
                <!--input fields-->
                <div class="mainfields grid grid-flow-row auto-cols-auto gap-6">
                    <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                        class="text flex w-full ">
                        <label for="street" class="p-2 font-semibold text-lg text-left my-auto">Street<span
                                class="required text-red-600">*</span>:</label>
                        <input id="street" name="street" v-model="userAddress.street"
                            placeholder="Street name, address..." type="text" @focus="move" @blur="back"
                            class=" outline outline-1 outline-zinc-700 rounded-lg  px-2  text-black bg-transparent p-3 w-full"
                            :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                    </div>

                    <div class="2,3 grid grid-cols-2 grid-rows-1  gap-2">
                        <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                            class="text md:flex w-full text-left  mx-auto">
                            <label for="street" class="p-2 font-semibold text-lg my-auto">Building<span
                                    class="required text-red-600">*</span>:</label>
                            <input id="building" name="building" v-model="userAddress.building"
                                placeholder="Building no." type="text" @focus="move" @blur="back"
                                class=" outline outline-1 px-2 outline-zinc-700 rounded-lg text-black bg-transparent p-3 w-full"
                                :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                        </div>
                        <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                            class="text md:flex  w-full text-left mx-auto">
                            <label for="street" class="p-2 font-semibold text-lg my-auto">Apartment<span
                                    class="required text-red-600">*</span>:</label>
                            <input id="apartment" name="apartment" v-model="userAddress.apartment"
                                placeholder="Apartment, flat no." type="text" @focus="move" @blur="back"
                                class="outline outline-1 px-2 outline-zinc-700 rounded-lg  text-black bg-transparent p-3 w-full"
                                :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                        </div>
                    </div>

                    <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                        class="text md:flex   w-full text-left mx-auto">
                        <label for="street" class="p-2 font-semibold text-lg my-auto">Neighborhood<span
                                class="required text-red-600">*</span>:</label>
                        <input id="neighborhood" name="neighborhood" v-model="userAddress.neighborhood"
                            placeholder="Neighborhood or district" type="text" @focus="move" @blur="back"
                            class="outline outline-1 px-2 outline-zinc-700 rounded-lg  text-black  bg-transparent  p-3 w-full"
                            :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                    </div>
                    <div class="5,6,7 grid md:grid-cols-3 grid-rows-3 md:grid-rows-1  gap-4 w-full">
                        <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                            class="text  outline outline-1 px-2 outline-zinc-700 rounded-lg  w-full ">
                            <input id="city" name="city" v-model="userAddress.city" placeholder="City*" type="text"
                                @focus="move" @blur="back" class="text-black outline-none bg-transparent  p-3 w-full"
                                :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                        </div>
                        <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                            class="text  outline outline-1 px-2 outline-zinc-700 rounded-lg  w-full ">
                            <input id="state" name="state" v-model="userAddress.state" placeholder="State*" type="text"
                                @focus="move" @blur="back" class="text-black outline-none bg-transparent  p-3 w-full"
                                :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                        </div>
                        <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                            class="text  outline outline-1 px-2 outline-zinc-700 rounded-lg  w-full ">
                            <input id="postcode" name="postcode" v-model="userAddress.postalCode"
                                placeholder="Post code*" type="number" min="4" @focus="move" @blur="back"
                                class="text-black outline-none bg-transparent  p-3 w-full"
                                :class="theme.global.current.value.dark ? 'text-white' : 'text-black'" required>
                        </div>
                    </div>


                    <div :class="theme.global.current.value.dark ? ' text-white' : 'bg-zinc-100 text-black'"
                        class="text md:flex  w-full text-left mx-auto">
                        <label for="street" class="p-2 font-semibold text-lg my-auto">Country<span
                                class="required text-red-600">*</span>:</label>
                        <input id="country" name="country" v-model="userAddress.country" placeholder="Country"
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

        <div v-else>
            <div v-if="!loadingAddresses"
                class="md:grid grid-cols-2 gap-2 justify-center md:space-x-  text-left text-lg shadow-md w-fit p-5 mx-auto">
                <div v-if="userAddress" v-for="(address, index) in userAddress[0]" :key="index"
                    class=" mb-2 w-fit p-5 outline outline-zinc-700 shadow-lg">

                    <strong>Street:</strong> {{ address.street }} <br>
                    <strong>Building:</strong> {{ address.building }} <br>
                    <strong>Apartment:</strong> {{ address.apartment }} <br>
                    <strong>Neighborhood:</strong> {{ address.neighborhood }} <br>
                    <strong>City:</strong> {{ address.city }} <br>
                    <strong>State:</strong> {{ address.state }} <br>
                    <strong>Postal Code:</strong> {{ address.postalCode }} <br>
                    <strong>Country:</strong> {{ address.country }} <br>
                    <div class="grid grid-cols-2 grid-rows-2 w-11/12 mx-auto text-center justify-center space-x- mt-4">
                        <v-btn @click="updateValue(index)" class="m-1" min-height="40" max-width="100"
                            color="grey-lighten-2">Edit</v-btn>
                        <v-btn @click="DeleteAddressBegin(address.id)" class="m-1" min-height="40" max-width="100"
                            color="red-darken-2">Delete</v-btn>
                        <v-btn @click="" class="m-2 col-span-2 w-fuasll flaex justify-center" min-height="40"
                            max-width="200" variant="outlined">Set as
                            default</v-btn>
                    </div>
                </div>
                <div v-else>No address available for this user.</div>
            </div>
            <div v-else>
                <div class="flex justify-center w-full">
                    <div class=" shadow-sm">
                        <div class="flex w-full justify-center text-zinc-950 p-10"><v-progress-circular
                                color="dark-blue" indeterminate></v-progress-circular>
                        </div>
                    </div>

                </div>
            </div>
        </div>


        <div v-if="!editMode" class="add p-5">
            <v-btn @click="newaddresstrigger"><v-icon>mdi-plus</v-icon>Add New
                address</v-btn>
        </div>
    </div>
</template>