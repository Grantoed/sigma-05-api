import Joi from 'joi';

const orderSchema = Joi.object({
    productsInCart: Joi.array()
        .items(
            Joi.object({
                _id: Joi.string().required(),
                name: Joi.string().required(),
                price: Joi.number().required(),
                quantity: Joi.number().required(),
            }),
        )
        .required(),
    client: Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().required(),
        address: Joi.string().required(),
        phoneNumber: Joi.alt().try(Joi.string(), Joi.number()).required(),
        message: Joi.string(),
    }),
    subtotal: Joi.number().required(),
    discount: Joi.number().required(),
    total: Joi.number().required(),
});

export default orderSchema;
