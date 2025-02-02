import { createOrder } from './orderService';
import { channel } from './server';

// Mock the channel
jest.mock('./server', () => ({
    channel: {
        sendToQueue: jest.fn()
    }
}));

describe('OrderService', () => {
    beforeEach(() => {
        // Clear mock data before each test
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        it('should create an order with correct properties', async () => {
            const userId = 'user123';
            const items = [{ id: 1, name: 'Test Item' }];

            const order = await createOrder(userId, items);

            expect(order).toHaveProperty('id');
            expect(order.userId).toBe(userId);
            expect(order.items).toEqual(items);
            expect(order.status).toBe('created');
            expect(order.createdAt).toBeInstanceOf(Date);
        });

        it('should publish message to notification queue', async () => {
            const userId = 'user123';
            const items = [{ id: 1, name: 'Test Item' }];

            const order = await createOrder(userId, items);

            expect(channel.sendToQueue).toHaveBeenCalledWith(
                'order_notifications',
                expect.any(Buffer)
            );

            // Verify the message content
            const calledWith = JSON.parse(
                (channel.sendToQueue as jest.Mock).mock.calls[0][1].toString()
            );
            expect(calledWith).toEqual({
                type: 'ORDER_CREATED',
                payload: {
                    orderId: order.id,
                    userId: order.userId
                }
            });
        });
    });
}); 