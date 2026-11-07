<template>
    <table>
        <thead>
            <tr>
            <th class="px-3" scope="col">Day</th>
            <th class="px-3" scope="col">Hours</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(hours, day) in restoHours" :key="day">
            <td class="px-3">{{ day }}</td>
            <td class="px-3">{{ hours || 'Closed' }}</td>
            </tr>
        </tbody>
    </table>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

    interface OpeningHours {
        [day: string]: string;
    }

    export default defineComponent({
        name:"Schedule",
        props:{
            restoHours:{
                type: {} as () => OpeningHours,
                required: false,
                default: () => {},
            }
        }
    })
</script>