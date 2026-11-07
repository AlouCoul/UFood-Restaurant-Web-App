
<template>
  <div class="container user-restaurant-container">
    <div class="row justify-content-center">
      <!-- Empty State Message -->
      <div v-if="model.length === 0" class="col-12 col-md-6 text-center py-4 border border-secondary rounded bg-light shadow-sm">
        <p class="text-muted mb-3">You haven't visited any restaurants.</p>
        <button class="btn btn-warning" @click="Home">Return to the Home Page</button>
      </div>

      <div v-if="model.length < 3" class="row d-flex justify-content-center">
        <visit-card
          v-for="(visit, index) in model"
          :key="index"
          :visit="visit"
          @clicked="openVisitPopup(visit)"
          class="col-md-5"
        />
      </div>

      <!-- Visit Cards -->
      <div v-else class="row d-flex justify-content-center">
        <visit-card
          v-for="(visit, index) in model"
          :key="index"
          :visit="visit"
          @clicked="openVisitPopup(visit)"
          class="col-xs-12 col-md-5 col-lg-3 my-3"
        />
      </div>

      <modal-component ref="ratingPopup" :id="'popup'" :labeled-by="'popupTest'" :title="'Visited form'">
        <visited-form
          :restaurant-id="currentVisit!.restaurantId"
          :visit-date="currentVisit!.date"
          :visit-rating="currentVisit!.rating"
          :visit-comment="currentVisit!.comment" 
          :is-readonly="true" 
          @submitted="closeModal"
          @closed="closeModal"
        />
      </modal-component>
    </div>
  </div>
</template>

<script lang="ts">
import ModalComponent from '@/components/shared/ModalComponent.vue';
import VisitedForm from '@/components/shared/VisitedForm.vue';
import { VisitPoco } from '@/pocos/VisitPoco';
import { defineComponent } from 'vue';
import VisitCard from './VisitCard.vue';
import { store } from '@/store/store';

export default defineComponent({
  name: "UserRestaurant",
  data() {
    return {
      currentVisit: null as VisitPoco | null,
      store: store as any,
    };
  },
  props: {
    model: {
      type: Array<VisitPoco>,
      required: true
    }
  },
  methods: {
    Home() {
      this.$router.push('/');
    },
    openVisitPopup(visit: VisitPoco) {
      this.currentVisit = visit;
      (this.$refs.ratingPopup as typeof ModalComponent).openModal();
    },
    closeModal() {
      (this.$refs.ratingPopup as typeof ModalComponent).closeModal();
    },
  },
  components: {
    ModalComponent,
    VisitedForm,
    VisitCard
  }
});
</script>

<style scoped>
.user-restaurant-container {
  max-width: 1200px;
}

.user-restaurant-container .row {
  display: flex;
  flex-wrap: wrap;
}

.user-restaurant-container .col-12.col-md-4.my-3 {
  flex: 1 1 calc(100% / 4);
  max-width: 33.3333%;
}

.btn-warning {
  background-color: #E2850B;
  border: none;
  color: white;
}
</style>
