import express from 'express';
import amqp from 'amqplib';
import { processNotification } from './notificationService';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3001;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

async function setupRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        
        await channel.assertQueue(process.env.ORDER_NOTIFICATIONS_QUEUE || 'order_notifications', { durable: false });
        
        channel.consume('order_notifications', async (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());
                await processNotification(content);
                channel.ack(msg);
            }
        });

        console.log('Connected to RabbitMQ and listening for messages');
    } catch (error) {
        console.error('RabbitMQ setup failed:', error);
        process.exit(1);
    }
}

async function startServer() {
    await setupRabbitMQ();
    
    app.listen(PORT, () => {
        console.log(`Notification service listening on port ${PORT}`);
    });
}

startServer(); 