<template>
    <div class="pa-4 text-center">
        <v-dialog :close-delay="0" theme="dark" opacity="0" width="auto"
            class="bg-zinc-950 bg-opacity-50 backdrop-blur-md" max-width="350">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn v-bind="activatorProps" text="test confirmation"></v-btn>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card>
                    <template v-slot:text>
                        <v-card-title class="text-center"><v-icon class="mx-auto"
                                size="40">mdi-check-circle-outline</v-icon></v-card-title>
                        <v-card-title class="text-h7 font-weight-bold mb-3 text-center">Thank
                            you
                            for placing
                            order!</v-card-title>
                        <v-spacer></v-spacer>
                        <h1 class="text-h7 p-1">Your Order_ID is:</h1>
                        <p> s892839-ugg787-HHISAsadassa909000-opOP67t6</p>
                    </template>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn color="surface-variant" text="Close" variant="tonal"
                            @click="isActive.value = false"></v-btn>

                        <v-btn color="gray-darken-1" :elevation="4" text="Track Order" variant="outlined"
                            @click="isActive.value = false; console.log('closed')"></v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </div>
</template>