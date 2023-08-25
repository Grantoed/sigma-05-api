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
        this.router.get(`${this.path}`, this.getOrders);
        this.router.post(`${this.path}`, validationMiddleware(orderSchema), this.submitOrder);
    }

    private getOrders = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const count = await this.OrderService.getCount();
            const totalPages = Math.ceil(count / limit);
            const orders = await this.OrderService.getOrders(page, limit);
            res.status(200).json({ orders, page, limit, count, totalPages });
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };

    private submitOrder = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { productsInCart, client, subtotal, total, discount } = req.body;
            const order = await this.OrderService.submitOrder(
                productsInCart,
                client,
                subtotal,
                discount,
                total,
            );

            res.status(200).json({ status: 'Order placed', order });
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };
}

export default OrderController;
