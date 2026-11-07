import { OpeningHours } from "./OpeningHours";
import { Location } from "./Location";

export interface RestaurantPoco {
  id: string;
  name: string;
  placeId: string;
  tel: string;
  address: string;
  priceRange: number;
  rating: number;
  genres: string[];
  pictures: string[];
  location: Location;
  openingHours: OpeningHours;
} 