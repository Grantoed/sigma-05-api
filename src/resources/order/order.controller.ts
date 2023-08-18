import { Router, Request, Response, NextFunction } from 'express';
import validationMiddleware from '@/middleware/validation.middleware';
import orderSchema from '@/resources/order/order.validation';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import OrderService from '@/resources/order/order.service';

class OrderController implements Controller {
    public path = '/orders';
    public router = Router();
    private OrderService = new OrderService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(`${this.path}`, validationMiddleware(orderSchema), this.submitOrder);
    }

    private submitOrder = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { productsInCart, client, totalPrice, totalDiscount } = req.body;
            const order = await this.OrderService.submitOrder(
                productsInCart,
                client,
                totalPrice,
                totalDiscount,
            );
            res.status(200).json({ status: 'Order placed', order });
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };
}

export default OrderController;
