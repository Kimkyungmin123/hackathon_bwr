export enum FirebaseRefType {
  USERS = "users",
  RESTAURANT_LIST = "restaurant_list",
  REVIEW = "review",
}

export interface UserType {
  uid: string;
  name: string;
  email: string;
}

export interface RestaurantListType {
  id: string;
  uid: string;
  title: string;
  name: string;
  content: string;
  email: string;
  images: string[];
  rating: RatingType;
  address: string;
  restaurant_name: string;
  created_at: Date | string;
  updated_at: Date | string | null;
}

export enum RatingType {
  ONE = 1,
  TOW,
  TRHEE,
  FOUR,
  FIVE,
}

export interface ReviewType {
  id: string;
  uid: string;
  restaurant_doc_id: string;
  name: string;
  email: string;
  content: string;
  created_at: Date | string;
}
