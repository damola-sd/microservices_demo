# Microservices Demo with Node.js and RabbitMQ

This project demonstrates a microservices architecture using Node.js, TypeScript, and RabbitMQ for asynchronous communication. It consists of two services:
- Order Service: Handles order creation
- Notification Service: Processes notifications based on order events

## Architecture Overview

The system uses an event-driven architecture where services communicate asynchronously through RabbitMQ message broker: 
┌──────────────┐ ┌──────────────┐ ┌─────────────────┐
│ │ │ │ │ │
│ Order Service├────►│ RabbitMQ ├────►│ Notification │
│ (Port 3000) │ │ │ │ Service │
│ │ │ │ │ (Port 3001) │
└──────────────┘ └──────────────┘ └─────────────────┘


## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn


## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd microservices-demo
```
2. Start the services using Docker Compose:
```bash
docker-compose up --build
```
This will start:
- RabbitMQ on port 5672 (AMQP) and 15672 (Management UI)
- Order Service on port 3000
- Notification Service on port 3001

## Service Endpoints

### Order Service (Port 3000)

- Create Order:
```bash
curl -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" -d "{\"userId\": \"123\", \"items\": [{\"productId\": \"456\", \"quantity\": 1}]}"
```

### RabbitMQ Management UI

Access the RabbitMQ Management interface at:
- URL: http://localhost:15672
- Username: guest
- Password: guest

## Development

### Local Development Setup

1. Install dependencies for each service:
``` 
cd order-service && npm install
cd ../notification-service && npm install
```

2. Copy .env.example to .env and update the variables
```
- RABBITMQ_URL=amqp://guest:guest@localhost:5672
- ORDER_NOTIFICATIONS_QUEUE=order_notifications
```

3. Run services in development mode:
```
In order-service directory
npm run dev
In notification-service directory
npm run dev


### Available Scripts

Both services share the same npm scripts:
- `npm start`: Build and run the service
- `npm run build`: Compile TypeScript to JavaScript
- `npm run dev`: Run in development mode with hot-reload

## Docker Commands

- Start services:
```bash
docker-compose up --build
```

- Stop services:
```bash
docker-compose down
```
- View logs:
```bash
docker-compose logs -f [service-name]
```


## Service Communication

The services communicate through RabbitMQ using the following event:

- `ORDER_CREATED`: Published by Order Service when a new order is created
```typescript
  {
    type: 'ORDER_CREATED',
    payload: {
      orderId: string,
      userId: string
    }
  }
  ``` 

## Error Handling

- Both services implement basic error handling
- Failed RabbitMQ connections will cause services to exit
- Message acknowledgment ensures no messages are lost
- Health checks ensure RabbitMQ is ready before starting services

## Environment Variables

### Order Service
- `RABBITMQ_URL`: RabbitMQ connection URL (default: amqp://guest:guest@localhost:5672)
- `PORT`: Service port (default: 3000)
- `ORDER_NOTIFICATIONS_QUEUE`: Queue name for order notifications (default: order_notifications)
### Notification Service
- `RABBITMQ_URL`: RabbitMQ connection URL (default: amqp://guest:guest@localhost:5672)
- `PORT`: Service port (default: 3001)
- `ORDER_NOTIFICATIONS_QUEUE`: Queue name for order notifications (default: order_notifications)

## Testing
From the notification-service / order-service directory
- `npm run test`: Run all tests


