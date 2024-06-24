<script setup>

// data
const expanded = ref(false);
const cc = ref("4333-3387-8788-6620");
const expdate = ref("06/15");
const cvv = ref("123");
const rules = [
    (value) => {
        if (value) return true;
        return 'required';
    },
];

// Card format
const formatcard = () => {
    cc.value = cc.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1-').slice(0, 19)
}
//expiration date Format 
const formatexp = () => {
    expdate.value = expdate.value.replace(/\D/g, '').replace(/^(.{2})(.{1,})$/, '$1/$2').slice(0, 5);
};

// CVV Format
const formatcvv = () => {
    cvv.value = cvv.value.replace(/\D/g, '').slice(0, 3);;
};
</script>
<template>
    <div>
        <div class="creditCard" v-if="expanded">
            <v-row>
                <v-col cols="12" md="12">
                    <v-text-field v-model="cc" @input="formatcard" :rules="rules" outlined
                        label="Credit Card Number"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="expdate" @input="formatexp" :rules="rules" outlined
                        label="Exp date"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="cvv" @input="formatcvv" :rules="rules" outlined
                        label="Security code/CVV"></v-text-field>
                </v-col>
            </v-row>
        </div>
    </div>
</template>