<template>
    <div class="col-12">
      <div class="card rounded-5 p-3 py-2">
        <div class="card-body">
          <h2 class="card-title">Related Restaurants</h2>
        </div>
  
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-2 justify-content-center">
          <div
            class="col"
            v-for="restaurant in similarRestaurants"
            :key="restaurant.id"
          >
            <div
              class="card rounded-4 p-2"
              style="cursor: pointer"
              @click="
                $router.push({
                  name: 'Restaurant',
                  params: { id: restaurant.id },
                })
              "
            >
              <img
                :src="restaurant.pictures[0] || 'default-image.jpg'"
                class="card-img-top object-fit-cover rounded-4 position-relative"
                style="aspect-ratio: 1/1"
                alt="restaurant thumbnail"
                draggable="false"
              />
              <div class="card-body pt-1 pb-1 pe-1 ps-0 text-truncate">
                <div class="d-flex justify-content-between">
                  <div class="text-truncate fw-bold" style="overflow: hidden">
                    <span>{{ restaurant.name }}</span>
                  </div>
                  <span class="ps-2" style="white-space: nowrap">
                    {{ roundRating(restaurant.rating) }}
                    <i class="fa-solid fa-star fa-sm"></i>
                  </span>
                </div>
  
                <div class="d-flex justify-content-between">
                  <div class="text-truncate" style="overflow: hidden">
                    {{
                      restaurant.genres
                        .map((genre) => genre.charAt(0).toUpperCase() + genre.slice(1))
                        .join(", ")
                    }}
                  </div>
                  <span class="ps-2" style="white-space: nowrap">
                    <i
                      v-for="icon in restaurant.priceRange"
                      :key="icon"
                      class="fa-solid fa-dollar-sign"
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import { RestaurantPoco } from "@/pocos/RestaurantPoco";
  
  export default defineComponent({
    name: "SimilarRestaurants",
    props: {
      similarRestaurants: {
        type: Array as () => RestaurantPoco[],
        required: true,
      },
    },
    methods: {
      roundRating(rating: number): string {
        return (Math.round(rating * 10) / 10).toFixed(1);
      },
    },
  });
  </script>
  
  <style scoped>
  .card {
    transition: transform 0.2s ease;
  }
  
  .card:hover {
    transform: scale(1.05);
  }
  
  .card-img-top {
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 0.75rem;
  }
  </style>
  