// errorHandler.ts
import { ServiceResponse } from '../types';

export class ErrorHandler {
  private static errorMessages: { [key: string]: { status: number; message: string } } = {
    'Insufficient funds': { status: 400, message: 'Insufficient funds' },
    'Transaction amount must be positive': { status: 400, message: 'Transaction amount must be positive' },
    'Wallet with such name already exists.': { status: 400, message: 'Wallet with such name already exists.' },
  };

  public static handleError(error: any): ServiceResponse<any> {
    const errorInfo = this.errorMessages[error.message] || { status: 500, message: 'Internal server error' };
    return {
      status: errorInfo.status,
      error: errorInfo.message
    };
  }
}