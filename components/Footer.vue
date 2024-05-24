<template>
    <v-card tile flat rounded="lg" class="pa-md-10 pa-5 text-center" color="surface">
        <h2 class="text-md font-weight-bold">Alfa Store Ltd</h2>
        <p class="text-md mt-5 mb-2">Store by</p>
        <p class="text-md mt-4 mb-2">ZiadSalhin@github</p>
        <p class="my-auto mb-5 opacity-75">Follow me: <a href="https://github.com/zeiadsalhin">
                <v-icon icon="mdi-github" size="large"
                    class="my-auto brightness-50 hover:brightness-200 transform transition ease-in-out duration-100"></v-icon>
            </a>
        </p>
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
