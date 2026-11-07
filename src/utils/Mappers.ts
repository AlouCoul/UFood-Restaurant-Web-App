import { RestaurantPoco } from "@/pocos/RestaurantPoco";
import { VisitPoco } from "@/pocos/VisitPoco";

export function mapRestaurant(data: any): RestaurantPoco {
    return {
        id: data.id,
        name: data.name,
        placeId: data.place_id,
        tel: data.tel,
        address: data.address,
        priceRange: data.price_range,
        rating: data.rating,
        genres: data.genres,
        pictures: data.pictures,
        location: data.location,
        openingHours: data.opening_hours,
    };
}

export function mapJsonIntoVisit(data: any): VisitPoco {
    return {
        id: data.id,
        restaurantId: data.restaurant_id,
        comment: data.comment,
        rating: data.rating,
        date: new Date(data.date)
    }
}