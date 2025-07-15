export interface User {
    id: number;
    email: string;
    is_admin: boolean;
    name?: string;
    phone?: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    stock: number;
}

export interface GiftSet {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    products: Product[];
}

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    image_url: string;
}

export interface CreateGiftSetDto {
    name: string;
    description: string;
    price: number;
    image_url: string;
    product_ids: number[];
} 
 export {};
