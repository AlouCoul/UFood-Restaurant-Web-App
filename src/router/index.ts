import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import Restaurant from "@/pages/restaurants/Restaurant.vue";
import User from "@/pages/user/User.vue";
import TestUser from "@/pages/user/TestUser.vue"; // Importer le nouveau TestUser
import TestModal from "@/pages/Test/TestModal.vue";
import Collection from "@/pages/collection/Collection.vue";
import Login from "@/pages/authentication/Login.vue";
import Signup from "@/pages/authentication/Signup.vue";


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/restaurant/:id",
    name: "Restaurant",
    component: Restaurant,
  },
  {
    path: "/user/:id",
    name: "User",
    component: User,
  },
  {
    path: "/favorites/:id",
    name: "Favorite",
    component: Collection,
  },
  {
    path: "/test",
    name: "TestModal",
    component: TestModal,
  },
  
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
