import mongoose from 'mongoose';
import { Wallet } from '../models/Wallet';
import { IWallet, ServiceResponse } from '../types';
import { ErrorHandler } from '../utility/ErrorHandler';
import { WalletValidator } from '../validators/WalletValidator';
import { IWalletService } from './interfaces/IWalletService';

export class WalletService implements IWalletService {

  constructor(private walletValidator: WalletValidator) {
    this.walletValidator = walletValidator;
  }

  async createWallet(userId: string, name: string): Promise<ServiceResponse<IWallet>> {
    try {
    
      const nameValidation = this.walletValidator.validateWalletName(name);
      if (!nameValidation.isValid) return nameValidation.error!;

      const nameExists = await this.walletValidator.checkWalletNameExists(name);
      if (!nameExists.isValid) return nameExists.error!;

      const wallet = await this.performWalletCreation(userId, name);
     
      return {
        status: 201,
        data: wallet
      };

    } catch (error) {
      return ErrorHandler.handleError(error);
    }
  }

  private async performWalletCreation(userId:string, name:string):Promise<IWallet>{
    const wallet = new Wallet({ userId, name: name.trim(), balance: 0 });
    await wallet.save();

    return wallet;
  }


  async getWallets(userId: string): Promise<ServiceResponse<IWallet[]>> {
    try {
      const wallets = await Wallet.find({ userId });
      return {
        status: 200,
        data: wallets
      };
    } catch (error) {
      return ErrorHandler.handleError(error);
    }
  }

  async getWallet(userId: string, walletId: string): Promise<ServiceResponse<IWallet>> {
    try {

      return await this.findWallet(userId, walletId);
   
    } catch (error) {
      return ErrorHandler.handleError(error);
    }
  }

  async deposit(userId: string, walletId: string, amount: any): Promise<ServiceResponse<{ balance: number }>> {

    const amountValidation = this.walletValidator.validateAmount(amount);
    if (!amountValidation.isValid) return amountValidation.error!;

    try {
      
      const walletResponse = await this.findWallet(userId, walletId);
      if (walletResponse.error) return walletResponse as ServiceResponse<{ balance: number }>;

      const wallet = walletResponse.data!;
      const numberAmount = Number(amount);

      await this.performDeposit(wallet, numberAmount);
      return { status: 200, data: { balance: wallet.balance } };
    } catch (error) {
      return ErrorHandler.handleError(error);
    }
  }

  private async performDeposit(wallet:IWallet, amount:number): Promise<void> {
    wallet.balance += amount;
    
    wallet.transactions.push({ type: 'deposit', amount,timestamp: new Date()});
    
    await wallet.save();
  }

  async withdraw(userId: string, walletId: string, amount: any): Promise<ServiceResponse<{ balance: number }>> {

    const amountValidation = this.walletValidator.validateAmount(amount);
    if (!amountValidation.isValid) return amountValidation.error!;

    try {

      const walletResponse = await this.findWallet(userId, walletId);
      if (walletResponse.error) return walletResponse as ServiceResponse<{ balance: number }>;


      const wallet = walletResponse.data!;
      const numberAmount = Number(amount);

      if (wallet.balance < numberAmount) {
        return { status: 400, error: 'Insufficient funds' };
      }

      await this.performWithdrawal(wallet, numberAmount);
      return { status: 200, data: { balance: wallet.balance } };
    } catch (error) {
      return ErrorHandler.handleError(error);
    }
  }

  private async performWithdrawal(wallet: IWallet, amount: number): Promise<void> {
    wallet.balance -= amount;
    wallet.transactions.push({ type: 'withdraw', amount, timestamp: new Date() });
    await wallet.save();
  }

  private async findWallet(userId: string, walletId: string): Promise<ServiceResponse<IWallet>> {
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
  
}