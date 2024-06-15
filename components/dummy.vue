<template>
    <div class="mt-20 p-5 w-fit mx-auto      ">
        <div class="icon flex justify-center p-5"><v-icon size="50">mdi-shield-account</v-icon></div>
        <p class="font-semibold md:text-3xl text-2xl">Welcome, {{ name }}</p>
        <!-- <p class="mt-10">Last login: {{ signin.slice(0, 19).replace('T', ' ') }}</p> -->
        <v-btn @click="LogOut" min-height="40" min-width="120" class="m-5 mx-auto" color="grey-darken-3">Logout</v-btn>
    </div>
    <div class="w-fit dark: md:p-10 p-5 text-center mx-auto "
        :class="theme.global.current.value.dark ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-black'">

        <div class="h-1 w-full bg-zinc-950 mb-5 mt-5"></div>
        <div class="products space-y-5 md:p-5">
            <h1 class="text-3xl">Start managing products</h1>
            <p class="p-5 text-2xl">Add product</p>
            <Addproduct />
        </div>
    </div>


</template>