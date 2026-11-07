<template>
    <div class="container my-5 p-4 bg-light rounded shadow">
        <h1 class="text-center display-4 text-dark mb-5">Ufood</h1>

        <div class="row mb-5 gy-2">
            <form>
                <div class="form-check form-switch">
                    <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="customSwitch1" 
                        v-model="toggleState"
                    >
                    <label class="form-check-label" for="customSwitch1">Map View</label>
                </div>
            </form>
            <p>Toggle state: {{ toggleState }}</p>
            <!-- Search Bar -->
            <div class="row justify-content-center mb-4">
                <div class="col-md-6 col-lg-5">
                    <SearchBar mode="filter" @filter-query="filterRestaurants" />
                </div>
            </div>
        </div>

        <!-- Filter Section -->
        <div class="row mb-5 gy-3">
            <div class="col-md-6">
                <label for="priceRange" class="form-label fw-bold">Filter by price range:</label>
                <select v-model="selectedPrice" class="form-select shadow-sm">
                    <option value="all">All price ranges</option>
                    <option value="1">$</option>
                    <option value="2">$$</option>
                    <option value="3">$$$</option>
                </select>
            </div>

            <div class="col-md-6">
                <label for="genre" class="form-label fw-bold">Filter by food type:</label>
                <select v-model="selectedGenre" class="form-select shadow-sm">
                    <option value="all">All types</option>
                    <option v-for="genre in genresList" :key="genre">{{ genre }}</option>
                </select>
            </div>
        </div>
        <pagination-component :length="nbPage" @page-changed="handleChangedPage">
            <div v-if="matchedRestaurants.length">
                <div v-if="toggleState">
                    <HomeMap :Lesrestaurants="matchedRestaurants" />
                </div>
                <div class="row" v-else>
                    <div class="col-md-6 col-lg-4 mb-4" v-for="restaurant in matchedRestaurants" :key="restaurant.id">
                        <div class="card h-100 border-0 shadow-sm rounded-3">
                            <img :src="restaurant.pictures[0]" class="card-img-top rounded-top" :alt="restaurant.name" style="object-fit: cover; height: 200px;">
                            <div class="card-body bg-dark text-light text-center text-sm-2">
                                <div><h5 class="card-title fs-4 fs-md-5">{{ restaurant.name }}</h5></div>
                                <p class="card-text fs-6">Type: {{ restaurant.genres.join(', ') }}</p>
                                <p class="card-text fs-6">Price range: {{ '$'.repeat(restaurant.priceRange) }}</p>
                                <router-link :to="`/restaurant/${restaurant.id}`" class="btn btn-warning mt-3" style="background-color:#E2850B; border:none; color:white;">Go to restaurant page</router-link>
                            </div>
                            <div v-if="isAuth" class="d-flex justify-content-end p-2 rounded-bottom" style="background-color: #999999;">
                                <i v-if="store.currentUser" class="bi bi-blockquote-left me-3 text-light" @click="openVisitPopup(restaurant.id)" style="cursor: pointer; font-size: 1.2rem;"></i>
                                <i v-if="store.currentUser" class="bi bi-heart-fill text-light" @click="openModal('add_resto', restaurant.id)" style="cursor: pointer; font-size: 1.2rem;"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- When there is no matchs found -->
            </div>
            <div v-else class="text-center text-muted py-5 fs-4">
                No restaurants match the filters.
            </div>
        </pagination-component>


        <modal-component ref="ratingPopup" :id="'popup'" :labeled-by="'popupTest'" :title="'Visited form'">
            <visited-form :user-id="store.currentUser.id" :restaurant-id="currentRestaurantId"
                @submitted="closeModal('visit')" @closed="closeModal('visit')"></visited-form>
        </modal-component>
        <modal-component ref="addRestoPopup" :id="'add_resto_popup'" :labeled-by="'popupTest'" :title="'Add'">
            <AddRestoModal :resto-id="currentRestaurantId" :items="user_collections" @close="closeModal('add_resto')"
                @submit="closeModal('add_resto')"></AddRestoModal>
        </modal-component>

        
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModalComponent from '@/components/shared/ModalComponent.vue';
import VisitedForm from '@/components/shared/VisitedForm.vue';
import { RestaurantPoco } from '@/pocos/RestaurantPoco';
import AddRestoModal from '@/components/favoris/AddRestoModal.vue';
import SearchBar from '@/components/shared/SearchBar.vue';
import { store, userCollections } from '@/store/store';
import PaginationComponent from '@/components/shared/PaginationComponent.vue';
import HomeMap from '@/components/shared/HomeMap.vue';
import { getRestaurants } from '@/api/api';
import Cookies from 'js-cookie';

export default defineComponent({
    name: 'Home',
    components: {
        SearchBar,
        ModalComponent,
        VisitedForm,
        AddRestoModal,
        PaginationComponent,
        HomeMap
    },
    data() {
        return {
            store: store as any,
            searchQuery: '',
            selectedPrice: 'all',
            selectedGenre: 'all',
            restaurants: [] as Array<RestaurantPoco>,
            currentRestaurantId: '',
            genresList: [] as Array<string>,
            user_collections: userCollections,
            nbPage: 0,
            toggleState: false
        };
    },
    methods: {
        openVisitPopup(restaurantId: string) {
            this.currentRestaurantId = restaurantId;
            (this.$refs.ratingPopup as typeof ModalComponent).openModal();
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
        filterRestaurants(query: string) {
            this.searchQuery = query;
        },
        async handleChangedPage(page: number) {
            [this.restaurants, this.nbPage] = await getRestaurants(page);
        }
    },
    computed: {
        matchedRestaurants(): Array<RestaurantPoco> {
            let filteredRestaurants: Array<RestaurantPoco> = this.restaurants;

            return filteredRestaurants.filter((restaurant: RestaurantPoco) => {
                const matchesSearchName = restaurant.name
                    .toLowerCase()
                    .includes(this.searchQuery.toLowerCase());
                const matchesPrice =
                    this.selectedPrice === 'all' ||
                    restaurant.priceRange === parseInt(this.selectedPrice);
                const matchesGenre =
                    this.selectedGenre === 'all' ||
                    restaurant.genres.includes(this.selectedGenre);

                return matchesSearchName && matchesPrice && matchesGenre;
            });
        },
        isAuth(): boolean {
            return !!Cookies.get('user_profile_cookie');
        }
    },
    async mounted() {
        [this.restaurants, this.nbPage] = await getRestaurants();
        
        let genresSet = new Set<string>(); //Pour une liste des genres uniques

        this.restaurants.forEach((restaurant) => {
            restaurant.genres.forEach((genre) => {
                genresSet.add(genre);
            });
        });

        this.genresList = Array.from(genresSet);
    },
});
</script>

<style scoped>
.card-img-top {
    object-fit: cover;
}

.form-select:focus {
    border-color: #E2850B;
    box-shadow: 0 0 0 0.25rem rgba(226, 133, 11, 0.25);
}
</style>