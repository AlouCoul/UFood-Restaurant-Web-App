<template>
  <div>
    <div class="container my-5" id="collectionRibbon">
      <div class="row">
        <div class="col-12 col-md-4 d-flex flex-wrap">
          <div
            v-for="(resto, index) in restaurants.slice(0, 4)"
            :key="index"
            :class="getImageClass(restaurants.length)"
          >
            <img
              class="img-fluid rounded shadow-sm restaurant-thumbnail"
              :src="resto.pictures[0]"
              alt="Restaurant image"
            />
          </div>
        </div>
        <div class="col-md-7 col-12" id="ribbon_infos">
          <p class="text-muted">Collection</p>
          <div id="collection_name">
            <h1 class="display-4">{{ collection?.name || "No name" }}</h1>
          </div>
          <div id="collection_details" class="mt-3">
            <div v-if="collection?.owner">
              <h4>{{ collection.owner.name || 'No Owner' }}</h4>
              <p>{{ restoCount }} elements</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container" id="resto_collection_list">
      <TableauFavoris
        :restaurants="restaurants"
        :collection-id="collectionId"
        @restoDeleted="handleRestoDeleted"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { getFavoriteById, getRestaurant } from '@/api/api';
import TableauFavoris from '@/components/favoris/TableauFavoris.vue';
import { defineComponent } from 'vue';

interface Owner {
  id: string;
  name: string | '';
  email?: string;
}
interface Resto {
  id: string | '';
  name: string;
  pictures: string[];
  genres: string[];
  priceRange: number;
}
interface ListeFavoriteProps {
  id: string;
  name?: string;
  owner: Owner;
  restaurants: Resto[];
}

export default defineComponent({
  components: {
    TableauFavoris,
  },
  data() {
    return {
      collection: {} as ListeFavoriteProps | null,
      restaurants: [] as any[],
      collectionId: '',
      restoCount: 0 as number
    };
  },
  methods: {
    getImageClass(count: number) {
    // Controls layout based on the number of images
    if (count === 1) return "col-12 single-image";
    if (count === 2) return "col-6 two-images";
    return "col-6 four-images";
    },
    async getCollectionInfos(collectionId: string) {
      try {
        this.collectionId = collectionId;
        const data = await getFavoriteById(collectionId);
        this.collection = data;
        if (this.collection?.restaurants) {
          this.getRestoInfos(this.collection.restaurants);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations de collection:', error);
      }
    },
    async getRestoInfos(restos: { id: string }[]) {
      try {
        const tempArray = [];
        for (const resto of restos) {
          const data = await getRestaurant(resto.id);
          tempArray.push(data);
        }
        this.restaurants = tempArray;
        this.restoCount = tempArray.length
      } catch (e) {
        console.error('An error occurred:', e);
      }
    },
    handleRestoDeleted(restoId: string) {
      this.restaurants = this.restaurants.filter(
        (resto: Resto) => resto.id !== restoId
      );
    },
    handleRestaurantCount(count: number) {
      return count > this.restaurants.length
    },


  },
  mounted() {
    const collectionId = this.$route.params.id as string;
    this.getCollectionInfos(collectionId);
  },
  watch: {
      restaurants(newRestaurants) {
      this.restoCount = newRestaurants.length; // Mettez à jour restoCount à chaque changement de restaurants
    },
    
      },
      
  },
);
</script>

<style scoped>
.restaurant-thumbnail {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
#collectionRibbon {
  margin-top: 20px;
  color: #000;
}
#ribbon_infos h1 {
  font-size: 2.5rem;
}
#collection_details h4 {
  font-size: 1.25rem;
  color: #333;
}

</style>
