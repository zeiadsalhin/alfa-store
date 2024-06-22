<script setup>

</script>
<template>
    <div>
        <!--dialog-->
        <v-dialog close-delay="0" :opacity="0" transition="dialog-bottom-transition" width="auto"
            class="bg-zinc-950 bg-opacity-80 backdrop-blur-sm">
            <template v-slot:activator="{ props: activatorProps }">
                <v-icon v-bind="activatorProps" size="18"
                    class="hover:cursor-pointer m-1">mdi-help-circle-outline</v-icon>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card prepend-icon="mdi-truck-outline" title="Shipping Policy">
                    <v-card-text>
                        - Shipping rate 50EGP(1$) flat rate across EGYPT.
                    </v-card-text>
                    <v-card-text>
                        - Delivery in 3-5 Days
                    </v-card-text>
                    <v-card-text>
                        - Return Accepted Within 14 Days
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn text="Close" @click="isActive.value = false"></v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </div>
</template>