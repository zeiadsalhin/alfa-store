<script setup>
import axios from 'axios';
import { useTheme } from 'vuetify'
const theme = useTheme();
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
    const id = data?.session?.user.id ? data.session.user.id : 'guest-checkout_';
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

// phone format
const formatphone = () => {
    userNewAddress.value.phone = userNewAddress.value.phone.replace(/\D/g, '').slice(0, 11);
};
// Post code Format
const formatpostcode = () => {
    userNewAddress.value.postalCode = userNewAddress.value.postalCode.replace(/\D/g, '').slice(0, 8);
};
// country Format
const formatcountry = () => {
    userNewAddress.value.country = userNewAddress.value.country.replace(/[^A-Za-z]/g, '').slice(0, 8);;
};

// fetch cities 
const cities = ref()
async function fetchCities() {
    try {
        const response = await axios.get(`/eg_cities.json`);
        if (response.status === 200) {
            cities.value = (response.data)
                .sort((a, b) => {
                    // Accessing the common name of each country object
                    const commonA = a.city_name_en.toUpperCase(); // Convert to uppercase for case-insensitive sorting
                    const commonB = b.city_name_en.toUpperCase();
                    // Use localeCompare for string comparison
                    return commonA.localeCompare(commonB);
                });
            // console.log(cities.value);
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (err) {
        console.log(err);
        cities.value = null;
    }
}
// fetch Governorates 
const states = ref()
async function fetchStates() {
    try {
        const response = await axios.get(`/eg_governorates.json`);
        if (response.status === 200) {
            states.value = (response.data)
                .sort((a, b) => {
                    // Accessing the common name of each country object
                    const commonA = a.governorate_name_en.toUpperCase(); // Convert to uppercase for case-insensitive sorting
                    const commonB = b.governorate_name_en.toUpperCase();
                    // Use localeCompare for string comparison
                    return commonA.localeCompare(commonB);
                });
            // console.log(cities.value);
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (err) {
        console.log(err);
        states.value = null;
    }
}

// save the new address
const saveNewAddress = async () => {
    if (!userNewAddress.value.name || !userNewAddress.value.phone || !userNewAddress.value.email || !userNewAddress.value.apartment || !userNewAddress.value.building || !userNewAddress.value.neighborhood || !userNewAddress.value.street || !userNewAddress.value.city || !userNewAddress.value.state || !userNewAddress.value.postalCode || !userNewAddress.value.country) {
        // errorMessage.value = 'Please fill out all fields.'
        return;
    }

    try {
        const { data, error } = await supabase.auth.getSession()
        const id = data?.session?.user.id ? data.session.user.id : 'guest-checkout_'
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
        <div class="newAddress ml-3">
            <v-btn @click="expanded = !expanded" variant="outlined" class="">
                <v-icon>{{ expanded ? 'mdi-minus' : 'mdi-plus' }}</v-icon>Add New Address
            </v-btn>
            <v-expand-transition>
                <v-form lazy-validation id="form" class="mt-10 mb-10" @submit.prevent="saveNewAddress" v-if="expanded">
                    <!-- <p v-if="errorMessage" class="error bg-red-700 text-white p-1">{{ errorMessage }}</p> -->
                    <p class="font-weight-bold p-2">Contact details</p>
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.name" :rules="rules" outlined label="Full name*"
                                type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.phone" :rules="rules" outlined @input="formatphone"
                                label="Phone number*" type="tel"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.email" :rules="rules" outlined label="Email*"
                                type="email"></v-text-field>
                        </v-col>
                    </v-row>
                    <p class="font-weight-bold p-2">Delivery Address</p>
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.apartment" :rules="rules" outlined label="Apartment*"
                                type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.building" :rules="rules" outlined label="Building*"
                                type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.neighborhood" :rules="rules" outlined
                                label="Neighborhood" type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.street" :rules="rules" outlined label="Street*"
                                type="text"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select variant="outlined" id="city" name="city" :items="cities" @click="fetchCities"
                                :item-title="'city_name_en'" :item-value="'city_name_en'" label="Select a city*"
                                item-text="city_name_en" placeholder="City*" type="text" v-model="userNewAddress.city"
                                class="text-blac outline-none bg-transparent my-auto  p- w-full"
                                :theme="theme.global.current.value.dark ? 'dark' : 'light'" :required='true'></v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select variant="outlined" id="state" name="state" :items="states" @click="fetchStates"
                                :item-title="'governorate_name_en'" :item-value="'governorate_name_en'"
                                label="Select a governorate*" item-text="governorate_name_en" placeholder="State*"
                                type="text" v-model="userNewAddress.state"
                                class="text-blac outline-none bg-transparent my-auto  p- w-full"
                                :theme="theme.global.current.value.dark ? 'dark' : 'light'" :required='true'></v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="userNewAddress.postalCode" :rules="rules" outlined
                                @input="formatpostcode" label="Postal code*" type="tel"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select variant="outlined" id="country" name="country" :items="['Egypt']"
                                :item-value="'Egypt'" label="Select a Country*" placeholder="Country*" type="text"
                                v-model="userNewAddress.country"
                                class="text-blac outline-none bg-transparent my-auto  p- w-full"
                                :theme="theme.global.current.value.dark ? 'dark' : 'light'" :required='true'></v-select>
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
                <p v-if="userAddress[0]?.length != 0 && notguest" class="h1 text-lg py-1"><v-icon class="mb-1 mr-2"
                        size="20">mdi-map-marker</v-icon>Or Select an address:
                </p>
                <div v-for="address in userAddress[0]" :key="address.id"
                    class="font-semibold text-lg outline outline-1 outline-zinc-500  px-2 my-4 rounded-md "
                    :class="{ 'outline-4': selectedAddress === address }">
                    <v-radio-group v-model="selectedAddress" @change="emitUserAddresses(selectedAddress)" class="py-2">
                        <v-radio :id="'address_' + address.id" :value="address"
                            :label="address?.name + ' ' + address?.phone + ', ' + address.apartment + ', ' + 'bldg.' + ' ' + address.building + ' ' + 'neighborhood.' + ' ' + address.neighborhood + ', ' + address.street + ', ' + address.city + ', ' + address.country + ', ' + address.postalCode">
                        </v-radio>
                    </v-radio-group>
                </div>
                <div v-if="selectedAddress" class="p-3">
                    <p class="text-lg font-semibold">Selected Address:</p>
                    <p>{{ selectedAddress?.name }}</p>
                    <p> {{ selectedAddress?.phone }}</p>
                    <p> {{ selectedAddress?.email }}</p>
                    <p> apt.{{ selectedAddress.apartment }},
                        bldg.{{ selectedAddress.building }}, {{ selectedAddress.neighborhood }},
                        {{ selectedAddress.street }}
                    </p>
                    <p>City: {{ selectedAddress.city }}, {{ selectedAddress.state }}</p>
                    <p>Location: {{ selectedAddress.country }},{{ selectedAddress.postalCode }}</p>
                </div>
            </div>
        </div>
    </div>
</template>