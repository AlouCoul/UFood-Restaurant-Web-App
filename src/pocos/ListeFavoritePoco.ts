export interface owner {
    id: string;
    name?: string;
    email?: string;
}
export interface resto {
    id: string | '';
}
export interface listeFavoritePoco {
    id: string;
    name?: string;
    owner: owner;
    restaurants: resto[];
}