import dotenv from 'dotenv';

dotenv.config();

const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-wallet', // Fallback if env is not set
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'development_jwt_secret_key_123',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  }
};


export { config };