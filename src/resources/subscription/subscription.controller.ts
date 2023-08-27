import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import SubscriptionService from '@/resources/subscription/subscription.service';

class SubscriptionController implements Controller {
    public path = '/subscribe';
    public router = Router();
    private SubscriptionService = new SubscriptionService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(`${this.path}`, this.subscribe);
    }

    private subscribe = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { email } = req.body;
            await this.SubscriptionService.subscribe(email);
            res.status(200).json({ status: 'Subscribed' });
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };
}

export default SubscriptionController;
