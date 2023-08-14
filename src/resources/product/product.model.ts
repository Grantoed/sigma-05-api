import { Schema, model } from 'mongoose';
import Product from './product.interface';

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        imageURL: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        additionalInfo: {
            type: String,
            required: true,
        },
        inStock: {
            type: Number,
            required: true,
        },
        priceOld: {
            type: Number,
        },
        price: {
            type: Number,
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

const setModel = model<Product>('product', productSchema);

export default setModel;
