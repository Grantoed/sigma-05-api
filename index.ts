require('dotenv').config();
import 'module-alias/register';
import App from './app';
import ProductController from '@/resources/product/product.controller';
import OrderController from '@/resources/order/order.controller';
import SubscriptionController from '@/resources/subscription/subscription.controller';

const app = new App(
    [new ProductController(), new OrderController(), new SubscriptionController()],
    Number(process.env.PORT),
);

app.listen();
