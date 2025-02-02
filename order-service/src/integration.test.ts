import amqp from 'amqplib';
import { createOrder } from './orderService';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

describe('Order Service Integration Tests', () => {
    let connection: amqp.Connection;
    let channel: amqp.Channel;

    beforeAll(async () => {
        // Increase timeout for connection setup
        jest.setTimeout(30000);
        
        try {
            // Connect to RabbitMQ using environment variable
            connection = await amqp.connect(RABBITMQ_URL);
            channel = await connection.createChannel();
            
            // Delete the queue if it exists to ensure clean state
            try {
                await channel.deleteQueue('order_notifications');
            } catch (error) {
                // Ignore error if queue doesn't exist
            }
            
            // Make sure the queue exists with consistent settings
            await channel.assertQueue('order_notifications', {
                durable: false,  // Match the settings used in the main application
                autoDelete: false
            });
        } catch (error) {
            console.error('Setup failed:', error);
            throw error;
        }
    }, 30000); // Explicit timeout for beforeAll

    afterAll(async () => {
        try {
            // Clean up connections
            await channel?.close();
            await connection?.close();
        } catch (error) {
            console.error('Cleanup failed:', error);
        }
    }, 10000); // Explicit timeout for afterAll

    beforeEach(async () => {
        // Clear the queue before each test
        try {
            await channel.purgeQueue('order_notifications');
        } catch (error) {
            console.error('Queue purge failed:', error);
            throw error;
        }
    });

    it('should successfully publish order creation message to RabbitMQ', async () => {
        const userId = 'test_user';
        const items = [{ id: 1, name: 'Test Product' }];

        // Create an order
        const order = await createOrder(userId, items);

        // Consume the message from the queue with timeout
        const message = await Promise.race([
            new Promise<amqp.ConsumeMessage>((resolve) => {
                channel.consume('order_notifications', (msg) => {
                    if (msg) {
                        channel.ack(msg);
                        resolve(msg);
                    }
                });
            }),
            new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('Timeout waiting for message')), 5000)
            )
        ]) as amqp.ConsumeMessage;

        // Verify the message content
        const messageContent = JSON.parse(message.content.toString());
        expect(messageContent).toEqual({
            type: 'ORDER_CREATED',
            payload: {
                orderId: order.id,
                userId: order.userId
            }
        });
    }, 10000); // Explicit timeout for the test
}); 