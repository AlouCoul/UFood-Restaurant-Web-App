<template>
    <div v-if="isSearchBarActive" class="search-bar" ref="searchBar">
        <div class="input-group">
            <div v-if="mode === 'navigate'" class="d-flex align-items-center mt-1">
                <label class="form-check-label mr-2" for="searchOptions">Search by:</label>
                <div class="form-check form-check-inline d-flex align-items-center">
                    <input class="form-check-input mt-0 mr-1" type="radio" v-model="searchOption" id="restoOption"
                        value="searchByResto" >
                    <label class="form-check-label" for="restoOption">Restaurant</label>
                </div>
                <div v-if="isAuth" class="form-check form-check-inline d-flex align-items-center">
                    <input class="form-check-input mt-0 mr-1" type="radio" v-model="searchOption" id="userOption"
                        value="searchByUser">
                    <label class="form-check-label" for="userOption">User</label>
                </div>
            </div>

            <input type="text" v-model="searchQuery" @input="handleInput" @focus="clearTimeoutAndShowSuggestions"
                @blur="hideSuggestionsAfterDelay" class="form-control me-2" :placeholder=searchPlaceHolder />
            <button v-if="mode === 'navigate'" @click="goTosearch" class="btn btn-outline-success">Go</button>

        </div>
        <!-- Menu déroulant pour les suggestions -->
        <ul v-if="mode === 'navigate' && filteredRestaurants.length && searchQuery" class="list-group position-absolute"
            @mouseleave="hideSuggestionsAfterDelay">
            <li v-for="restaurant in filteredRestaurants" :key="restaurant.id" @click="selectRestaurant(restaurant)"
                class="list-group-item list-group-item-action">
                {{ restaurant.name }}
            </li>
        </ul>
        <ul v-if="isAuth && mode === 'navigate' && filteredUsers.length && searchQuery" class="list-group position-absolute"
            @mouseleave="hideSuggestionsAfterDelay">
            <li v-for="user in filteredUsers" :key="user.id" @click="selectUser(user)"
                class="list-group-item list-group-item-action">
                {{ user.name }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { getRestaurants } from '@/api/api';
import { RestaurantPoco } from '@/pocos/RestaurantPoco';
import { UserPoco } from '@/pocos/UserPoco';
import { defineComponent } from 'vue';
import { store, userCollections } from '@/store/store';
import { User } from '@/store/Users';
import Cookies from 'js-cookie';

export default defineComponent({
    props: {
        mode: {
            type: String,
            required: true,
            validator: (value: string) => ['filter', 'navigate'].includes(value),
        }
    },
    data() {
        return {
            searchQuery: '',            
            restaurants: [] as Array<RestaurantPoco>,
            filteredRestaurants: [] as Array<RestaurantPoco>,
            selectedRestaurant: null as RestaurantPoco | null,
            users: [] as Array<User>,
            filteredUsers: [] as Array<User>,
            selectedUser: null as User | null,
            timeoutId: null as number | null, // ID pour le setTimeout
            searchOption: 'searchByResto' as 'searchByResto' | 'searchByUser'
        };
    },
    computed: {
        isSearchBarActive(): boolean {
            return !(this.mode === 'navigate' && this.$route.path === '/');
        },
        searchPlaceHolder(): string {
            return (this.searchOption === "searchByResto") ? "Find a restaurant..." : "Find a user..."
        },
        isAuth(): boolean {
            return !!Cookies.get('user_profile_cookie');
        }
    },
    methods: {
        handleInput() {
            this.filteredUsers = [];
            this.filteredRestaurants = [];
            if (this.mode === 'filter') {
                this.$emit('filter-query', this.searchQuery);
            }
            if (this.mode === 'navigate') {
                if (this.searchOption === 'searchByResto') {

                    this.filteredRestaurants = this.restaurants?.filter(restaurant =>
                        restaurant.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                    );
                } else {
                    this.filteredUsers = this.users?.filter(user =>
                        user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                    );
                }

            }
        },
        selectRestaurant(restaurant: RestaurantPoco) {
            this.selectedRestaurant = restaurant;
            this.searchQuery = restaurant.name;
            this.filteredRestaurants = [];
        },
        selectUser(user: User) {
            this.selectedUser = user;
            this.searchQuery = user.name;
            this.filteredUsers = [];
        },
        goTosearch(): void {
            if (this.selectedRestaurant) {
                // this.selectedUser = null;
                this.$router.push({ name: 'Restaurant', params: { id: String(this.selectedRestaurant.id) } });
                this.searchQuery = '';
                this.selectedRestaurant = null;
            } else if (this.selectedUser) {
                // this.selectedRestaurant = null;
                this.$router.push({ name: 'User', params: { id: String(this.selectedUser.id) } });
                this.searchQuery = '';
                this.selectedUser = null;
            } else {
                alert("Veuillez faire une selection valide.");
            }
        },
        clearTimeoutAndShowSuggestions() {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            // Afficher les suggestions
            this.filteredRestaurants = this.restaurants.filter(restaurant =>
                restaurant.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );

        },
        hideSuggestionsAfterDelay() {
            // Masquer les suggestions après 5 secondes
            this.timeoutId = window.setTimeout(() => {
                this.filteredRestaurants = [];
                if (this.mode === 'navigate') {
                    this.searchQuery = ''
                }
            }, 5000);
        }
    },
    async mounted() {
        [this.restaurants] = await getRestaurants();
        this.users = store.users.map(user => ({ ...user, name: user.name.replace(/"/g, '') }));
    },
    beforeUnmount() {
        if (this.timeoutId) clearTimeout(this.timeoutId);
    },
    watch: {
        searchOption() { // Reset nos menus déroulants et la recherche this.searchQuery = '';
            this.filteredRestaurants = []; 
            this.filteredUsers = [];
            this.searchQuery = '';
        }
    }


});
</script>

<style scoped>
.search-bar {
    display: flex;
    align-items: center;
    position: relative;
}

.list-group {
    z-index: 1000;
    top: 50px;
}
</style>
