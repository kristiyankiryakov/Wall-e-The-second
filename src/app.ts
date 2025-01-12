import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/database';
import authRoutes from './routes/AuthRoutes';
import walletRoutes from './routes/WalletRoutes';
import container from './container'; //TODO: needed for initialization

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);

const PORT = process.env.PORT || 3000;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});