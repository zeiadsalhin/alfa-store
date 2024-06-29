<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
const avatar = ref()
const name = ref()
const email = ref()

onMounted(async () => {

    const supabase = useSupabaseClient()
    try {
        const { data, error } = await supabase.auth.getSession(); // get session status from local cookies
        avatar.value = data?.session ? data.session.user.identities[0].identity_data.avatar_url : null
        name.value = data.session.user.identities[0].identity_data.first_name || data.session.user.identities[0].identity_data.full_name // Display registered username
        email.value = data.session.user.identities[0].identity_data.email


    } catch (error) {
        // console.log(error);
    }

})
</script>
<template>
    <div>
        <!-- <v-layout> -->
        <v-navigation-drawer :permanent="true" v-if="$vuetify.display.mdAndUp" class="py-2">

            <v-list-item :prepend-avatar="avatar ? 'avatar' : null" :prepend-icon="avatar ? null : 'mdi-shield-account'"
                :title="name" :subtitle="email"></v-list-item>
            <v-divider>Manage</v-divider>
            <v-list-item link to="/admin" prepend-icon="mdi-home">Home</v-list-item>
            <!-- <v-divider></v-divider> -->
            <v-list-item link to="/admin/orders" prepend-icon="mdi-truck">Orders</v-list-item>
            <v-list-item link to="/admin/products" prepend-icon="mdi-package">Products</v-list-item>
        </v-navigation-drawer>
        <!-- </v-layout> -->
    </div>
</template>