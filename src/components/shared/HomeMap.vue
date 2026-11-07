<template>
    <div>
      <div ref="mapContainer" id="map"></div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { RestaurantPoco } from '@/pocos/RestaurantPoco';
  
  export default defineComponent({
    name: 'HomeMap',
    props: {
      Lesrestaurants: {
        type: Array as () => Array<RestaurantPoco>,
        required: true,
      },
    },
  
    data() {
      return {
        mapContainer: null as HTMLElement | null,
        map: null as google.maps.Map | null,
        markers: [] as google.maps.Marker[],
      };
    },
  
    methods: {
      initMap() {
        if (this.Lesrestaurants.length === 0 || typeof google === 'undefined') {
          return;
        }
  
        const firstRestaurant = this.Lesrestaurants[0];
        const centerLocation = new google.maps.LatLng(
          firstRestaurant.location.coordinates[1], 
          firstRestaurant.location.coordinates[0]
        );
  
        this.map = new google.maps.Map(this.$refs.mapContainer as HTMLElement, {
          center: centerLocation,
          zoom: 10,
        });
  
        this.Lesrestaurants.forEach(restaurant => {
          const restaurantLocation = new google.maps.LatLng(
            restaurant.location.coordinates[1], 
            restaurant.location.coordinates[0]
          );
  
          const marker = new google.maps.Marker({
            position: restaurantLocation,
            map: this.map,
            title: restaurant.name + "--" + restaurant.genres,
          });

          marker.addListener('click', () => {
            this.$router.push(`/restaurant/${restaurant.id}`);
          });
  
          this.markers.push(marker);
        });
      },
    },
  
    mounted() {
      if (typeof google !== 'undefined') {
        this.initMap();
      }
    },

    watch: {
      Lesrestaurants: {
      deep: true,
      handler() {
          if (typeof google !== 'undefined') {
          this.initMap();
          }
    }
    }
    },
  });
  </script>
  
  <style scoped>
  #map {
    width: 100%;
    height: 100vh;
  }
  </style>