import { channel } from './server';

export async function createOrder(userId: string, items: any[]) {
    // Simulate order creation
    const order = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        items,
        status: 'created',
        createdAt: new Date()
    };

    // Publish message to notification queue
    const message = {
        type: 'ORDER_CREATED',
        payload: {
            orderId: order.id,
            userId: order.userId
        }
    };

    channel.sendToQueue(
        process.env.ORDER_NOTIFICATIONS_QUEUE || 'order_notifications',
        Buffer.from(JSON.stringify(message))
    );

    return order;
} 