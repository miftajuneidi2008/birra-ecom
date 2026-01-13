import { StaticImageData } from "next/image";

export interface ProductType {
  id: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  images: string[] | StaticImageData[];
  category: string;
  storeId: string;
  inStock: boolean;
  store: {
    id: string;
    userId: string;
    name: string;
    description: string;
    username: string;
    address: string;
    status: string;
    isActive: boolean;
    logo: StaticImageData;
    email: string;
    contact: string;
    createdAt: string;
  };
  rating: {
    id: string;
    rating: number;
    review: string;
    user: {
      name: string;
      image: StaticImageData;
    };
    productId: string;
    createdAt: string;
    updatedAt: string;
    product: {
      name: string;
      category: string;
      id: string;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface DummyData {
  id: string;
  total: number;
  status: string;
  userId: string;
  storeId: string;
  addressId: string;
  isPaid: boolean;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  isCouponUsed: boolean;
  coupon: {
    id: string;
    rating: number;
    review: string;
    user: {
      name: string;
      image: StaticImageData;
    };
    productId: string;
    createdAt: string;
    updatedAt: string;
    product: {
      name: string;
      category: string;
      id: string;
    };
  };
}

export interface Products {
  id: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  images: StaticImageData[];
  category: string;
  storeId: string;
  inStock: boolean;
  store: {
    id: string;
    userId: string;
    name: string;
    description: string;
    username: string;
    address: string;
    status: string;
    isActive: boolean;
    logo: StaticImageData;
    email: string;
    contact: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: StaticImageData;
    };
  };
  rating: {
    id: string;
    rating: number;
    review: string;
    user: {
      name: string;
      image: StaticImageData;
    };
    productId: string;
    createdAt: string;
    updatedAt: string;
    product: {
      name: string;
      category: string;
      id: string;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}
export interface CartArrayType extends Products {
  quantity: number;
}
export interface TitleType {
  title: string;
  description: string;
  visibleButton?: boolean;
  href?: string;
}

export interface PageType {
  heading: string;
  text: string;
  path?: string;
  linkText: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  image: any; // StaticImageData or string
  cart?: Record<string, any>;
}

export interface IAddress {
  id: string;
  userId: string;
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  createdAt: string;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  images: any[];
  category: string;
  storeId: string;
  inStock: boolean;
  store: any; // Can be detailed further based on dummyStoreData
  rating: any[];
  createdAt: string;
  updatedAt: string;
}

// 2. Order Item Type
export interface IOrderItem {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: IProduct;
}
export interface Coupon {
  code: string;
  description: string;
  discount: number;
  forNewUser: boolean;
  forMember: boolean;
  isPublic: boolean;
  expiresAt: string;
  createdAt: string;
}
// 3. Main Order Type
export interface IOrder {
  id: string;
  total: number;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | string;
  userId: string;
  storeId: string;
  addressId: string;
  isPaid: boolean;
  paymentMethod: "COD" | "STRIPE" | "RAZORPAY" | string;
  createdAt: string;
  updatedAt: string;
  isCouponUsed: boolean;
  coupon?: Coupon;
  orderItems: IOrderItem[];
  address: IAddress;
  user: IUser;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  createdAt: string;
}



export interface dummyStoreDataType {
  id: string;
  userId: string;
  name: string;
  description: string;
  username: string;
  address: string;
  status: string;
  isActive: boolean;
  logo: StaticImageData | string; 
  email: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: StaticImageData;
  };
}


