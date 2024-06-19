<script setup>
import Swal from 'sweetalert2'
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const expanded = ref(false)
const tags = ['electronics', 'smart watches', 'headphones', 'chargers']
const product = ref({
    name: '',
    price: null,
    discount_price: null,
    description: '',
    stock: null,
    images: [],
    selectedTag: [],
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
            text: 'Uploading product',
            toast: true,
            timer: 10000,
            showConfirmButton: false,
        });

        const uploadPromises = product.value.images.map(async (file) => {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('products_images')
                .upload(`${product.value.name}/${file.name}`, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL for each uploaded image
            const { data: publicUrlData, error: publicUrlError } = await supabase.storage
                .from('products_images')
                .getPublicUrl(`${product.value.name}/${file.name}`);

            if (publicUrlError) {
                throw publicUrlError;
            }

            return publicUrlData.publicUrl;
        });

        // Wait for all uploads to complete
        const imageUrls = await Promise.all(uploadPromises);

        // Insert product details into database
        const { error: insertError } = await supabase.from('Products').insert({
            name: product.value.name,
            price: product.value.price,
            description: product.value.description,
            image: imageUrls, // Store array of image URLs in the database
            tags: product.value.selectedTag,
            stock: product.value.stock,
            discount_price: product.value.discount_price
        });

        if (insertError) {
            throw insertError;
        }

        // Reset form and show success message
        Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Product added successfully!',
            toast: true,
            timer: 3000,
            showConfirmButton: false,
        });

        console.log('Product added successfully');
        resetForm(); // Function to reset form fields
    } catch (error) {
        console.error('Error inserting product:', error.message);

        Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Error uploading the product',
            toast: true,
            timer: 2000,
            showConfirmButton: false,
        });
    }
};

const resetForm = () => {
    product.value.name = '';
    product.value.price = null;
    product.value.discount_price = null;
    product.value.description = '';
    product.value.images = [];
    product.value.selectedTag = [];
    product.value.stock = null;
    document.querySelector("#image").value = '';
};


</script>
<template>
    <div>
        <v-btn @click="expanded = !expanded" variant="outlined" class="text-h6 ma-5">
            <v-icon>{{ expanded ? 'mdi-minus' : 'mdi-plus' }}</v-icon>Add product
        </v-btn>
        <v-expand-transition>
            <form @submit.prevent="InsertProduct" class="w-full space-y-3" v-if="expanded">
                <div class="w-full flex space-x-5">
                    <label for="name" class="text-xl my-auto flex">
                        <p class="px-2 mr-3 rounded-full bg-zinc-800 text-white">1</p>Name<span
                            class="required text-red-600">*</span>:
                    </label>
                    <input
                        :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-300 text-zinc-950'"
                        class="px-2 py-1 m-2 rounded-sm w-11/12" type="text" id="name" v-model="product.name" required>
                </div>
                <div class="w-full flex space-x-7">
                    <label for="price" class="text-xl my-auto flex">
                        <p class="px-2 mr-3 rounded-full bg-zinc-800 text-white">2</p>Price<span
                            class="required text-red-600">*</span>:
                    </label>
                    <input
                        :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-300 text-zinc-950'"
                        class="px-2 py-1 m-2 rounded-sm w-11/12" type="number" step="any" id="price"
                        v-model="product.price" required>
                </div>
                <div class="w-full flex space-x-5">
                    <label for="price" class="text-xl my-auto flex">
                        <p class="px-2 my-auto mr-3 rounded-full bg-zinc-800 text-white">3</p>Discounted
                        Price:
                    </label>
                    <input
                        :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-300 text-zinc-950'"
                        class="px-2 py-1 m-2 rounded-sm w-11/12" type="number" step="any" id="discount_price"
                        v-model="product.discount_price">
                </div>
                <div class="w-full flex mt-2s space-x-5">
                    <label for="price" class="text-xl my-auto flex">
                        <p class="px-2 mr-3 rounded-full bg-zinc-800 text-white">4</p>Description<span
                            class="required text-red-600">*</span>:
                    </label>
                    <textarea rows="3" cols="3"
                        :class="theme.global.current.value.dark ? 'bg-zinc-800 text-white' : 'bg-zinc-300 text-zinc-950'"
                        class="p-1 text-md m-2 rounded-sm w-full" type="text" id="price" v-model="product.description"
                        required></textarea>
                </div>
                <div class="w-fit flex md:space-x-14 space-x-5 mt-5">
                    <label for="productImage" class="text-xl my-auto flex">
                        <p class="px-2 mr-3 rounded-full bg-zinc-800 text-white">5</p>Image<span
                            class="required text-red-600">*</span>:
                    </label>
                    <input class="text-current w-full" type="file" id="image" accept="image/*" multiple
                        @change="handleImageUpload" />
                </div>
                <div class="flex w-fit space-x-7 mt-5">
                    <label for="category" class="text-xl my-auto flex">
                        <p class="px-2 mr-3 rounded-full bg-zinc-800 text-white">6</p>Category<span
                            class="required text-red-600">*</span>:
                    </label>
                    <v-select v-model="product.selectedTag" :items="tags" hint="Choose product category"
                        label="Select product tags" multiple persistent-hint :required="true"></v-select>
                </div>
                <div class="flex w-fit space-x-12 mt-5">
                    <label for="stock" class="text-xl my-auto flex">
                        <p class="px-2 mr-2 rounded-full bg-zinc-800 text-white">7</p>Stock<span
                            class="required text-red-600">*</span>:
                    </label>
                    <v-radio-group v-model="product.stock" column>
                        <v-radio color="red" label="Out of Stock" value="FALSE"></v-radio>
                        <v-radio color="green" label="In Stock" value="TRUE"></v-radio>
                    </v-radio-group>
                </div>
                <v-btn type="submit" min-height="40" min-width="120" class="m-5 mx-auto" color="black">Add</v-btn>
            </form>
        </v-expand-transition>
    </div>
</template>