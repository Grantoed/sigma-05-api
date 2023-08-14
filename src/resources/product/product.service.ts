import { Types } from 'mongoose';
import HttpException from '@/utils/exceptions/http.exception';
import productModel from './product.model';
import Product from './product.interface';

class ProductService {
    private product = productModel;

    public async getCount(productCategory?: string): Promise<number> {
        const query = productCategory ? { category: productCategory } : {};
        const count = await this.product.countDocuments(query);
        return count;
    }

    public async getAll(page: number, limit: number, query?: string): Promise<Product[] | []> {
        let searchQuery = {};
        if (query) {
            const regex = new RegExp(query, 'i');
            searchQuery = {
                $or: [{ name: regex }, { category: regex }],
            };
        }
        const sets = await this.product
            .find(searchQuery)
            .skip((page - 1) * limit)
            .limit(limit);
        return sets;
    }

    public async getById(productId: string): Promise<Product> {
        const productObjectId = new Types.ObjectId(productId);
        const product = await this.product.findById(productObjectId);
        if (!product) {
            throw new HttpException(404, `Product with id ${productId} doesn't exist`);
        }
        return product;
    }

    public async getByCategory(
        productCategory: string,
        page: number,
        limit: number,
    ): Promise<Product[]> {
        const products = await this.product
            .find({ category: productCategory })
            .skip((page - 1) * limit)
            .limit(limit);
        if (!products.length) {
            throw new HttpException(404, `Products of ${productCategory} category don't exist`);
        }
        return products;
    }
}

export default ProductService;
