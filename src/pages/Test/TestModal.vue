<template>
<div>
    <button @click="openModal('add_resto')"> I AM HEREEEE</button>
      <modal-component ref="visitedPopup" :id="'visited_popup'" :labeled-by="'popupTest'" :title="'Visited form'">
      </modal-component>
      
      <modal-component ref="addRestoPopup" :id="'add_resto_popup'" :labeled-by="'addRestoTest'" :title="'Add Resto'">
        <addResto :items="liste.items" :selection="liste.selection" @close="closeModal" v-on:submit="submitForm"/>
      </modal-component>
</div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'; 
import { getUserFavorites } from '@/api/api';
import addResto from '@/components/favoris/AddRestoModal.vue';
import ModalComponent from '@/components/shared/ModalComponent.vue';

const user = {
  id: "5f9a05f36cd9e6000409a632",
  name: "\"Mr. Test\"",
  email: "\"test@email.com\"",
  rating: 100
};

const liste = ref({
  items: [],
  selection: [],
});

const visitedPopup = ref(); // Reference for the visited modal
const addRestoPopup = ref(); // Reference for the add resto modal

onMounted(async () => { 
  try {
    let user_collection = await getUserFavorites(user.id);
    liste.value.items = user_collection.items; // Update items
  } catch (e) {
    console.error(e);
  }
});

const openModal = (type: string) => {
  if (type === "visited" && visitedPopup.value) {
    visitedPopup.value.openModal(); // Open visited modal
  }
  if (type === "add_resto" && addRestoPopup.value) {
    addRestoPopup.value.openModal(); // Open add resto modal
  }
};

const closeModal = () => {
  (addRestoPopup.value as typeof ModalComponent).closeModal();
}
const submitForm = () =>{
  (addRestoPopup.value as typeof ModalComponent).submitForm();
}
</script>
