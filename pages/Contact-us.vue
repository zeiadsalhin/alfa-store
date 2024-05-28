<script setup>
const phoneNumber = ref('NO DATA')
const email = ref('NO DATA')
const address = ref('NO DATA')
onMounted(() => {
    getcontacts()
})
const getcontacts = async () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    try {
        const { data, error } = await supabase.from('Contact-Details').select()
        phoneNumber.value = data[0].phone
        email.value = data[0].email
        address.value = data[0].address
        if (error) {
            console.log(error);
            throw error
        }

    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
}

</script>
<template>
    <div class="my-auto">
        <v-card class="mx-auto text-center md:w-1/2">
            <h1 class="text-3xl mt-10 font-bold">Contact Us</h1>
            <div class="h-0.5 w-2/3 mx-auto bg-zinc-800 rounded-full mt-5 mb-5"></div>
            <v-card-text>
                <div class="contact-info text-lg space-y-3 mb-10">
                    <p><v-icon class="mb-1 mx-1" size="20">mdi-phone</v-icon> Phone: <a class="hover:opacity-80"
                            :href="'tel:' + phoneNumber">{{
                                phoneNumber }}</a></p>
                    <p><v-icon class="mb-1 mx-1" size="20">mdi-email</v-icon> Email: <a class="hover:opacity-80"
                            :href="'mailto:' + email">{{
                                email }}</a></p>
                    <p><v-icon class="mb-1 mx-1" size="20">mdi-map</v-icon> Address: <br>{{ address }}</p>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>