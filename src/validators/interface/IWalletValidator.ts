import { IWallet, ServiceResponse, ValidationResult } from "../../types";


export interface IWalletValidator{

 validateAmount(amount: any): ValidationResult;

 validateAndFindWallet(userId: string, walletId: string): Promise<ServiceResponse<IWallet>>;

 handleServiceError(error: any): ServiceResponse<any>;
}