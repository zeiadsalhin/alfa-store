<script setup>
import { useMainStore } from '@/store';
import { useTheme } from 'vuetify'
const mainStore = useMainStore();
const cartItems = ref([]);
const avatar = ref();
const theme = useTheme();
const Mode = ref(theme.global.name.value);

const toggleTheme = () => {
    theme.global.name.value = Mode.value === 'customDarkTheme' ? 'customLightTheme' : 'customDarkTheme';
    Mode.value = theme.global.name.value;
    localStorage.scheme === 'customLightTheme' ? localStorage.scheme = 'customDarkTheme' : localStorage.scheme = 'customLightTheme';
};
onNuxtReady(() => {
    const val = localStorage.getItem('scheme');
    // Check if 'scheme' is found in localStorage
    if (val === 'customDarkTheme' || val === 'customLightTheme') {
        // If found, set the global theme name and Mode value accordingly
        theme.global.name.value = Mode.value = val;
    }
});

// get cart badge
onMounted(() => {
    const supabase = useSupabaseClient();
    fetchCartItems(); // Fetch initial cart items
    getavatar();
    // Watch for changes in users_cart table
    const channels = supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'users_cart' },
            () => {
                fetchCartItems();
            }
        )
        .subscribe()

    // Clean up subscription when component is unmounted
    watch(() => cartItems.value, () => {
        return () => {
            channels.unsubscribe();
        };
    });
});

async function fetchCartItems() {
    try {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase.auth.getSession()

        if (error) {
            console.error('Error fetching session:', error.message)
            return
        }
        if (!data) {
            cartItems.value = []
            return
        }
        const id = data.session.user.id

        const { data: cartData, error: cartError } = await supabase
            .from('users_cart')
            .select('cart_items')
            .eq('uid', id)

        if (cartError) {
            console.error('Error fetching cart items:', cartError.message)
            cartItems.value = []
            return
        }
        // Update cartItems.value with fetched cart items or empty array if no data
        cartItems.value = cartData && cartData.length > 0 ? cartData[0].cart_items : []
    } catch (error) {
        // console.error('Error fetching cart items:', error.message)
        cartItems.value = [] // Clear cart items in case of any error
    }
}

// get user avatar
async function getavatar() {
    const supabase = useSupabaseClient()
    try {
        const { data, error } = await supabase.auth.getSession(); // get session status from local cookies
        if (data.session.user) {
            avatar.value = data.session.user.identities[0].identity_data.avatar_url
            // displayname.value = data.session.user.identities[0].identity_data.first_name || data.session.user.identities[0].identity_data.full_name // Display registered username

        } else {
            avatar.value = null
            // console.log('this user is regular')

        }
    } catch (error) {
        // console.log(error);
    }
}

// handle log in and log out
const user = useSupabaseUser()
watch(user, () => {
    if (user.value) {
        fetchCartItems();
        getavatar();
    } else {
        fetchCartItems();
        getavatar();
    }
}, { immediate: true })
</script>
<template>
    <div>
        <v-app-bar color="gray" :elevation="2" app>
            <nuxt-link to="/">
                <v-toolbar-title class="md:p-4">
                    <!-- <h1 class="font-bold text-xl">Alfa Store</h1> -->
                    <img src="/icon.ico" :class="theme.global.current.value.dark ? 'bg-inherit ' : 'bg-'" class="md:p-"
                        width="150" alt="logo">
                </v-toolbar-title>
            </nuxt-link>
            <v-spacer />
            <!-- <nuxt-link to="/">
                <v-btn class="mr-md-2" icon>
                    <v-icon size="20">mdi-home</v-icon></v-btn>
            </nuxt-link> -->
            <nuxt-link to="/admin">
                <v-btn class="mr-md-2" icon>
                    <v-avatar v-if="avatar" size="25"><v-img :src="avatar"></v-img></v-avatar>
                    <v-icon v-else size="20">mdi-account-outline</v-icon>
                </v-btn>
            </nuxt-link>
            <nuxt-link to="/products"><v-btn class="mr-md-2" icon>
                    <v-icon size="20">mdi-store-outline</v-icon>
                </v-btn></nuxt-link>
            <v-badge v-if="cartItems.length > 0" :content="cartItems.length">
                <v-btn nuxt to="/cart" icon>
                    <v-icon size="20">mdi-cart-outline</v-icon>
                </v-btn>
            </v-badge>
            <v-btn v-else nuxt to="/cart" icon>
                <v-icon size="20">mdi-cart-outline</v-icon>
            </v-btn>
            <v-btn v-if="Mode == 'customDarkTheme'" @click="toggleTheme" icon>
                <v-icon size="20">mdi-brightness-2</v-icon>
            </v-btn>
            <v-btn v-else @click="toggleTheme" icon>
                <v-icon size="20">mdi-brightness-7</v-icon>
            </v-btn>
        </v-app-bar>
    </div>
</template>
<script>
export default {
    methods: {
        toggleTheme2() {
            // localStorage.scheme === 'light' ? localStorage.scheme = 'dark' : localStorage.scheme = 'light';
            // this.$router.go()
            this.theme.global.current.dark ? 'myCustomLightTheme' : 'myCustomdarkTheme';
            this.$vuetify.theme.dark ? console.log('dark') : console.log('light');
        },
    },
};
</script>