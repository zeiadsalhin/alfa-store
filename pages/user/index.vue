<script setup>

// Magic link login
const route = useRoute()
onBeforeMount(() => {
    handleuser()
})

async function handleuser() {
    const supabase = useSupabaseClient()
    const type = 'email'
    const token_hash = route.query.token

    const { data: { session }, error, } = await supabase.auth.verifyOtp({ token_hash, type })

    if (token_hash) {
        console.log(token_hash);
    } else {
        // console.log('token hash Must be exist');
        return navigateTo('/login')
    }
    if (session) {
        // console.log('Session Started:', session);
    } else {
        // console.log('no session started');
    }
    if (error) {
        // console.log(error);
        errMsg.value = error.message;
        throw error;
    }
}

const supabase = useSupabaseClient()
onMounted(async () => {
    try {
        const { data, error } = await supabase.auth.getSession(); // get session status from local cookies

        if (data.session) {  // access only for users
            navigateTo("/login")
            console.log('this user is regular')
        } else {
            navigateTo("/login")
        }
    } catch (error) {
        console.log(error);
    }

});
</script>
<template>
    <div>
        <v-layout>
            <v-main style="min-height: 300px;">
                <!-- <nuxt /> -->
            </v-main>
        </v-layout>
        <BottomNav />
    </div>
</template>