export interface Follow{
    id: string;
    name: string;
    email: string;
}
export interface UserPoco{
    id: string;
    name: string;
    email: string;
    rating: number;
    following: Follow[];
    followers: Follow[];
}