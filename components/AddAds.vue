<script setup>
import Swal from 'sweetalert2'
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const expanded = ref(false)
const product = ref({
    name: '',
    // stock: null,
    images: [],
});
// Add product
const handleImageUpload = async (event) => {
    const files = event.target.files;
    const uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
        uploadedFiles.push(files[i]);
    }

    product.value.images = uploadedFiles;
};

const InsertProduct = async () => {
    try {
        if (product.value.images.length === 0) {
            return Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Please upload at least one image',
                toast: true,
                timer: 2000,
                showConfirmButton: false,
            });
        }

        Swal.fire({
            title: 'Uploading',
            icon: 'info',
            text: 'Uploading Ad',
            toast: true,
            timer: 10000,
            showConfirmButton: false,
        });

        const uploadPromises = product.value.images.map(async (file) => {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('products_images')
                .upload(`Ad-${product.value.name}/${file.name}`, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL for each uploaded image
            const { data: publicUrlData, error: publicUrlError } = await supabase.storage
                .from('products_images')
                .getPublicUrl(`Ad-${product.value.name}/${file.name}`);

            if (publicUrlError) {
                throw publicUrlError;
            }

            return publicUrlData.publicUrl;
        });

        // Wait for all uploads to complete
        const imageUrls = await Promise.all(uploadPromises);

        // Insert product details into database
        const { error: insertError } = await supabase.from('Ads').insert({
            name: product.value.name,
            image: imageUrls, // Store array of image URLs in the database
            // stock: product.value.stock,
        });

        if (insertError) {
            throw insertError;
        }

        // Reset form and show success message
        Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Ad added successfully!',
            toast: true,
            timer: 3000,
            showConfirmButton: false,
        });

        console.log('Ad added successfully');
        resetForm(); // Function to reset form fields
    } catch (error) {
        console.error('Error inserting Ad:', error.message);

        Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Error uploading the Ad',
            toast: true,
            timer: 2000,
            showConfirmButton: false,
        });
    }
};

const resetForm = () => {
    product.value.name = '';
    product.value.images = [];
    // product.value.stock = null;
    document.querySelector("#image").value = '';
};


</script>
<template>
    <div>
        <div class="Title flex-col">
            <v-icon size="30">mdi-advertisements</v-icon>
            <h1 class="text-3xl p-3">Manage Ads Banner</h1>
            <div class="h-1 w-1/3 mx-auto bg-zinc-950 mb-5 mt-5"></div>
        </div>
        <v-btn @click="expanded = !expanded" variant="outlined" class="text-h6 ma-5">
            <v-icon>{{ expanded ? 'mdi-minus' : 'mdi-plus' }}</v-icon>Add Ad Banner
        </v-btn>
        <v-expand-transition>
            <form @submit.prevent="InsertProduct" class="w-full" v-if="expanded">
                <div class="w-full flex space-x-5">
                    <label for="name" class="text-xl my-auto flex">
                        <p class="px-2 mr-2 rounded-full bg-zinc-800 text-white">1</p>Name<span
                            class="required text-red-600">*</span>:
                    </label>
                    <input
                        :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-300 text-zinc-950'"
                        class="px-2 py-1 m-2 rounded-sm w-11/12" type="text" id="name" v-model="product.name" required>
                </div>

                <div class="w-full flex space-x-5 mt-5">
                    <label for="productImage" class="text-xl my-auto flex">
                        <p class="px-2 mr-2 rounded-full bg-zinc-800 text-white">2</p>Image<span
                            class="required text-red-600">*</span>:
                    </label>
                    <input class="text-current w-full" type="file" id="image" accept="image/*" multiple
                        @change="handleImageUpload" />
                </div>
                <!--Activate Ad-->
                <!-- <div class="flex w-fit space-x-7 p-2">
                <label for="stock" class="text-xl my-auto">Stock<span class="required text-red-600">*</span>:</label>
                <v-radio-group v-model="product.stock" column>
                    <v-radio color="red" label="Out of Stock" value="FALSE"></v-radio>
                    <v-radio color="green" label="In Stock" value="TRUE"></v-radio>
                </v-radio-group>
            </div> -->
                <v-btn type="submit" min-height="40" min-width="120" class="m-5 mx-auto" color="black">Add</v-btn>
            </form>
        </v-expand-transition>
    </div>
</template>