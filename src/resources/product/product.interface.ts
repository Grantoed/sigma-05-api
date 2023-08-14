import { Document } from 'mongoose';

export default interface Product extends Document {
    name: string;
    imageURL: string;
    category: string;
    description: string;
    additionalInfo: string;
    inStock: number;
    priceOld: number;
    price: number;
    rating: number;
}
