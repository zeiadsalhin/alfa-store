<script setup>
const supabase = useSupabaseClient()
//data
const userNewAddress = ref({});
const expanded = ref(false);
const userAddress = ref([]);
const selectedAddress = ref();
const rules = [
    (value) => {
        if (value) return true;
        return 'required';
    },
];

// pass address to checkout
// Define emits to emit events to parent
const emits = defineEmits(['selected-address']); // Define the events emitted by the child component
// Function to emit user addresses to the parent
function emitUserAddresses(input) {
    emits('selected-address', input);
    // console.log(selectedAddress.value);
};

// fetch user addresses
onMounted(() => {
    fetchAddresses();
})
const notguest = ref(false);
const fetchAddresses = async () => {
    const { data, error } = await supabase.auth.getSession()
    if (data.session.user) {
        const id = data.session.user.id
        notguest.value = true
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
                // console.log(userAddress.value);
                // loadingAddresses.value = false
            }

        } catch (error) {
            console.error('Error fetching user address:', error.message);
        }
    }
}

// Post code Format
const formatpostcode = () => {
    userNewAddress.value.postalCode = userNewAddress.value.postalCode.replace(/\D/g, '').slice(0, 8);;
};
// country Format
const formatcountry = () => {
    userNewAddress.value.country = userNewAddress.value.country.replace(/[^A-Za-z]/g, '').slice(0, 8);;
};

// save the new address
const saveNewAddress = async () => {
    if (!userNewAddress.value.apartment || !userNewAddress.value.building || !userNewAddress.value.neighborhood || !userNewAddress.value.street || !userNewAddress.value.city || !userNewAddress.value.state || !userNewAddress.value.postalCode || !userNewAddress.value.country) {
        // errorMessage.value = 'Please fill out all fields.'
        return;
    }
    const { data, error } = await supabase.auth.getSession()
    const id = data.session.user.id
    try {
        // Insert address details into database
        const { error: insertError } = await supabase
            .from('user_address')
            .upsert([{ uid: id, ...userNewAddress.value }])

        if (insertError) {
            throw insertError;
        }
        console.log('Address added successfully');
        // console.log(userNewAddress.value);
        document.getElementById('form').reset() // Function to reset form fields
        expanded.value = false
        fetchAddresses();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } catch (error) {
        console.error('Error inserting Address:', error.message);
    }
};
</script>
<template>
    <div>
        <div class="mb-3">
            <div class="h1 text-3xl py-5">
                <h1>Shipping Address</h1>
            </div>
        </div>
        <div class="newAddress">
            <v-btn @click="expanded = !expanded" variant="outlined" class="">
                <v-icon>{{ expanded ? 'mdi-minus' : 'mdi-plus' }}</v-icon>Add New Address
            </v-btn>
            <v-expand-transition>
                <v-form lazy-validation id="form" class="mt-10 mb-10" @submit.prevent="saveNewAddress" v-if="expanded">
                    <!-- <p v-if="errorMessage" class="error bg-red-700 text-white p-1">{{ errorMessage }}</p> -->
                    <p class="font-weight-bold p-2">Delivery Address</p>
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.apartment" :rules="rules" outlined label="Apartment"
                                type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.building" :rules="rules" outlined label="Building"
                                type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.neighborhood" :rules="rules" outlined
                                label="Neighborhood" type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.street" :rules="rules" outlined label="Street"
                                type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.city" :rules="rules" outlined label="City"
                                type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.state" :rules="rules" outlined label="Governorate"
                                type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.postalCode" :rules="rules" outlined
                                @input="formatpostcode" label="Postal code" type="tel"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.country" :rules="rules" outlined label="Country"
                                @input="formatcountry" type="text"></v-text-field>
                        </v-col>
                    </v-row>
                    <div class="buttons flex justify-start ">
                        <v-btn type="submit" min-height="40" min-width="120" class="m-2 x-auto" color=""
                            variant="tonal">Add</v-btn>
                        <v-btn name="cancelbutton" @click="expanded = !expanded" min-height="40" min-width="120"
                            class="m-2 x-auto" color="red-darken-1" variant="outlined">Cancel</v-btn>
                    </div>
                </v-form>
            </v-expand-transition>
        </div>
        <div v-if="!expanded" class="Use existing Address p-1 mt-2    ">
            <div>
                <p v-if="userAddress[0]?.length != 0 && notguest" class="h1 text-lg py-1">Or Select an address:</p>
                <div v-for="address in userAddress[0]" :key="address.id"
                    class="font-semibold text-lg outline outline-1 outline-zinc-500  p-3 my-4 rounded-md "
                    :class="{ 'outline-4': selectedAddress === address }">
                    <v-radio-group v-model="selectedAddress" @change="emitUserAddresses(selectedAddress)">
                        <v-radio :id="'address_' + address.id" :value="address"
                            :label="address.apartment + ' ' + 'bldg.' + ' ' + address.building + ' ' + 'neighborhood.' + ' ' + address.neighborhood + ' ' + address.street + ' ' + address.city + ' ' + address.country + ' ' + address.postalCode">
                        </v-radio>
                    </v-radio-group>
                </div>
                <div v-if="selectedAddress" class="p-3">
                    <p class="text-lg font-semibold">Selected Address:</p>
                    <p>apt.{{ selectedAddress.apartment }}, bldg.{{ selectedAddress.building }}, {{
                        selectedAddress.neighborhood }}, {{ selectedAddress.street }}
                    </p>
                    <p>City: {{ selectedAddress.city }}, {{ selectedAddress.state }}</p>
                    <p>Location: {{ selectedAddress.country }},{{ selectedAddress.postalCode }}</p>
                </div>
            </div>
        </div>
    </div>
</template>