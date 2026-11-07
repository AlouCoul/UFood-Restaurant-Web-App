<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <router-link class="nav-link" :to="`/`">UFood</router-link>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-if="isLoggedIn" class="nav-item">
            <p class="nav-username">{{ store.currentUser.name ? store.currentUser.name.replace(/["']/g, '') : 'Guest' }}
            </p>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="`/`">Home Page</router-link>
          </li>
          <li class="nav-item dropdown">
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>
        </ul>

        <!-- Container for User Profile and SearchBar -->
        <div class="d-flex align-items-center">
          <ul class="utilisateur navbar-nav mb-2 mb-lg-0">
            <li v-if="!isLoggedIn" class="nav-item">
              <router-link class="nav-link" :to="`/login`">Login</router-link>
            </li>
            <li v-if="isLoggedIn" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                User Profile
              </a>
              <ul class="dropdown-menu">
                <li><router-link :to="{ name: 'User', params: { id: store.currentUser.id } }" class="dropdown-item">User Profile</router-link></li>
                <li><a class="dropdown-item" href="#" @click="handleLogout">Sign out</a></li>
              </ul>
            </li>
          </ul>
          <!-- SearchBar Component -->
          <div class="search-bar-container ms-3">
            <SearchBar mode="navigate" />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { logout, store } from '@/store/store';
import SearchBar from './SearchBar.vue';

export default {
  components: {
    SearchBar
  },
  data() {
    return {
      store // This imports the entire reactive store
    };
  },
  methods: {
    async handleLogout() {
      try {
        await logout();
        window.location.reload();
      } catch (e) {
        console.error(e);
      }
      this.$router.push('/');
    }
  },
  computed: {
    // Directly use the reactive properties from store
    isLoggedIn() {
      console.log(this.store.currentUser)
      return !!this.store.currentUser && !!this.store.currentUser.name;
    }
  }
};
</script>

<style>
.nav-username {
  padding-top: 8px;
  padding-left: 10px;
  padding-right: 30px;
  margin-bottom: 0px;
}

.utilisateur {
  margin-right: 20px;
}

.search-bar-container {
  display: flex;
  align-items: center;
}
</style>
