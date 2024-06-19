<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const Adsitems = ref({});

// Fetch Ads 
onMounted(async () => {

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    try {
        const { data, error } = await supabase.from('Ads').select('*');

        // console.log('Products:', data);
        Adsitems.value = data
        // console.log(data);

    } catch (error) {
        console.error('Error fetching Ads:', error.message);
    }

});
</script>
<template>
    <div>
        <div class="h-1 w-1/6 mx-auto bg-zinc-800 mb-5 mt-5"></div>
        <p class="p-5 text-2xl">All Ad Banners ({{ Adsitems.length }})</p>
        <div class="flex md:table w-full mx-auto">
            <v-table height="400px" fixed-header density="default"
                :theme="theme.global.current.value.dark ? 'dark' : 'light'">
                <thead>
                    <tr>
                        <th class="text-left">
                            Name
                        </th>
                        <th class="text-center">
                            Ad image
                        </th>
                        <th>Manage</th>
                    </tr>
                </thead>
                <tbody class="text-left">
                    <tr v-for="item in Adsitems" :key="item.name">
                        <td class="">{{ item.name }}</td>
                        <td><v-img :src="JSON.parse(item.image)[0]" class="m-5" max-width="300" min-width="100"></v-img>
                        </td>
                        <td><v-btn @click="" variant="outlined" elevation="3" max-width="10"
                                max-height="30">Edit</v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>
</template>