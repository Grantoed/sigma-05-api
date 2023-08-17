import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import ProductService from '@/resources/product/product.service';

class ServiceController implements Controller {
    public path = '/products';
    public router = Router();
    private ProductService = new ProductService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(`${this.path}`, this.getAll);
        this.router.get(`${this.path}/:id`, this.getById);
        this.router.get(`${this.path}/category/:category`, this.getByCategory);
    }

    private getAll = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const query = req.query.q as string;
            const count = await this.ProductService.getCount({ searchQuery: query });
            const totalPages = Math.ceil(count / limit);
            const products = await this.ProductService.getAll(page, limit, query);
            res.status(200).json({ products, page, limit, count, totalPages });
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };

    private getById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { id: productId } = req.params;
            const product = await this.ProductService.getById(productId);
            res.status(200).json({ product });
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };

    private getByCategory = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { category: productCategory } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 3;
            const count = await this.ProductService.getCount({ productCategory });
            const totalPages = Math.ceil(count / limit);
            const products = await this.ProductService.getByCategory(productCategory, page, limit);
            res.status(200).json({ products, page, limit, count, totalPages });
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };
}

export default ServiceController;
