import mongoose from "mongoose";
import { IWallet, ServiceResponse, ValidationResult } from "../types";
import { Wallet } from "../models/Wallet";

export class WalletValidator{

     validateAmount(amount: any): ValidationResult {
        if (amount === undefined || amount === null) {
          return {
            isValid: false,
            error: {
              status: 400,
              error: 'Amount is required'
            }
          };
        }
    
        const numberAmount = Number(amount);
        if (isNaN(numberAmount)) {
          return {
            isValid: false,
            error: {
              status: 400,
              error: 'Amount must be a number'
            }
          };
        }
    
        if (numberAmount <= 0) {
          return {
            isValid: false,
            error: {
              status: 400,
              error: 'Amount must be positive'
            }
          };
        }
    
        return { isValid: true };
      }


       async validateAndFindWallet(userId: string, walletId: string): Promise<ServiceResponse<IWallet>> {
        if (!mongoose.Types.ObjectId.isValid(walletId)) {
          return {
            status: 400,
            error: 'Invalid wallet ID format'
          };
        }
    
        const wallet = await Wallet.findOne({ _id: walletId, userId });
        if (!wallet) {
          return {
            status: 404,
            error: 'Wallet not found'
          };
        }
    
        return {
          status: 200,
          data: wallet
        };
      }

       handleServiceError(error: any): ServiceResponse<any> {
        const errorMessages: { [key: string]: { status: number; message: string } } = {
          'Insufficient funds': { status: 400, message: 'Insufficient funds' },
          'Transaction amount must be positive': { status: 400, message: 'Transaction amount must be positive' },
          'Wallet with this name already exists for this user': { status: 400, message: 'Wallet with this name already exists for this user' }
        };
    
        const errorInfo = errorMessages[error.message] || { status: 500, message: 'Internal server error' };
        
        return {
          status: errorInfo.status,
          error: errorInfo.message
        };
      }

       async executeWalletOperation<T>( operation: () => Promise<ServiceResponse<T>>): Promise<ServiceResponse<T>> {
        try {
          return await operation();
        } catch (error: any) {
          return this.handleServiceError(error);
        }
      }


}