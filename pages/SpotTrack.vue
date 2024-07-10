<script setup>
// In your Nuxt 3 project, you might have a service or a component to handle API requests
import axios from 'axios';

const tokenExist = ref(false)
setTimeout(() => {
    localStorage.getItem('access_token') ? tokenExist.value = true : tokenExist.value = false
}, 50);

// get current play
const playData = ref(null);
const playimg = ref(null);
const currentMilliseconds = ref(0);
const totalMilliseconds = ref(0);
const progress = ref(0);

// Simulate progress update (replace with your actual logic)
watchEffect(() => {
    const currentTotalSeconds = Math.floor(currentMilliseconds.value / 1000);
    const totalTotalSeconds = Math.floor(totalMilliseconds.value / 1000);

    if (totalTotalSeconds > 0) {
        progress.value = (currentTotalSeconds / totalTotalSeconds) * 100;
    } else {
        progress.value = 0; // Handle division by zero or totalMilliseconds being zero
    }
});

async function checkCurrentlyPlaying() {
    try {
        const url = 'https://api.spotify.com/v1/me/player/currently-playing';
        const accessToken = localStorage.getItem('access_token'); // Replace with the access token you obtained

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (response.status === 200 && response.data.is_playing) {
            // calculate duration 
            function formatMillisecondsToMinSec(currentMilliseconds, totalMilliseconds) {
                const currentTotalSeconds = Math.floor(currentMilliseconds / 1000);
                const totalTotalSeconds = Math.floor(totalMilliseconds / 1000);

                const currentMinutes = Math.floor(currentTotalSeconds / 60);
                const currentSeconds = currentTotalSeconds % 60;

                const totalMinutes = Math.floor(totalTotalSeconds / 60);
                const totalSeconds = totalTotalSeconds % 60;

                const currentFormatted = `${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
                const totalFormatted = `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;

                return `${currentFormatted} of ${totalFormatted}`;
            }
            //// Increment progress
            currentMilliseconds.value = response.data.progress_ms
            totalMilliseconds.value = response.data.item.duration_ms
            //
            playData.value = { name: `${response.data.item.name}`, artist: `${response.data.item.artists[0].name}`, playback: `${formatMillisecondsToMinSec(response.data.progress_ms, response.data.item.duration_ms)}` }
            playimg.value === response.data.item.album.images[1].url ? '' : playimg.value = response.data.item.album.images[1].url
            //
            return true;
        } else {
            // console.log('No track currently playing.');
            playData.value = 'No track currently playing.'
            playimg.value = ''
            return false;
        }
    } catch (error) {
        console.log(error);
        tokenExist.value = false
    }

}
onMounted(() => {
    checkCurrentlyPlaying()
    setInterval(() => {
        checkCurrentlyPlaying()
    }, 3000);
})

// authorize spotify user 
const router = useRouter();
const authorize = () => {
    const client_id = '4a730932376f4ea693ed8077c3be587d';
    const redirect_uri = 'http://localhost:3000/callback'; // Replace with your registered redirect URI
    const scope = 'user-read-currently-playing'; // Specify scopes as needed

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scope)}`;

    // Redirect user to Spotify authorization page
    navigateTo(authUrl, { external: true });
};
</script>
<template>
    <div>
        <div v-if="!tokenExist">
            <h1>Spotify Authorization Example</h1>
            <p>Click the button below to authorize your Spotify account.</p>
            <button @click="authorize">Authorize Spotify</button>
        </div>
        <button v-if="!playData" @click="checkCurrentlyPlaying">Check track</button>
        <div v-if="playData && playimg" class="play text-center">
            <p class="p-3 text-lg">Playing now:</p>
            <v-lazy>
                <!-- <v-transition name="fade" mode="out-in"> -->
                <v-img :src="playimg ? playimg : ''" max-width="150" max-height="150" class="m-2 mx-auto"></v-img>
                <!-- </v-transition> -->
            </v-lazy>
            <p class="font-semibold">{{ playData.name }}</p>
            <p class="opacity-70 p-1">{{ playData.artist }}</p>
            <p class="p-2">{{ playData.playback }}</p>
            <div class="w-1/2 mx-auto">
                <v-progress-linear v-model="progress" :height="2" color="secondary"></v-progress-linear>
            </div>
        </div>
        <div v-else class="text-center">{{ playData }}</div>
    </div>
</template>