<script setup>
import axios from 'axios';

const tokenExist = ref(false)
setTimeout(() => {
    localStorage.getItem('access_token') ? tokenExist.value = localStorage.getItem('access_token') : tokenExist.value = false
}, 100);

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
            playimg.value = response.data.item.album.images[1].url
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

watch(() => tokenExist?.value, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        checkCurrentlyPlaying();
        console.log('player started');
    } else {
        console.log('no token, no player');
    }
});

watch(() => playimg?.value, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        // console.log('Change image');
        coverimg.value = ''
        setTimeout(() => {
            coverimg.value = playimg.value
        }, 200);
    }
});

onMounted(() => {
    setTimeout(() => {
        tokenExist.value != false ? checkCurrentlyPlaying() : console.log('no token, no player');

        // getQueue()
    }, 500);
    const playInt = setInterval(() => {
        // getQueue()
        checkCurrentlyPlaying()
        if (!tokenExist.value) {
            clearInterval(playInt);
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

        <v-lazy name="fade" mode="out-in" v-if="playData && playimg">
            <v-img id="playCover" :src="coverimg ? coverimg : ''" cover max-height="600" min-height="600"
                gradient="to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)),linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4)),linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)"
                class="h-[22rem] min-h-[22rem] max-h-[22rem] transform transition-all ease-in-out duration-1000 fade-in">
                <div class="play text-center min-h-[22rem]">

                    <div class="content">
                        <p class="p-3 text-lg">Playing now:</p>
                        <v-lazy>
                            <!-- <v-transition name="fade" mode="out-in"> -->
                            <v-img :src="playimg ? playimg : ''" max-width="150" max-height="150"
                                class="m-2 mx-auto rounded-sm"></v-img>
                            <!-- </v-transition> -->
                        </v-lazy>
                        <p class="font-semibold max-w-60 mx-auto">{{ playData.name }}</p>
                        <p class="opacity-70 m-1 inline-block" v-for="(artist, index) in playData.artists" :key="index">
                            {{
                                artist.name }}</p>
                        <div class="w-48 mx-auto mt-3">
                            <v-progress-linear v-model="progress" :height="2" color="secondary"></v-progress-linear>
                        </div>
                        <div class="time flex w-52 mx-auto justify-between">
                            <p class="p-2">{{ startTime }}</p>
                            <p class="p-2">{{ endTime }}</p>
                        </div>

                        <div class="queue mx-auto flex flex-col justify-center p-5">
                            <p class="font-bold mb-5">Next:</p>
                            <v-lazy>
                                <div class="next max-w-96 mx-auto flex justify-center">
                                    <v-img :src="nextQueue ? nextQueue.nextimg : ''" min-width="60" max-width="60"
                                        max-height="60" class="m-1 rounded-sm"></v-img>
                                    <div class="title">
                                        <p class="p-2 my-auto w-60 mx-auto">{{ (nextQueue?.name) }}</p>
                                        <p class="opacity-70 m-1 inline-block my-auto mx-auto w-fit">{{
                                            (nextQueue?.artist)
                                        }}
                                        </p>
                                    </div>
                                    <p class="p-2 my-auto w-20">{{ nextQueue?.length }}</p>
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