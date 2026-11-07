import { computed, reactive, watch,  } from 'vue';
import { resto } from '@/pocos/ListeFavoritePoco';
import { listUsers, getUserFavorites, getRestaurants, getRestaurantsVisitedByUser, getUser, logoutUser } from '../api/api';
import { User } from './Users';
import { VisitPoco } from '@/pocos/VisitPoco';
import { RestaurantPoco } from '@/pocos/RestaurantPoco';
import { UserPoco } from '@/pocos/UserPoco';


// Initialisation des données utilisateurs et restaurants
export let users = await listUsers();
const [restaurantsList]: [Array<RestaurantPoco>, number] = await getRestaurants();


// Store réactif
export const store = reactive({
    users: users as User[],
    currentUser: null as User | null,
    restaurantsList: restaurantsList
});

// Fonction pour mettre à jour le localStorage avec les favoris de l'utilisateur
function updateUser() {
    if (store.currentUser) {
        store.currentUser.saveToLocalStorage();
    }
}

// Fonction de connexion de l'utilisateur
export async function loginUser(email: string): Promise<boolean> {
    users = await listUsers();
    const foundUser = store.users.find((u: User) => u.email === email);
    console.log("Found User: " + foundUser)
    if (foundUser) {
        console.log("Found User IN: " + foundUser);
        const user: UserPoco = await getUser(foundUser.id);
        
        const userFavorites = await getUserFavorites(user.id);
        const [userVisits] = await getRestaurantsVisitedByUser(user.id);
        store.currentUser = new User(user.id, user.email, user.name, user.rating, userFavorites, userVisits, user.followers, user.following);
        store.currentUser.saveToLocalStorage();
        console.log("user: ", store.currentUser);
        return true;
    }
    return false;
}

// Initialisation de l'utilisateur depuis le localStorage
export function initializeUserFromLocalStorage() {
    const loadedUser = User.loadFromLocalStorage();
    if (loadedUser) {
        store.currentUser = loadedUser;
    }
}
initializeUserFromLocalStorage();

// Fonction de déconnexion de l'utilisateur
export async function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userFavorites");
    await logoutUser();
    store.currentUser = null;
}

// Fonction pour mettre à jour le nom d'une collection dans les favoris
export function updateLocalCollectionName(id: string, newName: string) {
    if (store.currentUser) {
        store.currentUser.updateFavoriteName(id, newName);
        updateUser();
    }
}

// Fonction pour supprimer une collection de favoris
export function deleteLocalCollection(id: string) {
    if (store.currentUser) {
        store.currentUser.removeFavorite(id);
        updateUser();
    }
}

export function deleteRestaurantInCollection(id: string, collectionId: string){
    if (store.currentUser){
        store.currentUser.removeRestoInFavorite(id, collectionId);
        updateUser();
    }
}

export function createFavoriteList(newList: any){
    if(store.currentUser){
        store.currentUser.addFavorite(newList);
        updateUser();
    }
}

export function createVisit(newVisit: VisitPoco){
    if(store.currentUser){
        store.currentUser.addVisit(newVisit);
        updateUser();
    }
}

export function addFavoriteToList(collectionId: string, restaurantId: resto){
        if (store.currentUser){
        store.currentUser.addRestaurantToFavorite(collectionId, restaurantId);
        updateUser();
    }
}

export function setCurrentUser(user:User){
    store.currentUser = user;
}

watch(
    () => store.currentUser?.favorites,
    (newFavorites) => {
        if (newFavorites) {
            console.log("Les favoris de l'utilisateur ont changé :", newFavorites);
            userCollections = newFavorites; // Mise à jour des collections
            updateUser();
        }
    },
    { deep: true }
);

const favoriteCount = computed(() => {
    return store.currentUser?.favorites?.reduce((acc, fav) => acc + fav.restaurants.length, 0) || 0;
});

watch(
    favoriteCount,
    (newCount, oldCount) => {
        if (newCount !== oldCount) {
            console.log("Le nombre total de restaurants dans les favoris de l'utilisateur a changé :", newCount);

            // Recharger les collections ou mettre à jour la vue si nécessaire
            userCollections = store.currentUser?.favorites || [];
            updateUser();
        }
    },
    { immediate: true }
);


watch(
    () => store.currentUser?.visits,
    (newVisit) => {
        if (newVisit) {
            if(store.currentUser){
                console.log("Les visites de l'utilisateur ont changé :", newVisit);
                userVisits = newVisit; // Mise à jour des visites
                store.currentUser.visits = newVisit;
                updateUser();
            }
            
        }
    },
    { deep: true }
);

// Exports des données
export const user = store.currentUser;
export const restaurants = store.restaurantsList;
export let userCollections = await user?.getUserFavorites()
export let userVisits = await user?.getUserVisits();