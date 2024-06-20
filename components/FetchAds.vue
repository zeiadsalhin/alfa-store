<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false);
const tabledata = ref(false);
const updateSuccess = ref(false);
const Adsitems = ref({});
const adUpdate = ref({});
const expanded = ref(false);
// Fetch Ads 
onMounted(() => {
    FetchAdsdata();
});
const FetchAdsdata = async () => {

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    try {
        const { data, error } = await supabase.from('Ads').select('*');

        // console.log('Products:', data);
        Adsitems.value = data
        // console.log(data);
        tabledata.value = true

    } catch (error) {
        console.error('Error fetching Ads:', error.message);
    }
}
// Function to open image input
const openFileInput = () => {
    const fileInput = document.getElementById('image');
    if (fileInput) {
        fileInput.click();
    }
};
// trigger edit Add
const triggerAd = async (index) => {
    try {
        adUpdate.value = { ...Adsitems.value[index] }
        if (adUpdate.value) {
            expanded.value = true;
            const view = document.getElementById('editview');
            // view.scrollIntoView({ behavior: 'smooth' });
        } else {
            expanded.value = false;
        }
        // console.log('triggered');
        // console.log('product to edit: ', adUpdate.value);
    } catch (error) {
        throw error
    }
}

// update database
const UpdateAd = async () => {
    loading.value = true
    // const { data, error } = await supabase.auth.getSession()
    // const userId = data.session.user.id
    try {
        // Save the edited address to Supabase
        const { data2, error } = await supabase
            .from('Ads')
            .upsert([{ ...adUpdate.value }]
                , { onConflict: ['id'] })
        if (error) {
            throw error;
        } else {
            expanded.value = false;
            updateSuccess.value = true;
            FetchAdsdata();
            //scroll to div
            const view = document.getElementById('main');
            view.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                updateSuccess.value = false;
            }, 3000);
        }
        // console.log('Address saved:', data2);
    } catch (error) {
        console.error('Error saving Ad:', error.message);
    }
    loading.value = false
}

// cancel edit 
const cancelEdit = () => {
    expanded.value = false;
    //scroll back to main
    const view = document.getElementById('main');
    view.scrollIntoView({ behavior: 'smooth' });
}
</script>
<template>
    <div>
        <!--div to scroll to-->
        <div id="main"></div>
        <div class="h-1 w-1/6 mx-auto bg-zinc-800 mb-5 mt-5"></div>
        <p class="p-5 text-2xl">All Ad Banners ({{ Adsitems.length }})</p>
        <div v-if="tabledata" class="flex md:table w-full mx-auto">
            <v-table height="400px" fixed-header density="default"
                :theme="theme.global.current.value.dark ? 'dark' : 'light'">
                <thead>
                    <tr>
                        <th class="text-left">
                            Name
                        </th>
                        <th class="text-center">
                            Ad image
                        </th>
                        <th>Manage</th>
                    </tr>
                </thead>
                <tbody class="text-left">
                    <tr v-for="(item, index) in Adsitems" :key="index">
                        <td class="">{{ item.name }}</td>
                        <td><v-img :src="JSON.parse(item.image)[0]" class="m-5" max-width="300" min-width="100"></v-img>
                        </td>
                        <td><v-btn @click="triggerAd(index)" variant="outlined" elevation="3" max-width="10"
                                max-height="30">Edit</v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </div>
        <div v-else class="p-10">
            <p class="text-xl p-2"></p>
            <v-progress-circular color="dark-blue" indeterminate></v-progress-circular>
        </div>

        <!--editing Ad-->
        <div v-if="!loading" class="editP mt-10 p-2" id="editview">
            <!--success message-->
            <p v-if="updateSuccess" class="text-lg"><v-icon class="mx-1" color="green">mdi-check</v-icon>Ad details
                updated
                Successfully </p>
            <v-expand-transition>
                <div v-if="expanded">
                    <p class="p-5 text-2xl">Edit Ad: {{ adUpdate.name }}</p>
                    <form @submit.prevent="UpdateAd" class="w-full space-y-3">
                        <div class="w-full flex space-x-5">
                            <label for="name" class="text-xl my-auto flex">
                                <p class="px-2 mr-3 rounded-full bg-zinc-800 text-white">1</p>Name<span
                                    class="required text-red-600">*</span>:
                            </label>
                            <input
                                :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-300 text-zinc-950'"
                                class="px-2 py-1 m-2 rounded-sm w-11/12" type="text" id="name" v-model="adUpdate.name"
                                required>
                        </div>
                        <div class="w-fit flex md:space-x-14 space-x-5 mt-5">
                            <label for="adUpdateImage" class="text-xl my-auto flex">
                                <p class="px-2 mr-3 rounded-full bg-zinc-800 text-white">5</p>Image<span
                                    class="required text-red-600">*</span>:
                            </label>
                            <div class="image update">
                                <v-img v-if="adUpdate.image" v-for="(img, i) in JSON.parse(adUpdate.image)" :key="i"
                                    :src="img" class="m-5" max-width="200" min-width="70"></v-img>
                                <div v-else class="p-5">
                                    <v-progress-circular color="dark-blue" indeterminate></v-progress-circular>
                                </div>
                                <input class="text-current w-full hidden" type="file" id="image" accept="image/*"
                                    multiple @change="handleImageUpload" />
                                <v-btn @click="openFileInput"><v-icon size="20"
                                        class="mx-1">mdi-tray-arrow-up</v-icon>Upload
                                    Image</v-btn>
                            </div>
                        </div>
                        <div class="buttons flex justify-center space-x-3">
                            <v-btn type="submit" min-height="40" min-width="120" class="" color="black">Update</v-btn>
                            <v-btn @click="cancelEdit" type="button" min-height="40" min-width="120" class=""
                                variant="tonal">Cancel</v-btn>
                        </div>
                    </form>
                </div>
            </v-expand-transition>
        </div>
        <div v-else class="p-10">
            <p class="text-xl p-2">Updating</p>
            <v-progress-circular color="dark-blue" indeterminate></v-progress-circular>
        </div>
    </div>
</template>