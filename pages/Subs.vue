<template>
    <div class="mt-20">
        <p>Subscription Start Date: {{ subscriptionStart }}</p>
        <p>Subscription End Date: {{ subscriptionEnd }}</p>
        <p>Remaining days until subscription ends: {{ remainingDays }}</p>
        <!-- <button @click="Subscribe">Subscribe</button> -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const supabase = useSupabaseClient()

// Initialize refs for subscription dates
const subscriptionStart = ref(''); // Predefined start date
const subscriptionEnd = ref('');   // Predefined end date
const subscriptionPeriod = ref(1);
const remainingDays = ref('');

// Lifecycle hook
onBeforeMount(() => {
    // CalcSubs()
    // getSubsPeriodtoSubscribe()
    FetchSubscription()
});

const getSubsPeriodtoSubscribe = (() => {
    const startDate = new Date(); // Convert start date string to Date object
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1)    // Convert end date string to Date object
    subscriptionStart.value = startDate.toISOString().split('T')[0];
    subscriptionEnd.value = endDate.toISOString().split('T')[0];
    // Calculate remaining days
    const today = new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    remainingDays.value = Math.round((endDate - today) / millisecondsPerDay);

    console.log(`Subscription start date: ${subscriptionStart.value}`);
    console.log(`Subscription end date: ${subscriptionEnd.value}`);
    console.log(`Remaining days until subscription ends: ${remainingDays.value}`);
})

const Subscribe = (async () => {
    const startDate = new Date(); // Assuming today's date for simulation
    subscriptionStart.value = startDate.toISOString().split('T')[0];

    // Calculate subscription end date (monthly subscription example)
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + subscriptionPeriod.value); // Add one month for monthly subscription

    subscriptionEnd.value = endDate.toISOString().split('T')[0];

    // Calculate remaining days
    const today = new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    remainingDays.value = Math.round((endDate - today) / millisecondsPerDay);

    // upload to supabase 
    try {
        const { data: userId, error: uiderror } = await supabase.auth.getSession();
        const { data, error } = await supabase.from('store_config')
            .update({ subscriptionStart: startDate, subscriptionEnd: endDate })
            .eq('merchant_id', userId.session.user.identities[0]?.id)
    } catch (error) {
        console.log(error);
    }
})

const FetchSubscription = (async () => {
    try {
        const { data: userId, error: usererror } = await supabase.auth.getSession();
        const { data, error } = await supabase
            .from('store_config')
            .select()
            .eq('merchant_id', userId.session.user.identities[0]?.id)
        subscriptionStart.value = new Date(data[0].subscriptionStart).toISOString().split('T')[0]
        subscriptionEnd.value = new Date(data[0].subscriptionEnd).toISOString().split('T')[0]
        // get remaining days
        const endDate = new Date(subscriptionEnd.value);
        const today = new Date();
        const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
        remainingDays.value = Math.round((endDate - today) / millisecondsPerDay);
        subsExp()
    } catch (error) {
        console.log(error);
    }
})

const subsExp = (async () => {
    try {
        const { data: userId, error: usererror } = await supabase.auth.getSession();
        const { data, error } = await supabase
            .from('store_config')
            .select()
            .eq('merchant_id', userId.session.user.identities[0]?.id)

        if (subscriptionEnd.value && new Date() > new Date(subscriptionEnd.value)) {
            console.log('Subs Expired: ', subscriptionEnd.value);
        }
    } catch (error) {
        console.log(error);
    }
})
</script>