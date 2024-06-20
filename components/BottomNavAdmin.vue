import type vuetify from '~/plugins/vuetify';
<template>
    <v-bottom-navigation permanent v-if="!$vuetify.display.mdAndUp">
        <v-btn to="/">
            <v-icon>mdi-home</v-icon>
            Home
        </v-btn>
        <v-btn to="/admin/orders">
            <v-icon>mdi-cart</v-icon>
            Orders
        </v-btn>
        <v-btn to="/admin/products">
            <v-icon>mdi-truck</v-icon>
            Products
        </v-btn>
        <v-btn to="/admin/">
            <v-icon>mdi-account</v-icon>
            Account
        </v-btn>
    </v-bottom-navigation>
</template>