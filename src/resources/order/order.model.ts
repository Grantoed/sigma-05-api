import { Schema, model } from 'mongoose';
import Order from './order.interface';

const productInCartSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const clientSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Schema.Types.Mixed,
        required: true,
    },
    message: { type: String },
});

const orderSchema = new Schema(
    {
        productsInCart: [productInCartSchema],
        client: clientSchema,
        totalPrice: {
            type: Number,
            required: true,
        },
        totalDiscount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

const orderModel = model<Order>('order', orderSchema);

export default orderModel;
