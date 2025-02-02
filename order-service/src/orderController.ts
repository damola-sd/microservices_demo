import { Router } from 'express';
import { createOrder } from './orderService';

export const orderRouter = Router();

orderRouter.post('/', async (req, res) => {
    try {
        const { userId, items } = req.body;
        const order = await createOrder(userId, items);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
}); 