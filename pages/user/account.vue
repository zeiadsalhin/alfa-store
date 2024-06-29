<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
import Swal from 'sweetalert2'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const dataview = ref()
const name = ref()
const phone = ref()
const email = ref()
const signin = ref()
const auth = ref()


onMounted(async () => {
    try {
        const { data, error } = await supabase.auth.getSession(); // get session status from local cookies

        if (data.session) {  // access only for users
            dataview.value = true
            console.log('this user is regular')
        } else {
            navigateTo("/login")

        }
    } catch (error) {
        console.log(error);
    }

});
//seo 
useSeoMeta({
    title: `Alfa Store - User Account`,
    ogTitle: `Alfa Store - User Account`,
    description: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogDescription: 'Welcome to most progressive E-commerce platform with Safest and Secured Payment in programming services',
    ogImage: 'https://alfastorecommerce.netlify.app/mainicon.ico',
    twitterCard: 'summary_large_image',
})

</script>
<template>
    <div>
        <UserAccountdetails />
        <!-- <BottomNav /> -->
    </div>
</template>