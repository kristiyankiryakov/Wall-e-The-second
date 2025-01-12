import { Wallet } from '../models/Wallet';
import { IWallet, ServiceResponse } from '../types';
import { WalletValidator } from '../validators/WalletValidator';
import { IWalletService } from './interfaces/IWalletService';

export class WalletService implements IWalletService {

  constructor(private walletValidator: WalletValidator) {
    this.walletValidator = walletValidator;
  }

  async createWallet(userId: string, name: string): Promise<ServiceResponse<IWallet>> {
    if (!name?.trim()) {
      return {
        status: 400,
        error: 'Wallet name is required'
      };
    }

    const existingWallet = await Wallet.findOne( { name } );

    if(existingWallet){
      return {
        status: 400,
        error: `Wallet with name ${name} already exists.`
      };
    }

    return this.walletValidator.executeWalletOperation(async () => {
      const wallet = new Wallet({ userId, name: name.trim(), balance: 0 });
      await wallet.save();
      return {
        status: 201,
        data: wallet
      };
    });
  }

  async getWallets(userId: string): Promise<ServiceResponse<IWallet[]>> {
    return this.walletValidator.executeWalletOperation(async () => {
      const wallets = await Wallet.find({ userId });
      return {
        status: 200,
        data: wallets
      };
    });
  }
  async getWallet(userId: string, walletId: string): Promise<ServiceResponse<IWallet>> {
    return this.walletValidator.executeWalletOperation(() => this.walletValidator.validateAndFindWallet(userId, walletId));
  }

  async deposit(userId: string, walletId: string, amount: any): Promise<ServiceResponse<{ balance: number }>> {
    const amountValidation = this.walletValidator.validateAmount(amount);
    if (!amountValidation.isValid) {
      return amountValidation.error!;
    }

    return this.walletValidator.executeWalletOperation(async () => {
      const walletResponse = await this.walletValidator.validateAndFindWallet(userId, walletId);
      if (walletResponse.error) {
        return walletResponse as ServiceResponse<{ balance: number }>;
      }

      const wallet = walletResponse.data!;
   
      this.processDeposit(wallet, amount);

      await wallet.save();
      return {
        status: 200,
        data: { balance: wallet.balance }
      };
    });
  }

  private processDeposit(wallet:IWallet, amount:number): void {
    wallet.balance += amount;
    
    wallet.transactions.push({
      type: 'deposit',
      amount,
      timestamp: new Date()
    });
    
  }

  async withdraw(userId: string, walletId: string, amount: any): Promise<ServiceResponse<{ balance: number }>> {
    const amountValidation = this.walletValidator.validateAmount(amount);
    if (!amountValidation.isValid) {
      return amountValidation.error!;
    }

    return this.walletValidator.executeWalletOperation(async () => {
      const walletResponse = await this.walletValidator.validateAndFindWallet(userId, walletId);
      if (walletResponse.error) {
        return walletResponse as ServiceResponse<{ balance: number }>;
      }

      const wallet = walletResponse.data!;
      const numberAmount = Number(amount);
      
      if (wallet.balance < numberAmount) {
        return {
          status: 400,
          error: 'Insufficient funds'
        };
      }

     this.processWithdraw(wallet, numberAmount);

      await wallet.save();
      return {
        status: 200,
        data: { balance: wallet.balance }
      };
    });
  }

  private processWithdraw(wallet:IWallet, amount:number):void{
    wallet.balance -= amount;

    wallet.transactions.push({
      type: 'withdraw',
      amount,
      timestamp: new Date()
    });
  }

  
}