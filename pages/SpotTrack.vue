<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import fetchWithAuth from '~/utils/api';
import { getAccessToken } from '~/utils/token';


// test area refresh token
// const expiresIn = 5; // example: token expires in 1 hour (3600 seconds)
// const expiryTimestamp = Date.now() + expiresIn * 1000;
// setTimeout(() => {
// console.log(Date.now() >= expiryTimestamp);
// }, 8000);

// get current play
const playData = ref(null);
const playimg = ref(null);
const coverimg = ref(null);
const startTime = ref(0);
const endTime = ref(0)
const currentMilliseconds = ref(0);
const totalMilliseconds = ref(0);
const progress = ref(0);
const nextQueue = ref(null);
const currQueue = ref(null);
const updateQueue = ref()

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

// token refresh
const tokenExist = ref(null)
async function WatchTokenExp() {
    try {
        const response = await fetchWithAuth('https://api.spotify.com/v1/me');
        if (response.ok) {
            // data.value = await response.json();
            let token = await getAccessToken();
            // console.log('Token VALID :' + token);
            token ? tokenExist.value = token : tokenExist.value = null
            // setInterval(playInt)
            // console.error('fetched data:', response.statusText);
        } else {
            console.error('Failed to fetch data:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
onBeforeMount(() => {
    WatchTokenExp()
})

async function checkCurrentlyPlaying() {
    try {
        const url = 'https://api.spotify.com/v1/me/player/currently-playing';
        const accessToken = tokenExist.value; // Replace with the access token you obtained

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
                startTime.value = currentFormatted
                endTime.value = totalFormatted
                return currentFormatted + totalFormatted;
            }
            //// Increment progress
            currentMilliseconds.value = response.data.progress_ms
            totalMilliseconds.value = response.data.item.duration_ms
            //
            playimg.value = ''
            //
            playData.value = response.data.item
            const playback = formatMillisecondsToMinSec(response.data.progress_ms, response.data.item.duration_ms)
            playimg.value = response.data.item.album.images[0].url
            //
            return true;
        } else {
            // console.log('No track currently playing.');
            playData.value = 'No track currently playing.'
            playimg.value = ''
            return false;
        }
    } catch (error) {
        console.log(error.message);
        if (error.message == "Network Error") {
            console.log('no internet');
        } else {
            tokenExist.value = null
        }
    }

}
// get queue
async function getQueue() {
    try {
        const url = 'https://api.spotify.com/v1/me/player/queue';
        const accessToken = localStorage.getItem('access_token'); // Replace with the access token you obtained

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (response.status === 200) {
            // console.log(response.data.queue[0]);
            nextQueue.value = { name: `${response?.data?.queue[0].name}`, artist: `${response?.data?.queue[0].artists[0].name}`, nextimg: `${response?.data?.queue[0].album.images[2].url}`, length: `${((Math.floor(response?.data?.queue[0].duration_ms / 60000)) % 60).toString().padStart(2, '0')}:${((Math.floor(response?.data?.queue[0].duration_ms / 1000)) % 60).toString().padStart(2, '0')}` }
        }
    } catch (error) {
        console.log('Queue: ' + error);
    }
}
// Watch for changes in playData to call changeQueue
watch(() => playData?.value?.name, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        getQueue();
    }
});
// initialize with token
watch(() => tokenExist?.value, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        checkCurrentlyPlaying();
        console.log('player started');
    } else {
        console.log('no token, no player');
    }
});
// cover image
watch(() => playimg?.value, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        // console.log('Change image');
        coverimg.value = ''
        setTimeout(() => {
            coverimg.value = playimg.value
        }, 200);
    }
});
// queue manage
watch(() => nextQueue?.value, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        // console.log('Change queue');
        setTimeout(() => {
            currQueue.value = nextQueue.value
        }, 200);
    }
});

onMounted(async () => {
    // setTimeout(() => {
    // tokenExist.value != false ? await checkCurrentlyPlaying() : console.log('no token, no player');
    // }, 500);
    const playInt = setInterval(async () => {
        await checkCurrentlyPlaying()
        if (tokenExist.value == 'sessionExpired') {
            clearInterval(playInt);
            console.log('player cleared');
            return false;
        }
    }, 3000);

})

// authorize spotify user 
const router = useRouter();
const authorize = () => {
    const client_id = '4a730932376f4ea693ed8077c3be587d';
    const redirect_uri = process.env.NODE_ENV === 'production'
        ? 'https://alfastorecommerce.netlify.app/callback'
        : 'http://localhost:3000/callback';// Replace with your registered redirect URI

    const scope = 'user-read-currently-playing user-read-playback-state'; // Specify scopes as needed

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
        <div v-if="!playData && tokenExist" class="flex justify-center items-center min-h-screen">
            <v-progress-circular color="grey-darken-1" indeterminate class="my-auto"></v-progress-circular>
        </div>

        <v-lazy name="fade" mode="out-in" v-if="playData && playimg && tokenExist">
            <v-img id="playCover" :src="coverimg ? coverimg : ''" cover max-height="600" min-height="600"
                gradient="to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)),linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4)),linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)"
                class="h-[22rem] min-h-[22rem] max-h-[22rem] transform transition-all ease-in-out duration-1000 fade-in">
                <div class="play text-center min-h-[22rem]">

                    <div class="content">
                        <p class="p-3 text-lg">Playing now:</p>
                        <v-lazy>
                            <!-- <v-transition name="fade" mode="out-in"> -->
                            <v-img :src="playimg ? playimg : ''" max-width="250" max-height="250"
                                class="m-2 mx-auto rounded-sm"></v-img>
                            <!-- </v-transition> -->
                        </v-lazy>
                        <p class="font-bold text-xl max-w-80 mx-auto mt-5">{{ playData.name }}</p>
                        <p class="opacity-70 m-1 inline-block" v-for="(artist, index) in playData.artists" :key="index">
                            {{
                                artist.name }}</p>
                        <p class="opacity-85   m-0.5">
                            on {{ playData.album.name }}
                        </p>
                        <div class="w-72 mx-auto mt-3">
                            <v-progress-linear v-model="progress" :height="2" color="secondary"></v-progress-linear>
                        </div>
                        <div class="time flex w-[20rem]   mx-auto justify-between">
                            <p class="p-2">{{ startTime }}</p>
                            <p class="p-2">{{ endTime }}</p>
                        </div>

                        <div class="queue mx-auto flex flex-col justify-center p-5">
                            <p class="font-bold mb-5">Next:</p>
                            <v-lazy>
                                <div class="next max-w-96 mx-auto flex justify-between">
                                    <v-img :src="currQueue ? currQueue.nextimg : ''" min-width="60" max-width="60"
                                        max-height="60" class="m-1 rounded-sm"></v-img>
                                    <div class="title">
                                        <p class="px-2 mt-2 my-auto max-w-72 mx-auto">{{ (currQueue?.name) }}</p>
                                        <p class="opacity-70 mxa-1 inline-block my-auto mx-auto w-fit">by {{
                                            (currQueue?.artist)
                                            }}
                                        </p>
                                    </div>
                                    <p class="p-2 my-auto w-20 flex justify-end">{{ currQueue?.length }}</p>
                                </div>
                            </v-lazy>
                        </div>
                    </div>
                </div>
            </v-img>
        </v-lazy>
        <div v-else class="text-center">{{ playData }}</div>
    </div>
</template>