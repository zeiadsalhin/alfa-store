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


</script>
<template>
    <div>
        <UserAccountdetails />
        <BottomNav />
    </div>
</template>