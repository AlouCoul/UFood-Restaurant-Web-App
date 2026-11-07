<template>
  <div class="collection-item card shadow-sm mb-4">
    <div class="card-body text-center">
      <!-- Collection Title with Edit Option -->
      <div v-if="!isEditing" class="card-title h5">{{ editedName }}</div>
      <input
        v-if="isEditing"
        v-model="editedName"
        type="text"
        class="form-control mb-3"
        placeholder="Edit Name"
      />

      <!-- Collection Image -->
      <div class="collection-image-container mb-3">
        <img v-if="image" :src="image" :alt="editedName" class="collection-image img-fluid rounded" />
      </div>

      <!-- Action Buttons for Managing Collection -->
      <div class="d-flex justify-content-center gap-2">
        <button v-if="!isEditing" @click="startEditing" class="btn btn-success btn-sm">
          <i class="bi bi-pencil-square me-1"></i>Edit
        </button>
        <button v-if="isEditing" @click="saveCollectionName" class="btn btn-primary btn-sm">
          Save
        </button>
        <button v-if="isEditing" @click="cancelEditing" class="btn btn-secondary btn-sm">
          Cancel
        </button>
        <button @click="deleteCollection" class="btn btn-danger btn-sm">
          <i class="bi bi-trash-fill me-1"></i>Delete
        </button>
      </div>

      <!-- Open Collection Button -->
      <button class="btn btn-dark mt-3 mb-1 w-100" @click="openCollectionPage">
        View Collection
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { listeFavoritePoco } from '@/pocos/ListeFavoritePoco';
import { deleteFavoriteListAPI, updateFavoriteListAPI } from '@/api/api';

export default defineComponent({
  
  name: "Collection_Card",
  props: {
    collection: {
      type: Object as PropType<listeFavoritePoco>,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    mode: {
      type: String as PropType<'real' | 'test'>,
      default: 'test'
    }
  },
  data() {
    return {
      isEditing: false,
      editedName: this.collection.name,
      errorMessage: "",
    };
  },
  
  methods: {
    openCollectionPage() {
      this.$router.push(`/favorites/${this.collection.id}`);
    },
    startEditing() {
      this.isEditing = true;
      this.editedName = this.collection.name;
    },
    async saveCollectionName() {
      this.errorMessage = "";
      if (!this.editedName?.trim()) {
        this.errorMessage = "Le nom de la liste ne peut pas être vide.";
        return;
      }
      try {
        if (this.mode === 'real') {
          await updateFavoriteListAPI(this.collection.id, this.editedName);
          this.$emit("updateCollectionName", { id: this.collection.id, name: this.editedName });
        }
        this.$emit("updateCollectionName", { id: this.collection.id, name: this.editedName });
        this.isEditing = false;
      } catch (error) {
        this.errorMessage = "Erreur lors de la mise à jour de la liste.";
      }
    },
    cancelEditing() {
      this.isEditing = false;
      this.editedName = this.collection.name;
      this.errorMessage = "";
    },
    async deleteCollection() {
      this.errorMessage = "";
      try {
        if (this.mode === 'real') {
          await deleteFavoriteListAPI(this.collection.id);
          this.$emit("collectionDeleted", this.collection.id);
        }
        this.$emit("collectionDeleted", this.collection.id);
      } catch (error) {
        this.errorMessage = "Erreur lors de la suppression de la liste.";
      }
    }
  },


}
);

</script>

<style scoped>
.collection-item {
  max-width: 100%; 
  margin-bottom: 20px; 
  margin: 5px;
}

.collection-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.collection-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}
</style>
