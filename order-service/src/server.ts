import express from 'express';
import amqp from 'amqplib';
import { orderRouter } from './orderController';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

export let channel: amqp.Channel;

async function setupRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(process.env.ORDER_NOTIFICATIONS_QUEUE || 'order_notifications', { durable: false });
    } catch (error) {
        console.error('RabbitMQ setup failed:', error);
        process.exit(1);
    }
}

async function startServer() {
    await setupRabbitMQ();
    
    app.use('/api/orders', orderRouter);
    
    app.listen(PORT, () => {
        console.log(`Order service listening on port ${PORT}`);
    });
}

startServer(); 