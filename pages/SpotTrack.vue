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

// // Simulate progress update (replace with your actual logic)
// watchEffect(() => {
//     const currentTotalSeconds = Math.floor(currentMilliseconds.value / 1000);
//     const totalTotalSeconds = Math.floor(totalMilliseconds.value / 1000);

//     if (totalTotalSeconds > 0) {
//         progress.value = (currentTotalSeconds / totalTotalSeconds) * 100;
//     } else {
//         progress.value = 0; // Handle division by zero or totalMilliseconds being zero
//     }
// });

// async function checkCurrentlyPlaying() {
//     try {
//         const url = 'https://api.spotify.com/v1/me/player/currently-playing';
//         const accessToken = tokenExist.value; // Replace with the access token you obtained
//         // console.log('PLAYING TOKEN : ' + tokenExist.value);
//         const response = await axios.get(url, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`
//             }
//         });
//         if (response.status === 200 && response.data.is_playing) {
//             // calculate duration 
//             function formatMillisecondsToMinSec(currentMilliseconds, totalMilliseconds) {
//                 const currentTotalSeconds = Math.floor(currentMilliseconds / 1000);
//                 const totalTotalSeconds = Math.floor(totalMilliseconds / 1000);

//                 const currentMinutes = Math.floor(currentTotalSeconds / 60);
//                 const currentSeconds = currentTotalSeconds % 60;

//                 const totalMinutes = Math.floor(totalTotalSeconds / 60);
//                 const totalSeconds = totalTotalSeconds % 60;

//                 const currentFormatted = `${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
//                 const totalFormatted = `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
//                 startTime.value = currentFormatted;
//                 endTime.value = totalFormatted;
//                 return currentFormatted + totalFormatted;
//             }

//             //// Increment progress
//             currentMilliseconds.value = response.data.progress_ms;
//             totalMilliseconds.value = response.data.item.duration_ms;

//             playimg.value = '';
//             playData.value = response.data.item;
//             const playback = formatMillisecondsToMinSec(response.data.progress_ms, response.data.item.duration_ms);
//             playimg.value = response.data.item.album.images[0].url;

//             return true;
//         } else {
//             // console.log('No track currently playing.');
//             playData.value = 'No track currently playing.';
//             playimg.value = '';
//             return false;
//         }
//     } catch (error) {
//         console.log(error.code);
//         if (!error.message == "Network Error") {
//             console.log('no internet');
//             await WatchTokenExp()
//         } else {
//             // tokenExist.value = 'sessionExpired'
//             await WatchTokenExp()
//             return false;
//         }
//         return false;
//     }
// }

// // get queue
// async function getQueue() {
//     try {
//         const url = 'https://api.spotify.com/v1/me/player/queue';
//         const accessToken = tokenExist.value; // Replace with the access token you obtained

//         const response = await axios.get(url, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`
//             }
//         });
//         if (response.status === 200) {
//             // console.log(response.data.queue[0]);
//             nextQueue.value = { name: `${response?.data?.queue[0].name}`, artist: `${response?.data?.queue[0].artists[0].name}`, nextimg: `${response?.data?.queue[0].album.images[2].url}`, length: `${((Math.floor(response?.data?.queue[0].duration_ms / 60000)) % 60).toString().padStart(2, '0')}:${((Math.floor(response?.data?.queue[0].duration_ms / 1000)) % 60).toString().padStart(2, '0')}` };
//         }
//     } catch (error) {
//         console.log('Queue: ' + error);
//     }
// }

// // Watch for changes in playData to call changeQueue
// watch(() => playData?.value?.name, (newVal, oldVal) => {
//     if (newVal !== oldVal) {
//         getQueue();
//     }
// });

// // Watch for changes in tokenExist to update currently playing and start interval
// watch(() => tokenExist?.value, (newVal, oldVal) => {
//     if (newVal !== oldVal) {
//         if (playInt) {
//             clearInterval(playInt);
//         }
//         // checkCurrentlyPlaying();
//         console.log('player started' + tokenExist.value);
//         playInt = setInterval(async () => {
//             await checkCurrentlyPlaying();
//             if (tokenExist.value === 'sessionExpired') {
//                 clearInterval(playInt);
//                 console.log('player cleared');
//                 return false;
//             }
//         }, 3000);
//     } else {
//         console.log('no token, no player');
//     }
// });

// // cover image
// watch(() => playimg?.value, (newVal, oldVal) => {
//     if (newVal !== oldVal) {
//         // console.log('Change image');
//         coverimg.value = '';
//         setTimeout(() => {
//             coverimg.value = playimg.value;
//         }, 200);
//     }
// });

// // queue manage
// watch(() => nextQueue?.value, (newVal, oldVal) => {
//     if (newVal !== oldVal) {
//         // console.log('Change queue');
//         setTimeout(() => {
//             currQueue.value = nextQueue.value;
//         }, 200);
//     }
// });

// // token refresh
async function WatchTokenExp() {
    try {
        const response = await fetchWithAuth('https://api.spotify.com/v1/me');
        if (response.ok) {
            let token = await getAccessToken();
            tokenExist.value = token;
            // console.log('Token VALID :' + tokenExist.value);
            // checkCurrentlyPlaying();
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
        // Example: tokenExist.value = await fetchToken();
        if (!tokenExist.value) {
            // tokenExist.value = await getAccessToken();
            await WatchTokenExp();
        }
    } catch (error) {
        console.error('Error during mount:', error);
    }
});

// authorize spotify user 
const router = useRouter();
const authorize = () => {
    const client_id = '4a730932376f4ea693ed8077c3be587d';
    const redirect_uri = process.env.NODE_ENV === 'production'
        ? 'https://alfastorecommerce.netlify.app/callback'
        : 'http://localhost:3000/callback'; // Replace with your registered redirect URI

    const scope = 'user-read-currently-playing user-read-playback-state'; // Specify scopes as needed

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scope)}`;

    // Redirect user to Spotify authorization page
    navigateTo(authUrl, { external: true });
};
onMounted(() => {
    setTimeout(() => {
        document.getElementById("aaa").classList.remove('translate-y-10');
        document.getElementById("aaa").classList.add('-translate-y-10');
        // Apply the Tailwind CSS class

    }, 200);
})
</script>
<template>
    <div>
        <v-img id="aaa" src="/wallpaper.jpeg" cover max-height="auto" min-height="100" height="auto"
            gradient="to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)),linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.1)),linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.6)"
            class="aaa translate-y-10  h-screen min-h-screen max-h-screen transform transition-all ease-in-out duration-1000 fade-in">
            <div v-if="tokenExist == null" class="flex flex-col justify-center items-center h-screen w-full">

                <div class="images flex justify-center space-x-4">
                    <v-img src="/my-spoti-white.svg" max-width="150" max-height="150" min-width="150" min-height="150"
                        class="pa-3 my-auto"></v-img>
                    <svg class="my-auto" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        version="1.1" width="25" height="25" viewBox="0 0 256 256" xml:space="preserve">
                        <defs>
                        </defs>
                        <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 1; fill: none; fill-rule: nonzero; opacity: 0.7;"
                            transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                            <path
                                d="M 41.242 69.371 l -8.953 8.954 c -0.288 0.287 -0.627 0.331 -0.803 0.331 c -0.176 0 -0.515 -0.044 -0.803 -0.332 L 11.676 59.317 c -0.443 -0.443 -0.443 -1.163 0 -1.606 l 24.98 -24.98 c 0.288 -0.288 0.626 -0.331 0.802 -0.331 h 0 c 0.176 0 0.515 0.043 0.803 0.331 l 16.362 16.362 l 8.025 -8.025 L 46.287 24.707 c -4.869 -4.869 -12.789 -4.868 -17.657 0 L 3.65 49.686 c -4.867 4.868 -4.867 12.789 0 17.656 l 19.007 19.007 c 2.434 2.434 5.631 3.65 8.828 3.65 c 3.197 0 6.394 -1.217 8.827 -3.65 l 13.961 -13.961 C 50.063 74.716 46.357 73.631 41.242 69.371 z"
                                style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 1; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;"
                                transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                            <path
                                d="M 48.758 20.629 l 8.953 -8.954 c 0.288 -0.287 0.627 -0.331 0.803 -0.331 c 0.176 0 0.515 0.044 0.803 0.332 l 19.007 19.007 c 0.443 0.443 0.443 1.163 0 1.606 l -24.98 24.98 c -0.288 0.288 -0.626 0.331 -0.802 0.331 h 0 c -0.176 0 -0.515 -0.043 -0.803 -0.331 L 35.377 40.907 l -8.025 8.025 l 16.362 16.361 c 4.869 4.869 12.789 4.868 17.657 0 l 24.98 -24.979 c 4.867 -4.868 4.867 -12.789 0 -17.656 L 67.342 3.651 C 64.908 1.217 61.711 0 58.514 0 c -3.197 0 -6.394 1.217 -8.827 3.65 L 35.725 17.611 C 39.937 15.284 43.643 16.369 48.758 20.629 z"
                                style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 1; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;"
                                transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                        </g>
                    </svg>
                    <v-img src="/public/spotify.svg" max-width="80" max-height="80" min-width="80" min-height="80"
                        class="my-auto brightness-75 invert"></v-img>
                </div>

                <h1 class="text-[2rem] font-black p-3">Welcome to My Spoti !</h1>
                <p class="text-lg text-center font-semibold mt-3 p-3">To Start the App please Connect your Spotify
                    Account
                </p>
                <p class="text- text-center font-semibold mt-3 mb-6">Click the button below to authorize your Spotify
                    account.
                </p>
                <button @click="authorize"
                    class="bg-zinc-800 p-4 font-semibold focus:ring-4 ring-green-700 focus:scale-105 text-md rounded-3xl"
                    variant="tonal" rounded="xl">Authorize
                    Spotify</button>
            </div>
        </v-img>
        <!-- <div v-if="!playData && tokenExist" class="flex justify-center items-center min-h-screen">
            <v-progress-circular color="grey-darken-1" indeterminate class="my-auto"></v-progress-circular>
        </div> -->
        <Swipe>
            <slot />
        </Swipe>
        <!-- <div v-else class="text-center">{{ playData }}</div> -->
    </div>
</template>
