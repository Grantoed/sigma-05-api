import { Document } from 'mongoose';
import { Types } from 'mongoose';

export default interface Order extends Document {
    productsInCart: {
        _id: Types.ObjectId;
        name: string;
        price: number;
        quantity: number;
    }[];
    client: {
        fullName: string;
        email: string;
        address: string;
        phoneNumber: string | number;
        message?: string;
    };
    subtotal: number;
    total: number;
    discount: number;
}
