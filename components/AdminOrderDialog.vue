<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme();

const dialog = ref(false)
</script>
<template>
    <div class="pa-4 text-center">
        <v-dialog v-model="dialog" close-delay="0" :opacity="0" class="bg-zinc-950 bg-opacity-80 backdrop-blur-sm"
            max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
                <!-- <v-btn  @click="viewOrder(index)"  class="text-none font-weight-regular"  text="Edit Profile"
                    variant="tonal" ></v-btn> -->

                <v-btn variant="outlined" elevation="1" prepend-icon="mdi-account" text="View" v-bind="activatorProps"
                    max-height="40"></v-btn>
            </template>

            <v-card prepend-icon="mdi-truck" title="Order Details">
                <!-- <v-table height="fit" fixed-header density="default"
                    :theme="theme.global.current.value.dark ? 'dark' : 'light'">
                    <thead>
                        <tr>
                            <th class="text-left">
                                Order no.
                            </th>
                            <th class="text-left">
                                Order Details.
                            </th>
                            <th class="text-left">
                                Details
                            </th>
                            <th class="text-left">
                                Status
                            </th>
                            <th class="text-left">
                                At
                            </th>
                            <th>Track</th>
                        </tr>
                    </thead> -->
                <!-- <tbody class="text-left">
                        <tr v-for="(order, index) in OrderItems" :key="index" class="h-20">
                            <td class="max-w-44 text-sm">{{ order.order_no }}</td>
                            <td class="max-w-40 text-sm">
                                <p v-for="(p, index) in order.order_details[0].items" :key="index"
                                    class="w-1 flex flex-col">
                                    {{ p.selectedOption ? p.selectedOption : 'no specific details' }}</p>
                            </td>
                            <td class="min-w-72">
                                <div class="flex w-full">
                                    <v-img :src="JSON.parse(order.order_details[0].items[0].product.image)[0]"
                                        class="my-auto" max-width="65" min-width="65" max-height="50" cover></v-img>
                                    <p class="ml-2 my-auto underline">{{ order.order_details[0].items[0].product.name
                                        }}
                                        (#{{ order.order_details[0].items[0].product.id }})
                                    </p>
                                </div>
                            </td>
                            <td class="min-w-40">{{ order.order_status[0].status }}</td>
                            <td class="min-w-32">{{ new Date(order.created_at).toLocaleString('en-US') }}</td>
                            <td>
                                <AdminOrderDialog />
                            </td>
                        </tr>
                    </tbody> -->
                <!-- </v-table> -->
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="4" sm="6">
                            <v-text-field label="First name*" required></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field hint="example of helper text only on focus"
                                label="Middle name"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field hint="example of persistent helper text" label="Last name*" persistent-hint
                                required></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field label="Email*" required></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field label="Password*" type="password" required></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field label="Confirm Password*" type="password" required></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*" required></v-select>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-autocomplete
                                :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                                label="Interests" auto-select-first multiple></v-autocomplete>
                        </v-col>
                    </v-row>

                    <small class="text-caption text-medium-emphasis">*indicates required field</small>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

                    <v-btn color="secondary" text="Save" variant="tonal" @click="dialog = false"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>