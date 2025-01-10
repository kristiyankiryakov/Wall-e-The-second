import { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
}

export interface IWallet extends Document {
  userId: IUser['_id'];
  name: string;
  balance: number;
  transactions: {
    type: 'deposit' | 'withdraw';
    amount: number;
    timestamp: Date;
  }[];
}

export interface JWTPayload {
  userId: string;
  username: string;
}

export interface ServiceResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

export type ValidationResult = {
  isValid: boolean;
  error?: ServiceResponse<any>;
};