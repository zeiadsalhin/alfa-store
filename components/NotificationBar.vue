<script setup>
// Define props
const props = defineProps({
    snackbar: Boolean, // Boolean prop for controlling visibility
    icon: {
        type: String,
        default: "mdi-check-bold"
    },
    message: {
        type: String,
        default: "Message Sent successfully!" // Default message
    },
    timeout: {
        type: Number,
        default: 2000 // Default timeout
    }
});

// Reactive variable for controlling snackbar visibility
const snackbar = ref(props.snackbar);
watch(() => props.snackbar, (newValue, oldValue) => {
    console.log('Snackbar prop changed:', newValue);
    snackbar.value = newValue
});
</script>
<template>
    <div>
        <div class="text-center ma-2">
            <v-snackbar v-model="snackbar" location="top" color="grey-darken-4" :timeout="timeout">
                <div class="flex">
                    <v-icon class="mx-2" size="30">{{ icon }}</v-icon>
                    <p class="text-lg my-auto">{{ message }}</p>
                </div>
            </v-snackbar>
        </div>
    </div>
</template>