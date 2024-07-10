<template>
    <div>
        <h1>Authorization Callback</h1>
        <p>Handling Spotify authorization...</p>
    </div>
</template>

<script setup>
import axios from 'axios';
import { Buffer } from 'buffer'

const route = useRoute();
const router = useRouter();
const client_id = '4a730932376f4ea693ed8077c3be587d';
const client_secret = '10253d2e780e4f71bb61a6da73241997';
const redirect_uri = 'http://localhost:3000/callback'; // Replace with your registered redirect URI
const scope = 'user-read-playback-state'
// const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');
const code = route.query.code;
const handleAuthorization = () => {
    const state = generateRandomString(16); // Function to generate a random state string

    const authorizationUrl = `https://accounts.spotify.com/authorize?` +
        `response_type=code` +
        `&client_id=${client_id}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
        `&state=${state}`

    // Redirect the user to the Spotify authorization URL
    navigateTo(authorizationUrl, { external: true });
    return
};
onMounted(() => {
    handleAuthorization()
})
</script>