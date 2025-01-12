# Digital Wallet API

A Node.js TypeScript REST API for managing digital wallets. This service allows users to register, create wallets, and perform various financial transactions.

## Features

- User authentication (register/login)
- Create and manage multiple wallets
- Deposit and withdraw funds
- View wallet balances
- JWT-based authentication
- MongoDB integration
- Docker support for easy deployment

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development only)
- npm or yarn (for local development only)

## Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/kristiyankiryakov/Wall-e-The-second.git
cd Wall-e-The-second
```

<!-- 2. Create a `.env` file in the root directory:
```env
JWT_SECRET=your_jwt_secret_key
PORT=3000
``` -->

2. Start the application using Docker Compose:
```bash
docker compose up --build
```

The API will be available at `http://localhost:3000`

<!-- ## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB locally or update the MONGODB_URI in the /config/index.ts

3. Run in development mode:
```bash
npm run dev
``` -->

## Project Structure

```
.
├── Dockerfile
├── docker-compose.yml
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   └── app.ts
├── package.json
└── tsconfig.json
```

## API Endpoints

### Authentication

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testUser",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testUser",
  "password": "password123"
}
```

### Wallet Operations

All wallet operations require authentication. Include the JWT token in the Authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

#### Create a new wallet
```http
POST /api/wallets
Content-Type: application/json

{
  "name": "My Wallet"
}
```

#### Get all wallets
```http
GET /api/wallet
```

#### Get specific wallet
```http
GET /api/wallet/:walletId
```

#### Deposit funds
```http
POST /api/wallet/:walletId/deposit
Content-Type: application/json

{
  "amount": 100
}
```

#### Withdraw funds
```http
POST /api/wallets/:walletId/withdraw
Content-Type: application/json

{
  "amount": 50
}
```

## Environment Variables

The application uses the following environment variables:

| Variable | Description | Default (Development) |
|----------|-------------|----------------------|
| MONGODB_URI | MongoDB connection string | mongodb://mongodb:27017/digital-wallet |
| JWT_SECRET | Secret key for JWT tokens | your_jwt_secret_key |
| PORT | Application port | 3000 |

## Docker Configuration

The project includes two main Docker configurations:

### Dockerfile
- Uses Node.js 18 Alpine image
- Builds the TypeScript application
- Runs the production build

### docker-compose.yml
- Sets up two services:
  - `app`: The Node.js application
  - `mongodb`: MongoDB database
- Configures networking between services
- Sets up volume mounts for persistence
- Enables hot-reloading for development

### Docker Commands

Build and start services:
```bash
docker compose up --build
```

Stop services:
```bash
docker compose down
```

View logs:
```bash
docker compose logs -f app
```

Common HTTP status codes:
- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 404: Resource not found
- 500: Internal server error

