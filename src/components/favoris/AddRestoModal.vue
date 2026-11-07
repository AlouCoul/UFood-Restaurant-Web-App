<template>
  <div class="container">
    <v-card class="mx-auto" max-width="600">
      <div class="d-flex align-items-center justify-content-center">
        <v-btn rounded="xl" size="large" @click="openFavoriteListModal">Create Collection</v-btn>
      </div>
      <p class="error" style="height: 25px;">{{ selectionMessage }}</p>
      <v-container class="pa-8" style="height:50vh; overflow-y: scroll;">
        <v-item-group v-model="selection" multiple>
          <v-row>
            <v-col v-for="(item, i) in items" :key="i" cols="12" md="4">
              <v-item v-slot="{ isSelected, toggle }">
                <div v-if="item.restaurants && item.restaurants.length > 0">
                  <v-img
                    :src="images[item.restaurants[0].id] || fallbackImage"
                    class="text-right pa-2"
                    height="200"
                    cover
                    @click="toggle"
                  >
                    <v-btn :icon="isSelected ? 'mdi-check' : 'mdi-plus'"></v-btn>
                  </v-img>
                </div>
                <div v-else>
                  <v-img
                    :src="fallbackImage"
                    class="text-right pa-2"
                    height="200"
                    cover
                    @click="toggle"
                  >
                    No restaurant image
                    <v-btn :icon="isSelected ? 'bi bi-check-lg' : 'bi bi-plus-lg'"></v-btn>
                  </v-img>
                </div>
              </v-item>
              {{ item.name }}
            </v-col>
          </v-row>
        </v-item-group>
      </v-container>
    </v-card>
    <div class="row justify-content-end modal-footer">
      <span class="col-3">
        <v-btn color="secondary" class="full-width" @click="closeModal">Close</v-btn>
      </span>
      <span class="col-3">
        <v-btn color="primary" class="full-width" @click="submitForm">Submit</v-btn>
      </span>
    </div>
    <modal-component ref="favoriteListPopup" :id="'favorite_list_popup'" :labeled-by="'favoriteListPopupLabel'" :title="'Create a new List'">
      <CreateFavoriteListForm :userId="store.currentUser.id" :ownerEmail="store.currentUser.email"
                              @close="closeFavoriteListModal"
                              @submit="addFavoriteList"/>
    </modal-component>
  </div>
</template>

<script lang="ts">
import { getRestaurant } from '@/api/api';
import { addRestoCollection } from '@/api/api';
import { listeFavoritePoco } from '@/pocos/ListeFavoritePoco';
import { addFavoriteToList, createFavoriteList, store } from '@/store/store';
import { defineComponent } from 'vue';
import ModalComponent from '../shared/ModalComponent.vue';
import CreateFavoriteListForm from './CreateFavoriteListForm.vue';

export default defineComponent({
  name: 'AddRestoModal',
  props: {
    restoId:{
      type: String,
      required: false,
      default: "",
    },
    items: {
      type: Array as () => listeFavoritePoco[],
      required: false,
      default: () => [],
    },
  },
  components:{
    ModalComponent,
    CreateFavoriteListForm
  },
  data() {
    return {
      store:store as any,
      selection: [] as any,
      images: {} as Record<string, string>,
      fallbackImage: '',
      selectionMessage: '',
    };
  },
  mounted() {
    this.loadImages(this.items);
    this.selection = [];
  },
  watch: {
    items: {
      immediate: true,
      handler(newItems) {
        this.loadImages(newItems);
      },
    },
  },
  methods: {
    openFavoriteListModal() {
      (this.$refs.favoriteListPopup as typeof ModalComponent).openModal();
    },
    closeFavoriteListModal() {
      (this.$refs.favoriteListPopup as typeof ModalComponent).closeModal();
    },
    addFavoriteList(newList : any) {
      createFavoriteList(newList);
    },
    async loadImages(items: listeFavoritePoco[]) {
      for (let item of items) {
        if (item.restaurants && item.restaurants.length > 0) {
          const restaurantId = item.restaurants[0].id;
          try {
            const restaurant = await getRestaurant(restaurantId);
            this.images[restaurantId] = restaurant.pictures[0];
          } catch (e) {
            console.error("Erreur lors du chargement de l'image du restaurant:", e);
          }
        }
      }
    },
    async addSelectedToCollection() {
      console.log(this.selection);
      try {
        for (const index of this.selection) {
          const response = await addRestoCollection(this.restoId, this.items[index].id);
          addFavoriteToList(this.items[index].id, {id: this.restoId});
          console.log("okayyy", response);
        }
        console.log("All selected items added to the collection successfully!");
      } catch (error) {
        console.error("Error adding items to the collection:", error);
      }
    },
    closeModal() {
      this.$emit("close");
    },
    async submitForm() {
      if (!this.validateForm()) return;
      else{
        await this.addSelectedToCollection();
        this.$emit('submit', {selection: this.selection});
      }
    },
    validateForm(): boolean{
      return this.validateSelection();
    },

    validateSelection(): boolean{
      let val = true;
      this.selectionMessage = ""
      if (this.selection.length === 0){
        val = false;
        this.selectionMessage = "Selection cannot be empty please chose or create multiple favorite liste";
      }
      return val;
    }
  },
  emits: ['submit', 'close'],
});
</script>
