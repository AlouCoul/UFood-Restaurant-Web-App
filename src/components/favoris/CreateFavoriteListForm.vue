<template>
  <form class="container-fluid">
    <div class="row form-content">
      <span>
        <p class="error" v-if="listNameError">{{ listNameError }}</p>
        <label for="listName" class="form-label">List Name: </label>
        <input id="listName" v-model="listName" type="text" class="form-control" placeholder="Enter list name" />
      </span>
    </div>
    <div class="row justify-content-end form-footer">
      <span class="col-3">
        <button type="button" class="btn btn-secondary full-width" @click="closeModal">Close</button>
      </span>
      <span class="col-3">
        <button type="button" class="btn btn-primary full-width" @click="submitForm">Submit</button>
      </span>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createFavoriteListAPI } from '@/api/api';

export default defineComponent({
  name: 'CreateFavoriteListForm',
  data() {
    return {
      listNameError: '',
      listName: '',
    };
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
    ownerEmail: { 
      type: String,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async submitForm() {
      if (this.validateForm()) {  
        try {
          const newList = await createFavoriteListAPI(this.ownerEmail, this.listName);
          this.$emit('submit', newList);  
          this.closeModal(); 
        } catch (error) {
          console.error("Erreur lors de la création de la liste de favoris :", error);
        }
      }
    },
    validateForm(): boolean {
      this.listNameError = '';
      if (!this.listName) {
        this.listNameError = 'The list name cannot be empty.';
        return false;
      }
      return true;
    },
  },
  emits: ['close', 'submit', 'open'],
});
</script>

<style scoped>
.form-footer {
  padding-top: 10px;
  padding-bottom: 10px;
}

.full-width {
  width: 100%;
}

.error {
  color: red;
}
</style>
