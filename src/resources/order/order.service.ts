import HttpException from '@/utils/exceptions/http.exception';
import orderModel from './order.model';
import Order from './order.interface';
import productModel from '../product/product.model';

class ProductService {
    private order = orderModel;
    private product = productModel;

    public async submitOrder(
        productsInCart: Order['productsInCart'],
        client: Order['client'],
        totalPrice: Order['totalPrice'],
        totalDiscount: Order['totalDiscount'],
    ): Promise<Order> {
        const productIds = productsInCart.map(product => product._id);
        const products = await this.product.find({
            _id: { $in: productIds },
        });

        const productMap = new Map(products.map(product => [product._id.toString(), product]));

        let calculatedTotalPrice = 0;
        let calculatedTotalDiscount = 0;

        for (let item of productsInCart) {
            const dbProduct = productMap.get(item._id.toString());

            if (!dbProduct) {
                throw new HttpException(404, `Product with ID: ${item._id} not found.`);
            }

            if (dbProduct.price !== item.price) {
                throw new HttpException(
                    400,
                    `Price mismatch for product with ID: ${item._id}. Expected ${dbProduct.price} but received ${item.price}.`,
                );
            }

            calculatedTotalPrice += dbProduct.price * item.quantity;
            calculatedTotalDiscount += (dbProduct.priceOld - dbProduct.price) * item.quantity;
        }

        if (totalPrice !== calculatedTotalPrice) {
            throw new HttpException(
                400,
                `Provided totalPrice does not match the expected total. Expected: ${calculatedTotalPrice}, received: ${totalPrice}.`,
            );
        }

        if (totalDiscount !== calculatedTotalDiscount) {
            throw new HttpException(
                400,
                `Provided totalDiscount does not match the expected discount. Expected: ${calculatedTotalDiscount}, received: ${totalDiscount}.`,
            );
        }

        const order = await this.order.create({
            productsInCart,
            client,
            totalPrice,
            totalDiscount,
        });
        return order;
    }
}

export default ProductService;
