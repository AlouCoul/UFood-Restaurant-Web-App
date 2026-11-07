<template>
  <div>
    <div ref="mapContainer" id="map" style="height: 30vh;"></div>
    <button class="btn btn-primary mt-3" style="background-color: #E2850B; border:none;" @click="calculateRoute">Itinerary</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RestaurantMap',
  props: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      mapContainer: null as HTMLElement | null,
      map: null as google.maps.Map | null,
      marker: null as google.maps.Marker | null,
      directionsService: null as google.maps.DirectionsService | null,
      directionsRenderer: null as google.maps.DirectionsRenderer | null,
    };
  },

  methods: {
    initMap() {
      const restaurantLocation = new google.maps.LatLng(this.latitude, this.longitude);
      // Initialize map
      this.map = new google.maps.Map(this.$refs.mapContainer as HTMLElement, {
        center: restaurantLocation,
        zoom: 15,
      });
      // Add restaurant marker
      this.marker = new google.maps.Marker({
        position: restaurantLocation,
        map: this.map,
        title: 'Restaurant Location',
      });
      // Initialize directions services
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);
    },

    calculateRoute() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const origin = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            const destination = new google.maps.LatLng(this.latitude, this.longitude);
            const request: google.maps.DirectionsRequest = {
              origin,
              destination,
              travelMode: google.maps.TravelMode.DRIVING,
            };

            if (this.directionsService && this.directionsRenderer) {
              this.directionsService.route(request, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                  this.directionsRenderer?.setDirections(result);
                } else {
                  alert('Error calculating route: ' + status);
                }
              });
            }
          },
          () => {
            alert("Unable to retrieve user's location.");
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },

    updateMap() {
      if (this.map && this.marker) {
        const newLocation = new google.maps.LatLng(this.latitude, this.longitude);
        this.map.setCenter(newLocation);
        this.marker.setPosition(newLocation);
      }
    },
  },

  mounted() {
    if (typeof google !== 'undefined') {
      this.initMap();
    }
  },

  watch: {
    latitude() {
      this.updateMap();
    },
    longitude() {
      this.updateMap();
    },
  },
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
