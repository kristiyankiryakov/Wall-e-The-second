import mongoose from "mongoose";
import { IWallet, ServiceResponse, ValidationResult } from "../types";
import { Wallet } from "../models/Wallet";
import { IWalletValidator } from "./interface/IWalletValidator";

export class WalletValidator implements IWalletValidator{

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

      public validateWalletName(name: string): ValidationResult {
        if (!name?.trim()) {
          return {
            isValid: false,
            error: {
              status: 400,
              error: 'Wallet name is required'
            }
          };
        }
        return { isValid: true };
      }

      async checkWalletNameExists(name: string): Promise<ValidationResult> {
        const existingWallet = await Wallet.findOne({ name: name.trim() });
        if (existingWallet) {
          return {
            isValid: false,
            error: {
              status: 400,
              error: `Wallet with such name already exists.`
            }
          };
        }
        return { isValid: true };
      }

}