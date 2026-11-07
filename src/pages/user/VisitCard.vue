
<template>
    <div class="visit-item card shadow-sm mb-4">
      <div class="card-body text-center">
        <!-- Restaurant Title and Rating -->
        <div class="card-title h5">{{ restaurant.name }}</div>
        <div class="d-flex justify-content-between">
          <span class="fs-6">{{ visit.date.toLocaleDateString() }}</span>
          <span>{{ "⭐".repeat(visit.rating%5) || "⭐".repeat(5) }}</span>
        </div>  
        <!-- Restaurant Image -->
        <div class="restaurant-image-container mb-3">
          <img v-if="restaurant.pictures" :src="restaurant.pictures[0]" :alt="restaurant.name" class="restaurant-image img-fluid rounded" />
        </div>
  
        <!-- Action Button -->
        <button class="btn btn-dark w-100 mt-3" @click="openVisitPopup()">See Rating</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { getRestaurant } from './../../api/api';
  import { RestaurantPoco } from '@/pocos/RestaurantPoco';
  import { VisitPoco } from '@/pocos/VisitPoco';
  
  export default defineComponent({
  name: 'VisitedForm',
    data() {
        return {
            restaurant: {} as RestaurantPoco
        };
    },
    props: {
        visit: {
            type: Object as PropType<VisitPoco>,
            required: true
        },
    },
    methods: {
        openVisitPopup() {
            this.$emit('clicked');
        },
        async getRestaurant() {
            this.restaurant = await getRestaurant(this.visit.restaurantId);
        }
    },
    mounted() {
        this.getRestaurant();
    },
    emits: [
        'clicked',
    ]
  });
  </script>
  
  <style scoped>
  .visit-item {

    max-width: 100%; 
    margin-bottom: 20px; 
    margin: 5px;
  }
  .restaurant-image-container {
    width: 100%;
    height: 200px;
    overflow: hidden;
  }
  .restaurant-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
  </style>
  