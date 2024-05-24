<script setup>
import { useMainStore } from '@/store';
import { useTheme } from 'vuetify'
const mainStore = useMainStore();
const cartItems = computed(() => mainStore.items);
const theme = useTheme();
const Mode = ref(theme.global.name.value);

const toggleTheme = () => {
    theme.global.name.value = Mode.value === 'customDarkTheme' ? 'customLightTheme' : 'customDarkTheme';
    Mode.value = theme.global.name.value;
    localStorage.scheme === 'customLightTheme' ? localStorage.scheme = 'customDarkTheme' : localStorage.scheme = 'customLightTheme';
};
</script>
<template>
    <div>
        <v-app-bar color="gray" :elevation="2" app>
            <nuxt-link to="/">
                <v-toolbar-title class="p-4">
                    <!-- <h1 class="font-bold text-xl">Alfa Store</h1> -->
                    <img src="/logoc.png" :class="theme.global.current.value.dark ? 'bg-inherit ' : 'bg-'"
                        class="md:p-2" width="250" alt="logo">
                </v-toolbar-title>
            </nuxt-link>
            <v-spacer />
            <!-- <nuxt-link to="/">
                <v-btn class="mr-md-2" icon>
                    <v-icon size="20">mdi-home</v-icon></v-btn>
            </nuxt-link> -->
            <nuxt-link to="/admin">
                <v-btn class="mr-md-2" icon>
                    <v-icon size="20">mdi-account-outline</v-icon></v-btn>
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