import mongoose from 'mongoose';
import { IWallet } from '../types';

const walletSchema = new mongoose.Schema<IWallet>({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  balance: { 
    type: Number, 
    default: 0,
    min: [0, 'Insufficient funds']
  },
  transactions: [{
    type: { type: String, enum: ['deposit', 'withdraw'], required: true },
    amount: { 
      type: Number, 
      required: true,
      validate: {
        validator: function(value: number) {
          return value > 0;
        },
        message: 'Amount must be positive'
      }
    },
    timestamp: { type: Date, default: Date.now }
  }]
});

// ensures wallet names are unique per user
walletSchema.index({ userId: 1, name: 1 }, { unique: true });

walletSchema.pre('save', function(next) {
  if (this.balance < 0) {
    next(new Error('Insufficient funds'));
  } else {
    next();
  }
});

export const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);