<script setup>
import Swal from 'sweetalert2'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const product = ref({
    name: '',
    price: null,
    description: '',
    stock: true,
    image: null
});
// Add product
async function handleImageUpload(event) {
    const file = event.target.files[0];
    product.value.image = file;
}

async function InsertProduct() {
    try {
        Swal.fire({
            title: 'Uploading',
            icon: 'info',
            text: 'Uploading product',
            toast: true,
            timer: 10000,
            showConfirmButton: false,
        })
        const file = product.value.image;
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('products_images')
            .upload(`${product.value.name}/${file.name}`, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Error uploading the image',
                toast: true,
                timer: 2000,
                showConfirmButton: false,
            })
            console.error('Error uploading image:', uploadError.message);
        } else {
            const { data: publicUrlData, error: publicUrlError } = await supabase
                .storage
                .from('products_images')
                .getPublicUrl(`${product.value.name}/${file.name}`);

            if (publicUrlError) {
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Error getting image url',
                    toast: true,
                    timer: 2000,
                    showConfirmButton: false,
                })
                console.error('Error obtaining public URL:', publicUrlError.message);
            } else {
                const publicUrl = publicUrlData.publicUrl;

                const { error: insertError } = await supabase
                    .from('Products')
                    .insert({
                        name: product.value.name,
                        price: product.value.price,
                        description: product.value.description,
                        image: publicUrl,
                        stock: product.value.stock
                    });

                if (insertError) {
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: 'Error uploading product',
                        toast: true,
                        timer: 2000,
                        showConfirmButton: false,
                    })
                    console.error('Error inserting product:', insertError.message);
                } else {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: 'Product added successfully!',
                        toast: true,
                        timer: 3000,
                        showConfirmButton: false,
                    })
                    console.log('Product added successfully');
                    // Reset the form after successful addition
                    product.value.name = '';
                    product.value.price = null;
                    product.value.description = '';
                    product.value.image = null;
                    document.querySelector("#image").value = ''
                }
            }
        }
    } catch (error) {
        Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Error uploading the product',
            toast: true,
            timer: 1000,
            showConfirmButton: false,
        })
        console.error('Error adding product:', error.message);
    }
}

</script>
<template>
    <div>
        <form @submit.prevent="InsertProduct">
            <div class="w-full flex space-x-5">
                <label for="name" class="text-xl">Name:</label>
                <input class="bg-zinc-600 px-2 py-1 m-2 rounded-sm w-11/12" type="text" id="name" v-model="product.name"
                    required>
            </div>
            <div class="w-full flex space-x-7">
                <label for="price" class="text-xl">Price:</label>
                <input class="bg-zinc-600 px-2 py-1 m-2 rounded-sm w-11/12" type="number" step="any" id="price"
                    v-model="product.price" required>
            </div>
            <div class="w-full py-2">
                <label for="price" class="text-xl">Description:</label>
                <textarea rows="3" cols="3" class="bg-zinc-600 p-1 text-md m-2 rounded-sm w-full" type="text" id="price"
                    v-model="product.description" required></textarea>
            </div>
            <div class="w-fit space-x-7 p-2">
                <input class="text-current  " type="file" id="image" accept="image/*" @change="handleImageUpload" />
            </div>
            <v-btn type="submit" min-height="40" min-width="120" class="m-5 mx-auto" color="black">Add</v-btn>
        </form>
    </div>
</template>