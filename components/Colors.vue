<script setup>
const props = defineProps({
    options: Array,
    required: true
});
const emit = defineEmits(['option-selected']);
function selectedoption(option) {
    // console.log(option);
    emit('option-selected', option);
}
</script>
<template>
    <div>
        <h1>Available Options:</h1>
        <v-chip-group filter>
            <v-chip v-for="(option, i) in options" :key="i" :class="'text-' + option.toLowerCase()"
                @click="selectedoption(option)"><v-icon size="x-small">mdi-circle</v-icon>
                {{ option }}</v-chip>
        </v-chip-group>
    </div>
</template>