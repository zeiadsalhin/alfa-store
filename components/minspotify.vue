<script setup>
import axios from 'axios';
import { ref, watchEffect, watch, onMounted } from 'vue';
import fetchWithAuth from '~/utils/api';
import { getAccessToken } from '~/utils/token';

const tokenExist = ref(null);

// get current play
const playData = ref(null);
const playimg = ref(null);
const coverimg = ref(null);
const startTime = ref(0);
const endTime = ref(0);
const currentMilliseconds = ref(0);
const totalMilliseconds = ref(0);
const progress = ref(0);
const nextQueue = ref(null);
const currQueue = ref(null);
let playInt = null;

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
        // console.log('PLAYING TOKEN : ' + tokenExist.value);
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
                startTime.value = currentFormatted;
                endTime.value = totalFormatted;
                return currentFormatted + totalFormatted;
            }

            //// Increment progress
            currentMilliseconds.value = response.data.progress_ms;
            totalMilliseconds.value = response.data.item.duration_ms;

            playimg.value = '';
            playData.value = response.data.item;
            const playback = formatMillisecondsToMinSec(response.data.progress_ms, response.data.item.duration_ms);
            playimg.value = response.data.item.album.images[0].url;

            return true;
        } else {
            // console.log('No track currently playing.');
            playData.value = 'No track currently playing.';
            playimg.value = '';
            return false;
        }
    } catch (error) {
        console.log(error.code);
        if (!error.message == "Network Error") {
            console.log('no internet');
            await WatchTokenExp()
        } else {
            // tokenExist.value = 'sessionExpired'
            await WatchTokenExp()
            return false;
        }
        return false;
    }
}

// get queue
async function getQueue() {
    try {
        const url = 'https://api.spotify.com/v1/me/player/queue';
        const accessToken = tokenExist.value; // Replace with the access token you obtained

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (response.status === 200) {
            // console.log(response.data.queue[0]);
            nextQueue.value = { name: `${response?.data?.queue[0].name}`, artist: `${response?.data?.queue[0].artists[0].name}`, nextimg: `${response?.data?.queue[0].album.images[2].url}`, length: `${((Math.floor(response?.data?.queue[0].duration_ms / 60000)) % 60).toString().padStart(2, '0')}:${((Math.floor(response?.data?.queue[0].duration_ms / 1000)) % 60).toString().padStart(2, '0')}` };
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

// Watch for changes in tokenExist to update currently playing and start interval
watch(() => tokenExist?.value, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        if (playInt) {
            clearInterval(playInt);
            clearInterval(TokenListen)
        }
        // checkCurrentlyPlaying();
        console.log('player started' + tokenExist.value);
        playInt = setInterval(async () => {
            await checkCurrentlyPlaying();
            if (tokenExist.value === 'sessionExpired') {
                clearInterval(playInt);
                console.log('player cleared');
                return false;
            }
        }, 3000);
    } else {
        console.log('no token, no player');
    }
});

// cover image
watch(() => playimg?.value, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        // console.log('Change image');
        coverimg.value = '';
        setTimeout(() => {
            coverimg.value = playimg.value;
        }, 200);
    }
});

// queue manage
watch(() => nextQueue?.value, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        // console.log('Change queue');
        setTimeout(() => {
            currQueue.value = nextQueue.value;
        }, 200);
    }
});

// token refresh
async function WatchTokenExp() {
    try {
        const response = await fetchWithAuth('https://api.spotify.com/v1/me');
        if (response.ok) {
            let token = await getAccessToken();
            tokenExist.value = token;
            // console.log('Token VALID :' + tokenExist.value);
            checkCurrentlyPlaying();
        } else {
            console.error('Failed to fetch new token:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
// WatchTokenExp();

onBeforeMount(async () => {
    try {
        // Initialize tokenExist.value here, assuming it's done somewhere in your code
        if (!tokenExist.value) {
            const TokenListen = setInterval(async () => {
                await WatchTokenExp();
                // console.log('interval');
                if (tokenExist.value) {
                    clearInterval(TokenListen);
                    // console.log('INTERVAL cleared');
                    return false;
                }
            }, 4000);
        }
    } catch (error) {
        console.error('Error during mount:', error);
    }
});

const fullPlayer = ref(false)
const miniPlayer = ref(true)

const toggleMiniplayer = () => {
    fullPlayer.value = !fullPlayer.value
    miniPlayer.value = !miniPlayer.value
}
</script>
<template>
    <v-dialog v-model="fullPlayer" :fullscreen="true" :hide-overlay="true" :opacity="0" close-delay="10000"
        :close-on-back="true" transition="dialog-bottom-transition" class="bg-zinc-950 bg-opacity-80 backdrop-blur-sm">
        <div v-if="playData == 'No track currently playing.'" class="flex justify-around w-full p-4">
            <p class="p-3 text-lg">Playing now:</p>
            <v-btn icon @click="toggleMiniplayer" variant="text" :ripple="false" class="m-2 ms-16 me-5">
                <v-icon>mdi-chevron-down</v-icon> </v-btn>
        </div>
        <v-lazy name="fade" mode="out-in" v-if="playData && playimg && tokenExist">
            <v-img id="playCover" :src="coverimg ? coverimg : ''" cover max-height="auto" min-height="600"
                gradient="to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)),linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4)),linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)"
                class="h-screen min-h-screen max-h-screen transform transition-all ease-in-out duration-1000 fade-in">
                <div class="play text-center min-h-screen">

                    <div class="content">
                        <div class="flex justify-end w-full p-1">
                            <p class="p-3 text-lg my-auto">Playing now:</p>
                            <v-btn icon @click="toggleMiniplayer" variant="text" :ripple="false"
                                class="m-2 ms-14 ame-5 w-fit">
                                <v-icon size="40">mdi-chevron-down</v-icon> </v-btn>
                        </div>

                        <v-lazy>
                            <!-- <v-transition name="fade" mode="out-in"> -->
                            <v-img :src="playimg ? playimg : ''" max-width="100%" max-height="100%"
                                class="m-2 mx-auto rounded-sm w-10/12"></v-img>
                            <!-- </v-transition> -->
                        </v-lazy>
                        <p class="font-bold text-xl max-w-80 mx-auto mt-5">{{ playData?.name }}</p>
                        <p class="opacity-70 m-1 inline-block" v-for="(artist, index) in playData.artists" :key="index">
                            {{
                                artist.name }}</p>
                        <p class="opacity-85   m-0.5">
                            on {{ (playData?.album?.name).length > 31 ?
                                (playData?.album?.name).slice(0, 40) + '...' : (playData?.album?.name) }}
                        </p>
                        <div class="w-72 mx-auto mt-3">
                            <v-progress-linear v-model="progress" :height="2" color="secondary"></v-progress-linear>
                        </div>
                        <div class="time flex w-[20rem]   mx-auto justify-between">
                            <p class="p-2">{{ startTime }}</p>
                            <p class="p-2">{{ endTime }}</p>
                        </div>

                        <div v-if="currQueue"
                            class="queue mx-auto flex flex-col justify-center p-5 min-h[6.8rem] h-[6.8rem] bga-white">
                            <p class="font-bold mb-">Next:</p>
                            <v-lazy>
                                <div class="next max-w-96 mx-auto flex justify-between min-h[4.25rem] h-[4.25rem]">
                                    <v-img :src="currQueue ? currQueue.nextimg : ''" min-width="60" max-width="60"
                                        max-height="60" class="m-1 rounded-sm"></v-img>
                                    <div class="title min-w-fit">
                                        <p class="px-2 mt-2 my-auto max-w-72 mx-auto">{{ (currQueue?.name).length > 22 ?
                                            (currQueue?.name).slice(0, 22) + '...' : (currQueue?.name) }}
                                        </p>
                                        <p class="opacity-70 mxa-1 inline-block my-auto mx-auto w-fit">by
                                            {{ (currQueue?.artist) }}
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
    </v-dialog>
    <v-bottom-navigation v-if="playData && playimg && tokenExist" @click="toggleMiniplayer" permanenta min-height="auto"
        height="90" transition="dialog-bottom-transition" class="bg-transparent bg-opacity-50 backdrop-blur-2xl w-full">
        <v-sheet :absolute="true" min-height="auto" height="auto" class="bg-transparent w-full" v-model="miniPlayer"
            transition="dialog-bottom-transition">
            <v-progress-linear v-model="progress" :height="3" color="secondary"></v-progress-linear>

            <div class="content flex w-full mx-auto">
                <div class="queue mx-auto flex flex-col justify-center w-full p-a5 min-h[6.8ream] h-[6a.8rem]">
                    <v-lazy>
                        <div class="next max-w-96 mx-auto flex justify-start ">
                            <v-img :src="playimg ? playimg : ''" min-width="70" max-width="70" max-height="70"
                                class="m-1 rounded-sm"></v-img>
                            <div class="title text-[1rem] min-w-[12rem] w-fit text-left">
                                <p class="ml-2 mt-2 my-auto max-w-72 text-left font-semibold text-lg">{{
                                    (playData?.name)?.length > 20 ?
                                        (playData?.name).slice(0, 20) + '...' : (playData?.name) }}
                                </p>
                                <p class="opacity-70 ml-2 inline-block my-auto text-left w-full">
                                    {{ (playData?.album?.artists[0].name)?.length > 20 ?
                                        (playData?.album?.artists[0].name).slice(0, 20) + '...' :
                                        (playData?.album?.artists[0].name) }}
                                </p>
                            </div>
                            <p class="p-2 my-auto w-14 flex justify-end text-[0.8rem]">{{ endTime }}</p>
                        </div>
                    </v-lazy>
                </div>
                <v-btn variant="text" :ripple="false" max-width="40" min-width="30" class="m-2  aw-5">
                    <v-icon size="30">mdi-chevron-up</v-icon> </v-btn>
            </div>
        </v-sheet>
    </v-bottom-navigation>
    <!-- </v-bottom-sheet> -->


    <!-- 
    <template v-slot:append>
                        <v-btn icon="mdi-rewind" variant="text"></v-btn>

                        <v-btn class="mx-1" icon="mdi-pause" variant="text"></v-btn>

                        <v-btn class="m" icon="mdi-fast-forward" variant="text"></v-btn>
                    </template> -->
</template>
