<script setup>
const options = [
    { color: 'White', class: 'text-white bg-black' },
    { color: 'Green', class: 'text-green' },
    { color: 'Blue', class: 'text-blue' },
    { color: 'Grey', class: 'text-grey' },
    { color: 'Red', class: 'text-red' },
    { color: 'Black', class: 'text-black bg-white' },
    { color: 'Yellow', class: 'text-yellow' },
]
</script>
<template>
    <div>
        <h1>Available Colors:</h1>
        <v-chip-group filter>
            <v-chip v-for="(option, i) in options" :key="i" :class="option.class"><v-icon
                    size="x-small">mdi-circle</v-icon>
                {{ option.color }}</v-chip>
        </v-chip-group>
    </div>
</template>