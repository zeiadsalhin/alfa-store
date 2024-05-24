<template>
    <v-card rounded="md" class="m-10 text-center w-11/12 mx-auto" color="grey-darken-1

" dark>
        <h2 class="text-3xl font-semibold p-2">Newsletter</h2>
        <p class="text-xl p-2">Subscribe</p>
        <v-sheet color="transparent" class="mx-auto text-center p-2">
            <v-text-field label="Email" type="email" variant="outlined" v-model="email"></v-text-field>
            <v-btn @click="subscribe" outline min-height="50" block class="mx-auto text-left">Subscribe</v-btn>
        </v-sheet>
    </v-card>
</template>
<script>
import Swal from 'sweetalert2'
export default {
    data() {
        return {
            email: null,
        }
    },
    methods: {
        async subscribe() {
            await Swal.fire({
                title: "Subscribed successfully",
                icon: "success",
                timer: 2000,
                timerProgressBar: true,

            })
        }
    },
}
</script>