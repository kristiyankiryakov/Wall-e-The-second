import { IWallet, ServiceResponse } from "../../types";

export interface IWalletService {
  createWallet(userId: string, name: string): Promise<ServiceResponse<IWallet>>;
  getWallets(userId: string): Promise<ServiceResponse<IWallet[]>>;
  getWallet(userId: string, walletId: string): Promise<ServiceResponse<IWallet>>;
  deposit(userId: string, walletId: string, amount: number): Promise<ServiceResponse<{ balance: number }>>;
  withdraw(userId: string, walletId: string, amount: number): Promise<ServiceResponse<{ balance: number }>>;
}