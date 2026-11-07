import { RestaurantPoco } from "@/pocos/RestaurantPoco";
import { VisitPoco } from "@/pocos/VisitPoco";
import { mapJsonIntoVisit, mapRestaurant } from "@/utils/Mappers";
import RequestBuilder from "./RequestBuilder/RequestBuilder";
import { APPLICATION_JSON, AUTHORIZATION } from "./RequestBuilder/Headers";
import Cookies from "js-cookie";

let token: string = Cookies.get('user_profile_cookie') ?? '';

const isAuthenticated = () => { 
  return token ? true : false;
}

// USER

export const signupUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const body = new URLSearchParams();
  body.append('name', name);
  body.append('email', email);
  body.append('password', password);

  const response = await fetch('https://ufoodapi.herokuapp.com/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  return response;
};

export const loginUser = async (
  email: string,
  password: string,
) => {
  const body = new URLSearchParams();
  body.append('email', email);
  body.append('password', password);

  const response = await fetch('https://ufoodapi.herokuapp.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
    });

  const status = response.status
  if (status != 200) return {status}
  const data = await response.json();
  token = data.token;
 

  Cookies.set('user_profile_cookie', token);
  sessionStorage.setItem("id", data.id);

  return {data, status};
};

export const logoutUser = () => {
  Cookies.remove('user_profile_cookie');
}

export const listUsers = async () => {

  const request = await new RequestBuilder()
    .get("users?limit=10000")
    .header(APPLICATION_JSON())
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response.items;
};

export const getUser = async (userId: string) => {

  const request = await new RequestBuilder()
    .get(`users/${userId}`)
    .header(APPLICATION_JSON())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response
};

export const getUserFavorites = async (userId: string) => {
  const request = await new RequestBuilder()
    .get(`users/${userId}/favorites`)
    .header(APPLICATION_JSON())
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response.items;
};

export const createFavoriteListAPI = async (ownerEmail: string, listName: string) => {

  const request = await new RequestBuilder()
    .post("favorites")
    .header(APPLICATION_JSON())
    .body(JSON.stringify({ name: listName, owner: ownerEmail }))
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response;
};

//Retrieve restaurants
export const getRestaurants = async (page: number = 0): Promise<[Array<RestaurantPoco>, number]> => {
  const request = await new RequestBuilder()
    .get(`restaurants?page=${page}`)
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  const restaurants: Array<RestaurantPoco> = [];
  if (Array.isArray(response.items)) {
    response.items.forEach((restaurant: any) => {
      restaurants.push(mapRestaurant(restaurant));
    });
  }

  return [restaurants, Math.ceil(response.total / 10)];
}


export const deleteFavoriteListAPI = async (listId: string) => {
  const request = await new RequestBuilder()
    .delete(`favorites/${listId}`)
    .header(APPLICATION_JSON())
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response;
};

export const getFavoriteLists = async () => {
  const request = await new RequestBuilder()
    .get("favorites")
    .header(APPLICATION_JSON())
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();
  return response.items;
};


export const updateFavoriteListAPI = async (listId: string, newName: string) => {
  const request = await new RequestBuilder()
    .put(`favorites/${listId}`)
    .header(APPLICATION_JSON())
    .body(JSON.stringify({ name: newName }))
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response;
};
// // RESTAURANT

//Retrieve a specific restaurant
export const getRestaurant = async (restaurantId: string): Promise<RestaurantPoco> => {
  const request = await new RequestBuilder()
    .get(`restaurants/${restaurantId}`)
    .header(APPLICATION_JSON())
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();



  return mapRestaurant(response);
};

//Retrieve differents visits in a specific restaurant
export const getRestaurantVisits = async (restaurantId: string) => {
  const request = await new RequestBuilder()
    .get(`restaurants/${restaurantId}/visits`)
    .header(APPLICATION_JSON())
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response.items;
};

// // VISITE DE RESTAURANTS

//Restaurant list visted by user
export const getRestaurantsVisitedByUser = async (userId: string, limit: number = 20, page: number = 0): Promise<[Array<VisitPoco>, number]> => {
  const request = await new RequestBuilder()
    .get(`users/${userId}/restaurants/visits?limit=${limit}`)
    .header(APPLICATION_JSON())
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  const visits: Array<VisitPoco> = [];
  if (Array.isArray(response.items)) {
    response.items.forEach((visit: any) => {
      visits.push(mapJsonIntoVisit(visit));
    });
  }

  return [visits, Math.ceil(response.total / 10)];
};

//One particular restaurant visit
export const getVisit = async (userId: string, visitId: string) => {
  const request = await new RequestBuilder()
    .get(`users/${userId}/restaurants/visits/${visitId}`)
    .header(APPLICATION_JSON())
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response;
};

//Post a new restaurant visit
export const postVisitRestaurant = async (userId: string, restaurant_id: string, comment: string, rating: number, date: Date) => {
  const request = await new RequestBuilder()
    .post(`users/${userId}/restaurants/visits`)
    .header(APPLICATION_JSON())
    .body(JSON.stringify({
      restaurant_id,
      comment,
      rating,
      date: date.toISOString(),
    }))
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();
  return response;
};

//All Visits in a particular restaurant
export const getRestaurantUserVisits = async (userId: string, restaurantId: string) => {
  const request = await new RequestBuilder()
    .get(`users/${userId}/restaurants/${restaurantId}/visits`)
    .header(APPLICATION_JSON())
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response.items;
};


// Gestion des Collections de favoris

//Get restoCollection items
export const getFavoriteById = async (collectionId: string) => {
  const request = await new RequestBuilder()
    .get(`favorites/${collectionId}`)
    .header(APPLICATION_JSON())
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response;
};


export const createCollection = async (owner: string, name: string) => {
  const request = await new RequestBuilder()
    .post("favorites")
    .header(APPLICATION_JSON())
    .body(JSON.stringify({ name, owner }))
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response;
};


//Ajouter un restaurant dans une liste
export const addRestoCollection = async (restoId: string, collectionId: string) => {
  const request = await new RequestBuilder()
    .post(`favorites/${collectionId}/restaurants`)
    .header(APPLICATION_JSON())
    .body(JSON.stringify({ id: restoId }))
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();
  return response;
};


//Supprimer un restaurant d'une liste
export const deleteRestoFromCollection = async (collectionId: string, restaurantId: string) => {
  const request = await new RequestBuilder()
    .delete(`favorites/${collectionId}/restaurants/${restaurantId}`)
    .header(APPLICATION_JSON())
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response.items;
};


export interface VisitFormPayload {
  restaurant_id: string,
  comment: string,
  rating: number,
  date: Date
}

export const rateRestaurant = async (userId: string, payload: VisitFormPayload) => {
  if (!token)
    throw new Error('non-authentifié, à gérer autrement')

  const request = await new RequestBuilder()
    .post(`users/${userId}/restaurants/visits`)
    .header(APPLICATION_JSON())
    .body(JSON.stringify({
      restaurant_id: payload.restaurant_id,
      comment: payload.comment,
      rating: payload.rating,
      date: payload.date.toISOString(),
    }))
    .unsecure(!isAuthenticated())

  if (isAuthenticated())
    request.header(AUTHORIZATION(token!))

  const response = await request.send();

  return response as VisitPoco;
};

export const getSimilarRestaurants = async (genres: string[], currentRestaurantId: string, limit: number = 6): Promise<RestaurantPoco[]> => {
  let similarRestaurants: RestaurantPoco[] = [];
  let page = 0;

  while (similarRestaurants.length < limit) {
    const query = genres.map((genre) => `genres_like=${genre}`).join('&');
    const request = await new RequestBuilder()
      .get(`restaurants?page=${page}&limit=10&${query}`)
      .header(APPLICATION_JSON())
      .unsecure(!isAuthenticated());

    if (isAuthenticated()) {
      request.header(AUTHORIZATION(token!));
    }

    const response = await request.send();

    const allRestaurants: RestaurantPoco[] = [];
    if (Array.isArray(response.items)) {
      response.items.forEach((restaurant: any) => {
        allRestaurants.push(mapRestaurant(restaurant));
      });
    }
    const filtered = allRestaurants.filter(
      (restaurant) =>
        restaurant.id !== currentRestaurantId &&
        restaurant.genres.some((genre) => genres.includes(genre))
    );

    similarRestaurants = [...similarRestaurants, ...filtered];

    if (response.items.length === 0) {
      break;
    }

    page++;
  }

  return similarRestaurants.slice(0, limit);
};
