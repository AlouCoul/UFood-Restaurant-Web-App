<template>
  <div class="container mb-5">
    <section id="ribbon" class="mb-4">
      <RestoRibbon :resto="resto" />
    </section>

    <div class="container d-flex justify-content-center">
      <div class="row">
        <div class="col-md-8 col-12">
          <section id="type" class="mb-5">
            <h3 class="pb-3">Type</h3>
            <div class="row g-2">
              <div
                v-for="(type, index) in resto.genres"
                :key="index"
                class="col-md-4 col-9 d-flex align-items-center p-2 border rounded type_value"
              >
                <i class="bi bi-search me-2 fs-4"></i>
                <p class="mb-0 text-muted fs-5">{{ type }}</p>
              </div>
            </div>
          </section>

          <hr />
          <section id="posts" class="mb-5">
            <h3 class="pb-3">Posts</h3>
            <div class="row g-3" style="max-height: 80vh; overflow: auto;">
              <div
                v-for="(image, index) in resto.pictures"
                :key="index"
                class="col-12 col-lg-6"
              >
                <img :src="image" class="img-fluid rounded post-image">
              </div>
            </div>
          </section>
          <hr />

          <section id="location_schedule" class="mb-5">
            <h3 class="pb-3">Location & Schedule</h3>
            <div class="row">
              <div class="col-lg-7 col-12 mb-3">
                <div class="card">
                  <div class="card-body p-3">
                    <RestaurantMap 
                      :latitude="resto.location?.coordinates[1]" 
                      :longitude="resto.location?.coordinates[0]" 
                      :name="resto.name"
                    />
                  </div>
                </div>
              </div>
              <div class="col-lg-5 col-12">
                <Schedule :resto-hours="resto.openingHours" />
              </div>
            </div>
          </section>
        </div>

        <section class="col-md-4 d-none d-md-block">
          <div class="sticky-top p-3 border rounded bg-light shadow-sm">
            <h5>Information on {{ resto.name }}</h5>
            <div class="my-3">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-telephone-fill me-2 fs-4"></i>
                <a :href="`tel:${resto.tel}`" class="text-decoration-none">{{ resto.tel }}</a>
              </div>
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-geo-alt-fill me-2 fs-4"></i>
                <a href="#location_schedule" class="text-decoration-none">{{ resto.address }}</a>
              </div>
              <div v-if="isAuth" class="d-flex align-items-center add_collection_button" @click="openModal('add_resto', restoId)">
                <i class="bi bi-heart-fill me-2 fs-4"></i>
                <p class="mb-0">Add To Favorites</p>
              </div>
            </div>
            <button v-if="isAuth" class="btn btn-dark w-100 mt-2" style="background-color: #E2850B; border:none;" @click="openVisitPopup(restoId)">Rate this restaurant</button>
          </div>
        </section>

        <section class="col-md-4 d-md-none">
          <div class="fixed-bottom border rounded-top bg-white p-3" id="infos_important_cell" style="padding: 1vh; border-radius: 15px 15px 0 0;">
            <div>
              <div class="row">
                <i class="bi bi-telephone-fill col-2" style="font-size: 25px;"></i>
                <p class="col-10 mt-2"><a :href="`tel:${resto.tel}`">{{ resto.tel }}</a></p>
              </div>
              <div class="row">
                <i class="bi bi-geo-alt-fill col-2"></i>
                <p class="col-10"><a href="#location_schedule">{{ resto.address }}</a></p>
              </div>
              <div class="row add_collection_button" @click="openModal('add_resto', restoId)" style="cursor: pointer;">
                <i class="bi bi-heart-fill col-2" style="font-size: 2rem;"></i>
                <div class="col-10 mt-2"><p>Add To Favorites</p></div>
              </div>
            </div>
          </div>
        </section>
        <!-- Modals -->
        <modal-component ref="addRestoPopup" :id="'add_resto_popup'" :labeled-by="'popupTest'" :title="'Add'">
          <AddRestoModal1 :resto-id="currentRestaurantId" :items="user_collections" @close="closeModal('add_resto')" @submit="closeModal('add_resto')"></AddRestoModal1>
        </modal-component>
        <modal-component ref="ratingPopup" :id="'popup'" :labeled-by="'popupTest'" :title="'Visited form'">
          <visited-form :see-restaurant="false" :user-id="store.currentUser.id" :restaurant-id="currentRestaurantId" @submitted="closeModal('visit')" @closed="closeModal('visit')"></visited-form>
        </modal-component>

        <section id="similar-restaurants" class="mb-5">
          <SimilarRestaurants :similar-restaurants="similarRestaurants" />
        </section>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SimilarRestaurants from '@/components/shared/SimilarRestaurants.vue';
import { getRestaurant, getSimilarRestaurants } from '@/api/api';
import RestoRibbon from '@/components/ribbon/RestoRibbon.vue';
import Schedule from './Schedule.vue';
import RestaurantMap from '@/components/shared/RestaurantMap.vue';
import ModalComponent from '@/components/shared/ModalComponent.vue';
import { store, userCollections } from '@/store/store';
import AddRestoModal1 from '@/components/favoris/AddRestoModal.vue';
import VisitedForm from '@/components/shared/VisitedForm.vue';
import { RestaurantPoco } from '@/pocos/RestaurantPoco';
import Cookies from 'js-cookie';

export default defineComponent({
  components: {
    RestaurantMap,
    RestoRibbon,
    Schedule,
    ModalComponent,
    AddRestoModal1,
    VisitedForm,
    SimilarRestaurants,
  },
  
  data() {
    return {
      store: store as any,
      currentRestaurantId: '',
      slidesPerView: 3,
      similarRestaurants: [] as RestaurantPoco[],
      resto: {} as RestaurantPoco,
      swiper: null as any,
      directionsService: null as any, 
      directionsRenderer: null as any,
      user_collections: userCollections,
      restoId: "",
    };
  },
  methods: {
    async fetchSimilarRestaurants() {
  if (this.resto.genres && this.resto.genres.length > 0) {
    this.similarRestaurants = await getSimilarRestaurants(this.resto.genres, this.resto.id);
  }
},
    async getResto(restoId: string) {
      this.restoId = restoId;
      const resto = await getRestaurant(restoId);
      this.resto = resto;
      await this.fetchSimilarRestaurants();
    },
    openModal(type: string, restoId: string = "") {
      if (type==="visited"){
          (this.$refs.ratingPopup as typeof ModalComponent).openModal();
      }
      if (type==="add_resto"){
          this.currentRestaurantId = restoId;
          (this.$refs.addRestoPopup as typeof ModalComponent).openModal();
      }
    },
    closeModal(type: string) {
        if (type === "add_resto") {
            (this.$refs.addRestoPopup as typeof ModalComponent).closeModal();
        }

        if(type === 'visit') {
            (this.$refs.ratingPopup as typeof ModalComponent).closeModal();
        }
    },
    submitForm(type: string) {
        if (type === "add_resto") {
            (this.$refs.addRestoPopup as typeof ModalComponent).submitForm();
        }
    },
    openVisitPopup(restaurantId: string) {
        this.currentRestaurantId = restaurantId;
        (this.$refs.ratingPopup as typeof ModalComponent).openModal();
    },
  },
  computed: {
    isAuth(): boolean {
            return !!Cookies.get('user_profile_cookie');
        }
  },
  mounted() {
    this.getResto(this.$route.params.id as string);
  },
  beforeDestroy() {
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.getResto(this.$route.params.id as string);
      },
      immediate: true,
    },
  },
});
</script>

<style scoped>
.type_value {
  transition: transform 0.2s ease;
}
.type_value:hover {
  transform: scale(1.05);
}

.post-image {
  object-fit: cover;
  height: 40vh;
  transition: transform 0.3s ease;
}
.post-image:hover {
  transform: scale(1.05);
}

.add_collection_button {
  cursor: pointer;
  transition: color 0.2s ease;
}
.add_collection_button:hover {
  color: #dc3545;
}
</style>
