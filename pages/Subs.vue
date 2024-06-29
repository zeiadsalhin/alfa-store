<template>
    <div class="mt-20">
        <p>Subscription Start Date: {{ subscriptionStart }}</p>
        <p>Subscription End Date: {{ subscriptionEnd }}</p>
        <p>Remaining days until subscription ends: {{ remainingDays }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Initialize refs for subscription dates
const subscriptionStart = ref('');
const subscriptionEnd = ref('');
const remainingDays = ref('')

// Fetch subscription start date (simulated for this example)
onMounted(() => {
    const startDate = new Date() // Replace with your actual fetched date
    subscriptionStart.value = startDate.toISOString().split('T')[0]; // Store in ISO format

    // Calculate subscription end date (monthly subscription example)
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1); // Add one month for monthly subscription

    subscriptionEnd.value = endDate.toISOString().split('T')[0]; // Store in ISO format
    console.log(subscriptionEnd.value);

    // remaining days
    const today = new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    remainingDays.value = Math.round((endDate - today) / millisecondsPerDay);
    console.log(`Remaining days until subscription ends: ${remainingDays.value}`);
});
</script>