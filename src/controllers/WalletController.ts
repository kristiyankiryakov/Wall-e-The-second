import { Request, Response } from 'express';
import { WalletService } from '../services/WalletService';
import { WalletValidator } from '../validators/WalletValidator';

const walletValidator = new WalletValidator();
const walletService = new WalletService(walletValidator);

export const createWallet = async (req: Request, res: Response) => {
  const response = await walletService.createWallet(req.user!.userId, req.body.name);
  return res.status(response.status).json(response.error ? { error: response.error } : response.data);
};

export const getWallets = async (req: Request, res: Response) => {
  const response = await walletService.getWallets(req.user!.userId);
  return res.status(response.status).json(response.error ? { error: response.error } : response.data);
};

export const getWallet = async (req: Request, res: Response) => {
  const response = await walletService.getWallet(req.user!.userId, req.params.walletId);
  return res.status(response.status).json(response.error ? { error: response.error } : response.data);
};

export const deposit = async (req: Request, res: Response) => {
  const response = await walletService.deposit(req.user!.userId, req.params.walletId, req.body.amount);
  return res.status(response.status).json(response.error ? { error: response.error } : response.data);
};

export const withdraw = async (req: Request, res: Response) => {
  const response = await walletService.withdraw(req.user!.userId, req.params.walletId, req.body.amount);
  return res.status(response.status).json(response.error ? { error: response.error } : response.data);
};