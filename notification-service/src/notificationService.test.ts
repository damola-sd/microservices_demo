import { processNotification } from './notificationService';

describe('NotificationService', () => {
  // Spy on console.log before each test
  beforeEach(() => {
    jest.spyOn(console, 'log');
  });

  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Unit Tests', () => {
    it('should log correct message for ORDER_CREATED notification', async () => {
      const message = {
        type: 'ORDER_CREATED',
        payload: {
          orderId: '123',
          userId: 'user456'
        }
      };

      await processNotification(message);

      expect(console.log).toHaveBeenCalledWith(
        'Sending notification for new order 123 to user user456'
      );
    });

    it('should log unknown message type for unhandled notification types', async () => {
      const message = {
        type: 'UNKNOWN_TYPE',
        payload: {}
      };

      await processNotification(message);

      expect(console.log).toHaveBeenCalledWith(
        'Unknown message type:',
        'UNKNOWN_TYPE'
      );
    });
  });

}); 