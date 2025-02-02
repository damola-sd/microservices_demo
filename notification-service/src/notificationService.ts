export async function processNotification(message: any) {
    const { type, payload } = message;
    
    switch (type) {
        case 'ORDER_CREATED':
            console.log(`Sending notification for new order ${payload.orderId} to user ${payload.userId}`);
            break;
        default:
            console.log('Unknown message type:', type);
    }
} 