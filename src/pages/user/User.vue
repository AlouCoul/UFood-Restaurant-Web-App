<template>
  <div class="container" v-if="isLoggedIn">
    <!-- User Profile -->
    <div class="d-flex justify-content-center mt-3 mb-5">
      <img :src="getGravatarURL(user.email)" alt="Profile Picture" class="img-fluid rounded-circle border border-secondary shadow-sm"
        style="width: 150px; height: 150px;" />
    </div>


    <div class="row mb-2">
      <div class="col-md-9 mx-3">
        <h1 class="display-4 fw-bold mb-3">{{ user!!.name?.replace(/["']/g, '') || 'No User' }}</h1>
        <p class="fs-5">Email: {{ user!!.email?.replace(/["']/g, '') || 'No email' }}</p>
        <p class="fs-5">Score: {{ user!!.rating || 0 }}</p>
        <div class="row">
          <v-btn class="col-md-6 btn" @click="openFollowModal('followers')">
            <p>Followers: {{ user!!.followers?.length || 0 }}</p>
          </v-btn>
          <v-btn class="col-md-6 btn" @click="openFollowModal('following')">
            <p>Followings: {{ user!!.following?.length || 0 }}</p>
          </v-btn>
        </div>


        <div v-if="userId === store.currentUser?.id" class="d-flex flex-column mt-4 gap-2">
          <button type="button" class="btn btn-success px-4"
            style="background-color: #E2850B; border:none; max-width: 225px;">Edit Profile</button>
          <button type="button" class="btn btn-warning text-white px-4"
            style="background-color: #999999; border:none; max-width: 225px;" @click="openFavoriteListModal">Create a
            New List</button>
        </div>

        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>

        <div class="mt-4">
          <h1 class="lead fw-bold fs-5">Visits & Favorites</h1>
        </div>
      </div>
    </div>

    <!-- Tabs for Visits and Collections -->
    <v-card>
      <v-tabs v-model="tab" align-tabs="center" class="card-header bg-dark text-white text-center">
        <v-tab value="visits">Visits</v-tab>
        <v-tab v-if="userId === store.currentUser?.id" value="collections">Favorites</v-tab>
      </v-tabs>
      <v-card-text class="card-body overflow-auto" style="max-height: 600px;">
        <v-tabs-window v-model="tab" class="d-flex justify-content-center align-items-center">
          <v-tabs-window-item value="visits" v-if="tab == 'visits'">
            <PaginationComponent :length="2" @page-changed="handleChangedPage">
              <UserRestaurant :model="visits" />
            </PaginationComponent>
          </v-tabs-window-item>
          <v-tabs-window-item value="collections" v-if="tab == 'collections'">
            <UserCollection :collections="user_collections" :images="images" @updateCollection="handleCollectionUpdate"
              @deleteCollection="handleCollectionDelete" />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>

    <!-- Modal for Favorite List Creation -->
    <modal-component ref="favoriteListPopup" :id="'favorite_list_popup'" :labeled-by="'favoriteListPopupLabel'" :title="'Create a new List'">
      <CreateFavoriteListForm :userId="user!!.id" :ownerEmail="user!!.email" @close="closeFavoriteListModal" @submit="addFavoriteList" />
    </modal-component>
    <modal-component ref="followModalPopup" :id="'follow_popup'" :labeled-by="'followPopupLabel'" :title="getModeFollow().toUpperCase()">
      <FollowsList :mode="getModeFollow()" :liste="followList" @close="closeFollowModal"></FollowsList>
    </modal-component>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { createFavoriteList, deleteLocalCollection, store, updateLocalCollectionName, userCollections } from '@/store/store';
import { VisitPoco } from '@/pocos/VisitPoco';
import UserRestaurant from './UserRestaurant.vue';
import UserCollection from './UserCollection.vue';
import CreateFavoriteListForm from '@/components/favoris/CreateFavoriteListForm.vue';
import ModalComponent from '@/components/shared/ModalComponent.vue';
import { getRestaurant, getUser as apiGetUser, getRestaurantsVisitedByUser, getVisit } from '@/api/api';
import { listeFavoritePoco } from '@/pocos/ListeFavoritePoco';
import FollowsList from '@/components/follow/FollowsList.vue';
import { Follow } from '@/pocos/UserPoco';
import { User } from '@/store/Users';
import PaginationComponent from '@/components/shared/PaginationComponent.vue';
import md5 from 'md5';

export default defineComponent({
  data() {
    return {
      store: store,
      profile_pic: "https://i.postimg.cc/yYQyLzbj/UFOOD-removebg-preview-ezgif-com-crop.png",
      isFavoriteModalVisible: false,
      editingListId: null,
      errorMessage: "",
      visits: [] as Array<VisitPoco>,
      tab: ref("visits"),
      images: {} as Record<string, string>,
      modeFollow: '',
      followList: [] as Follow[],
      users: [] as Array<User>,
      user: {} as User,
      currentUser: {} as User,
      isCurrentUser: false, //Cette variable servira à desactiver certains boutons (Ex: Edit) quand on est sur la page d'un autre User
      nbPage: 0,
      userId: this.$route.params.id as string
    };
  },
  components: {
    UserRestaurant,
    UserCollection,
    CreateFavoriteListForm,
    ModalComponent,
    FollowsList,
    PaginationComponent
  },
  computed: {
    isLoggedIn() {
      return !!store.currentUser;
    },
    user_collections() {
      return this.user.favorites || [];
    },
  },
  async mounted() {
    [this.visits, this.nbPage] = await getRestaurantsVisitedByUser(this.userId);
    console.log(this.visits)
    if (store.currentUser) {
      this.fetchData();
    } else {
      this.$router.push('/');
    };
    this.users = store.users.map(user => ({ ...user, name: user.name.replace(/"/g, '') }));
   
  },
  beforeMount() {
    this.getUser(this.$route.params.id as string);
    // this.user.updateUserFavorites();
    // this.user.updateUserVisits();    
  },
  methods: {
    getGravatarURL(email: string): string {
      if (!email) {
        return "https://www.gravatar.com/avatar/?d=mp";
      }
      const hash = md5(email.trim().toLowerCase());
      return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
    },
    async handleChangedPage(page: number) {
      [this.visits, this.nbPage] = await getRestaurantsVisitedByUser(store.currentUser!.id, page);
    },
    openFavoriteListModal() {
      (this.$refs.favoriteListPopup as typeof ModalComponent).openModal();
    },
    closeFavoriteListModal() {
      (this.$refs.favoriteListPopup as typeof ModalComponent).closeModal();
    },
    handleCollectionUpdate({ id, name }: any) {
      updateLocalCollectionName(id, name);
    },
    handleCollectionDelete(id: string) {
      deleteLocalCollection(id);
    },
    addFavoriteList(newList: any) {
      createFavoriteList(newList);
    },
    openFollowModal(mode: string) {
      this.setModeFollow(mode);  // Set mode and followList
      (this.$refs.followModalPopup as typeof ModalComponent).openModal();
    },
    closeFollowModal() {
      (this.$refs.followModalPopup as typeof ModalComponent).closeModal();
    },
    setModeFollow(mode: string){
      this.modeFollow = mode;
      this.followList = (mode == 'followers') ? (this.user?.followers as Follow[]) : (this.user?.following as Follow[]);
    },
    getModeFollow(){
      return this.modeFollow;
    },
    async fetchData() {
      try {
        if (this.isLoggedIn) {          
          //this.visits = await getRestaurantsVisitedByUser(this.user.id);
          this.user_collections = userCollections || [];
          await this.loadImages(this.user_collections);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async loadImages(collections: listeFavoritePoco[]) {
      for (let collection of collections) {
        const restaurantId = collection.restaurants[0]?.id;
        if (restaurantId) {
          try {
            const restaurant = await getRestaurant(restaurantId);
            if (restaurant?.pictures?.length) {
              this.images[restaurantId] = restaurant.pictures[0];
            }
          } catch (e) {
            console.error("Error loading restaurant image:", e);
          }
        }
      }
    },

    async getUser(id: string) {
      // const userData = this.users.find(user => user.id === id);
      const userData = await apiGetUser(id);

      if (userData) {
        this.user = new User(
          userData.id,
          userData.email,
          userData.name,
          userData.rating,
          userData.favorites,
          userData.visits,
          userData.followers,
          userData.following);
      }
      else { console.error('User not found'); }      

      if (this.user.id === store.currentUser?.id) {
        this.isCurrentUser = true;
      } else {
        this.isCurrentUser = true;
      }

    }
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.getUser(this.$route.params.id as string);
      },
      immediate: true,
    },
  },
});
</script>