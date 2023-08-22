import HttpException from '@/utils/exceptions/http.exception';
import roundNumber from '@/utils/helpers/roundNumber';
import orderModel from './order.model';
import productModel from '../product/product.model';
import Order from './order.interface';

class ProductService {
    private order = orderModel;
    private product = productModel;

    public async submitOrder(
        productsInCart: Order['productsInCart'],
        client: Order['client'],
        subtotal: Order['subtotal'],
        discount: Order['discount'],
        total: Order['total'],
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

            if (dbProduct.inStock < item.quantity) {
                throw new HttpException(
                    400,
                    `Can't order ${item.quantity} items of ${item.name}. Only ${dbProduct.inStock} of ${item.name} available`,
                );
            }

            if (dbProduct.price !== item.price) {
                throw new HttpException(400, `Price mismatch for product with ID: ${item._id}.`);
            }

            const oldPrice = dbProduct.priceOld || dbProduct.price;
            calculatedTotalPrice += dbProduct.price * item.quantity;
            calculatedTotalDiscount += (oldPrice - dbProduct.price) * item.quantity;
        }

        if (roundNumber(total) !== roundNumber(calculatedTotalPrice)) {
            throw new HttpException(
                400,
                `Provided total price does not match the expected. Expected: ${calculatedTotalPrice}, received: ${total}.`,
            );
        }

        if (roundNumber(discount) !== roundNumber(calculatedTotalDiscount)) {
            throw new HttpException(
                400,
                `Provided totalDiscount does not match the expected discount. Expected: ${calculatedTotalDiscount}, received: ${discount}.`,
            );
        }

        const order = await this.order.create({
            productsInCart,
            client,
            subtotal,
            discount,
            total,
        });
        return order;
    }
}

export default ProductService;
