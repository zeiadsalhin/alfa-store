<template>
    <v-card tile flat rounded="lg" class="pa-md-10 pa-5 text-center" color="surface">
        <h2 class="text-md font-weight-bold">Sheout shop</h2>
        <p class="text-md mt-5 mb-2">Sheout Site by</p>
        <p class="text-md mt-5 mb-2">Gehan Mohamed & Nourhan Alaa</p>
        <div class="text-center">
            <v-btn color="surface" class="mr-2" v-for="(b, i) in sm" :key="`sm${i}`" fab depressed>
                <v-icon>{{ b.icon }}</v-icon>
            </v-btn>
        </div>
        <br />
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            sm: [
                { icon: "mdi-facebook", link: "#" },
                { icon: "mdi-twitter", link: "#" },
                { icon: "mdi-instagram", link: "#" },
                { icon: "mdi-youtube", link: "#" },
            ],
        };
    },
};
</script>

<style></style>
