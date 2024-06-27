<script setup>
const invoice = ref('invoiceID')
</script>
<template>
    <div class="mt-20">
        This is user orders
        <nuxt-link :to="'/user/orders/' + invoice">Go to invoice</nuxt-link>
        <BottomNav />
    </div>
</template>