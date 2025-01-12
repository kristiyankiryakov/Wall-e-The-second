import { IWallet, ServiceResponse, ValidationResult } from "../../types";


export interface IWalletValidator{

 validateAmount(amount: any): ValidationResult;

 validateWalletName(name: string): ValidationResult;

 checkWalletNameExists(name: string): Promise<ValidationResult>;

}