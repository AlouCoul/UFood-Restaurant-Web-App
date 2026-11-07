<template>
    <div style="height: 500px; overflow-y: scroll;">
        <div class="mb-5 sticky-top"><SearchBar mode="filter" @filter-query="filterRestaurants"></SearchBar></div>
        <FollowRow v-for="follow in liste" :key="follow.id" :user_name="follow.name" :user_email="follow.email">
            <!--À changer pour mettre l'un des boutons dédié à la s'abonner ou se désabonner-->
            <v-btn>
                Abonné
            </v-btn>
        </FollowRow>
    </div>
</template>
<script  lang="ts">
import { Follow } from '@/pocos/UserPoco';
import { defineComponent } from 'vue';
import FollowRow from './FollowRow.vue';
import SearchBar from '../shared/SearchBar.vue';

export default defineComponent({
    props:{
        mode:{
            type: String,
            required: true,
        },
        liste:{
            type: Array as () => Follow[],
            required: true,
        },
    },
    components:{
        FollowRow,
        SearchBar,
    },
    methods:{
        closeModal(){
            this.$emit('close');
        }
    }

})
</script>
<style>
    
</style>