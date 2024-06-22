<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false);
const tabledata = ref(false);
const updateSuccess = ref(false);
const productItems = ref({});
const productUpdate = ref({});
const tags = ['electronics', 'smart watches', 'headphones', 'chargers']
const expanded = ref(false)
// Fetch Products 
onMounted(() => {
    Fetchproductdata();
});
const Fetchproductdata = async () => {

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    try {
        const { data, error } = await supabase.from('Products').select('*');

        // console.log('Products:', data);
        productItems.value = data
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
//handle multiple images
// const handleImageUpload = async (event) => {
//     const files = event.target.files;
//     const uploadedFiles = [];

//     for (let i = 0; i < files.length; i++) {
//         uploadedFiles.push(files[i]);
//     }

//     productUpdate.value.image = uploadedFiles;
//     console.log('image:', productUpdate.value.image);
// };
// trigger edit product
const trigger = async (idvalue) => {
    try {
        productUpdate.value = { ...productItems.value[idvalue] }
        if (productUpdate.value) {
            expanded.value = true;
            const view = document.getElementById('editview');
            view.scrollIntoView({ behavior: 'smooth' });
        } else {
            expanded.value = false;
        }
        // console.log('triggered');
        // console.log('product to edit: ', productUpdate.value.image);
    } catch { }
}

// update database
const UpdateProduct = async () => {
    loading.value = true
    const { data, error } = await supabase.auth.getSession()
    const userId = data.session.user.id
    try {
        // Save the edited product to Supabase

        // 1 edit the image 
        // if (productUpdate.value.image.length != 0) {
        //     console.log('uploaded files found');
        //     const uploadPromises = productUpdate.value.image.map(async (file) => {
        //         const { data: uploadData, error: uploadError } = await supabase.storage
        //             .from('products_images')
        //             .upload(`${productUpdate.value.name}/${file.name}`, file, {
        //                 cacheControl: '3600',
        //                 upsert: true
        //             });

        //         if (uploadError) {
        //             throw uploadError;
        //         }

        //         // Get public URL for each uploaded image
        //         const { data: publicUrlData, error: publicUrlError } = await supabase.storage
        //             .from('products_images')
        //             .getPublicUrl(`${productUpdate.value.name}/${file.name}`);

        //         if (publicUrlError) {
        //             throw publicUrlError;
        //         }

        //         return publicUrlData.publicUrl;
        //     });

        //     // Wait for all uploads to complete
        //     const imageUrls = await Promise.all(uploadPromises);
        // }
        const { data2, error } = await supabase
            .from('Products')
            .upsert([{ ...productUpdate.value }]
                // image: imageUrls,
                , { onConflict: ['id'] })
        if (error) {
            throw error;
        } else {
            expanded.value = false;
            updateSuccess.value = true;
            Fetchproductdata();
            //scroll to div
            const view = document.getElementById('main');
            view.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                updateSuccess.value = false;
            }, 3000);
        }
        // console.log('Address saved:', data2);
    } catch (error) {
        console.error('Error saving product:', error.message);
    }
    loading.value = false
}

// delete product


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
        <div class="h-1 w-1/6 mx-auto bg-zinc-800 mb-5 mt-10"></div>
        <p class="p-5 text-2xl">All Products ({{ productItems.length }})</p>
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
                    <tr v-for="(item, index) in productItems" :key="index">
                        <td class="">{{ item.name }}</td>
                        <td><v-img :src="JSON.parse(item.image)[0]" class="m-5" max-width="200" min-width="70"></v-img>
                        </td>
                        <td><v-btn @click="trigger(index)" variant="outlined" elevation="3" max-width="10"
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
        <!--scroll to this div-->
        <div id="editview"></div>
        <!--editing product-->
        <div v-if="!loading" class="editP mt-10 p-2">
            <!--success message-->
            <p v-if="updateSuccess" class="text-lg"><v-icon class="mx-1" color="green">mdi-check</v-icon>Product updated
                Successfully </p>
            <v-expand-transition>
                <div v-if="expanded">
                    <p class="p-5 text-2xl">Edit product: {{ productUpdate.name }}</p>
                    <form @submit.prevent="UpdateProduct" class="w-full space-y-3">
                        <div class="w-full flex space-x-5">
                            <label for="name" class="text-xl my-auto flex">
                                <p class="px-2 mr-3 rounded-full bg-zinc-800 text-white">1</p>Name<span
                                    class="required text-red-600">*</span>:
                            </label>
                            <input
                                :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-300 text-zinc-950'"
                                class="px-2 py-1 m-2 rounded-sm w-11/12" type="text" id="name"
                                v-model="productUpdate.name" required>
                        </div>
                        <div class="w-full flex space-x-7">
                            <label for="price" class="text-xl my-auto flex">
                                <p class="px-2 mr-3 rounded-full bg-zinc-800 text-white">2</p>Price<span
                                    class="required text-red-600">*</span>:
                            </label>
                            <input
                                :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-300 text-zinc-950'"
                                class="px-2 py-1 m-2 rounded-sm w-11/12" type="number" step="any" id="price"
                                v-model="productUpdate.price" required>
                        </div>
                        <div class="w-full flex space-x-5">
                            <label for="price" class="text-xl my-auto flex">
                                <p class="px-2 my-auto mr-3 rounded-full bg-zinc-800 text-white">3</p>Discounted
                                Price:
                            </label>
                            <input
                                :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-300 text-zinc-950'"
                                class="px-2 py-1 m-2 rounded-sm w-11/12" type="number" step="any" id="discount_price"
                                v-model="productUpdate.discount_price">
                        </div>
                        <div class="w-full mt-5">
                            <label for="price" class="text-xl my-auto flex">
                                <p class="px-2 mr-3 rounded-full bg-zinc-800 text-white">4</p>Description<span
                                    class="required text-red-600">*</span>:
                            </label>
                            <textarea rows="10" cols="3"
                                :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-300 text-zinc-950'"
                                class="p-1 text-md my-3 rounded-sm w-full" type="text" id="price"
                                v-model="productUpdate.description" required></textarea>
                        </div>
                        <div class="w-fit flex md:space-x-14 space-x-5 mt-5">
                            <label for="productUpdateImage" class="text-xl my-auto flex">
                                <p class="px-2 mr-3 rounded-full bg-zinc-800 text-white">5</p>Image<span
                                    class="required text-red-600">*</span>:
                            </label>
                            <div class="image update">
                                <v-img v-if="productUpdate.image" v-for="(img, i) in JSON.parse(productUpdate.image)"
                                    :key="i" :src="img" class="m-5" max-width="200" min-width="70"></v-img>
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
                        <div class="flex w-fit space-x-7 mt-5">
                            <label for="category" class="text-xl my-auto flex">
                                <p class="px-2 mr-3 rounded-full bg-zinc-800 text-white">6</p>Category<span
                                    class="required text-red-600">*</span>:
                            </label>
                            <v-select v-model="productUpdate.tags" :items="tags" hint="Choose productUpdate category"
                                label="Select productUpdate tags" multiple persistent-hint :required="true"></v-select>
                        </div>
                        <div class="flex w-fit space-x-12 mt-5">
                            <label for="stock" class="text-xl my-auto flex">
                                <p class="px-2 mr-2 rounded-full bg-zinc-800 text-white">7</p>Stock<span
                                    class="required text-red-600">*</span>:
                            </label>
                            <v-radio-group v-model="productUpdate.stock" column>
                                <v-radio color="red" label="Out of Stock" :value="false"></v-radio>
                                <v-radio color="green" label="In Stock" :value="true"></v-radio>
                            </v-radio-group>

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