<template>
  <div class="table-responsive">
    <v-table height="500px" fixed-header style="overflow-y: scroll;">
      <table class="table">
        <thead class="table-dark">
          <tr>
            <th class="text-left">Name</th>
            <th class="text-center">Type</th>
            <th class="text-left">Price</th>
            <th class="text-right"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(resto, index) in restaurants"
            :key="index"
            id="restaurant_row"
            class="restaurant-row"
          >
            <td class="restaurant-image-container d-flex align-items-center">
              <div id="restaurant_image">
                <img
                  class="restaurant-image"
                  :src="resto.pictures[0]"
                  alt="Restaurant Image"
                />
              </div>
              <router-link
                :to="`/restaurant/${resto.id}`"
                class="restaurant-name"
              >
                {{ resto.name }}
              </router-link>
            </td>
            <td class="text-center">{{ resto.genres.join(', ') }}</td>
            <td class="text-left">{{ "$".repeat(resto.priceRange) }}</td>
            <td class="text-center">
              <i class="bi bi-trash-fill trash_icon" title="Remove" @click="deleteResto(resto.id)"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </v-table>
  </div>
</template>

<script lang="ts">
import { deleteRestoFromCollection } from '@/api/api';
import { RestaurantPoco } from '@/pocos/RestaurantPoco';
import { deleteRestaurantInCollection } from '@/store/store';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TableauFavoris',
  props: {
    restaurants: {
      type: Array as () => RestaurantPoco[],
      required: false,
      default: () => [],
    },
    collectionId: {
      type: String,
      required: true,
    },
  },
  methods: {
    async deleteResto(restoId: string) {
      try {
        await deleteRestoFromCollection(this.collectionId, restoId);
        deleteRestaurantInCollection(restoId, this.collectionId);
        this.$emit('restoDeleted', restoId);
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    },
  },
  
  emits: ['restoDeleted'],
});
</script>

<style scoped>
.table-responsive {
  overflow-x: ellipse;
}
.table {
  color: #000;
  background-color: #fff;
}

#restaurant_row{
  height: fit-content;
}
.restaurant-row {

  transition: background-color 0.3s ease;
  height: fit-content;
}
.restaurant-row:hover {
  background-color: #f5f5f5;
}

#restaurant_image{
  height: 50px;
  width: 50px;
}
#restaurant_image img{
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
}
.restaurant-name {
  font-weight: bold;
  text-decoration: none;
  color: #000;
}
.trash_icon {
  font-size: 1.2rem;
  color: transparent;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
}
.restaurant-row:hover .trash_icon {
  color: #ff0000;
  transform: scale(1.2);
}
</style>
