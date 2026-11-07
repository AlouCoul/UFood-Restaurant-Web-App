// models/User.ts

import { getRestaurantsVisitedByUser, getUserFavorites } from '@/api/api';
import { listeFavoritePoco, resto } from '@/pocos/ListeFavoritePoco';
import { Follow } from '@/pocos/UserPoco';
import { VisitPoco } from '@/pocos/VisitPoco';

export class User {
  id: string;
  email: string;
  name: string;
  rating: number;
  followers: Follow[];
  following: Follow[];
  favorites: listeFavoritePoco[];
  visits: VisitPoco[];

  constructor(
    id: string,
    email: string,
    name: string,
    rating: number,
    favorites: listeFavoritePoco[] = [],
    visits: VisitPoco[] = [],
    followers: Follow[] = [],
    following: Follow[] = [],
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.rating = rating;
    this.favorites = favorites;
    this.visits = visits;
    this.followers = followers;
    this.following = following;
  }

  // Méthode pour mettre à jour le nom de l'utilisateur
  updateName(newName: string): void {
    this.name = newName;
  }

  // Méthode pour mettre à jour les favoris
  updateFavoriteName(collectionId: string, newName: string): void {
    const collection = this.favorites.find((fav) => fav.id === collectionId);
    if (collection) {
      collection.name = newName;
    }
  }

  async getUserFavorites() {
    this.favorites = await getUserFavorites(this.id);
    this.saveToLocalStorage();
    return this.favorites;
  }
  async updateUserFavorites() {
    this.favorites = await getUserFavorites(this.id);
    console.log("Favoris:  ");
    console.log(this.favorites);
  }
  async getUserVisits() {
    [this.visits] = await getRestaurantsVisitedByUser(this.id, 20);
    this.saveToLocalStorage();
    return this.visits;
  }

  addRestaurantToFavorite(collectionId: string, restaurantId: resto): void {
    const collection = this.favorites.find((fav) => fav.id === collectionId);
    if (collection) {
      if (!collection.restaurants) {
        collection.restaurants = [];
      }
      collection.restaurants.push(restaurantId);
    } else {
      console.warn(`La collection avec l'ID ${collectionId} n'existe pas.`);
    }
  }

  // Méthode pour ajouter une nouvelle collection de favoris
  addFavorite(newFavorite: listeFavoritePoco): void {
    this.favorites.push(newFavorite);
  }

  //méthode pour ajouter une nouvelle visit de favoris
  addVisit(newVisit: VisitPoco) {
    this.visits.push(newVisit);
  }

  // Méthode pour supprimer une collection de favoris
  removeFavorite(collectionId: string): void {
    this.favorites = this.favorites.filter((fav) => fav.id !== collectionId);
  }

  removeRestoInFavorite(restoId: string, collectionId: string) {
    const tempMap = {
      id: restoId,
    };

    this.favorites.filter((fav) => fav.restaurants.includes(tempMap));
  }

  // Méthode pour sauvegarder l'état actuel de l'utilisateur dans le localStorage
  saveToLocalStorage(): void {
    localStorage.setItem("currentUser", JSON.stringify(this));
    localStorage.setItem("userFavorites", JSON.stringify(this.favorites));
    localStorage.setItem("userVisits", JSON.stringify(this.visits));
  }

  // Méthode pour charger l'utilisateur à partir du localStorage
  static loadFromLocalStorage(): User | null {
    const userData = localStorage.getItem("currentUser");
    const userFavorites = localStorage.getItem("userFavorites");
    const userVisits = localStorage.getItem("userVisits");

    if (userData) {
      const parsedUser = JSON.parse(userData);
      const parsedFavorites = userFavorites ? JSON.parse(userFavorites) : [];
      const parsedVisits = userVisits ? JSON.parse(userVisits) : [];

            return new User(parsedUser.id, parsedUser.email, parsedUser.name, parsedUser.rating, parsedFavorites, parsedVisits, parsedUser.followers, parsedUser.following);
        }

    return null;
  }
}
