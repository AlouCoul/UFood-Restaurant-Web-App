<template>
  <div class="container user-collection-container">
    <div class="row justify-content-center">

      <div v-if="collections.length === 0" class="text-center py-4">
        <p class="text-muted mb-3">You don't have any favorite collections.</p>
      </div>

      <div class="row d-flex justify-content-center">
        <CollectionCard
          v-for="(collection, index) in collections"
          :key="index"
          :collection="collection"
          :image="images[collection.restaurants[0]?.id] || fallbackImage"
          :mode="'real'"
          @updateCollectionName="handleUpdateCollectionName"
          @collectionDeleted="handleCollectionDeleted"
          :class="getCollectionNumber()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import CollectionCard from './CollectionCard.vue';
import { listeFavoritePoco } from '@/pocos/ListeFavoritePoco';

export default defineComponent({
  name: "UserCollection",
  props: {
    collections: {
      type: Array as PropType<listeFavoritePoco[]>,
      required: true
    },
    images: {
      type: Object as PropType<Record<string, string>>,
      required: true
    },
  },
  data() {
    return {
      fallbackImage: 'https://via.placeholder.com/150',
    };
  },
  components: {
    CollectionCard,
  },
  methods: {
    getCollectionNumber(){
      const val = this.collections.length
      switch(val){
        case 1:
          return ""; break;
        case 2:
          return "col-md-5"; break;
        default:
          return "col-xs-12 col-md-5 col-lg-3  my-3"; break;
      }

    },
    createCollection() {
      this.$emit('createCollection');
    },
    handleUpdateCollectionName({ id, name }: any) {
      this.$emit('updateCollection', { id, name });
    },
    handleCollectionDeleted(id: string) {
      this.$emit('deleteCollection', id);
    },
  }
});
</script>

<style scoped>
.user-collection-container {
  max-width: 1200px;
}

.user-collection-container .row {
  display: flex;
  flex-wrap: wrap;
}

.user-collection-container .col-12.col-md-4.my-3 {
  flex: 1 1 calc(100% / 4);
  max-width: 33.3333%;
}
</style>
