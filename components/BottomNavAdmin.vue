<template>
    <v-bottom-navigation permanent>
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
        <v-btn to="/admin/account">
            <v-icon>mdi-account</v-icon>
            Account
        </v-btn>
    </v-bottom-navigation>
</template>