import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  const authResponse = await authService.register(req.body);

  return res.status(authResponse.status).json(authResponse.error ? { error: authResponse.error } : authResponse.data);
};

export const login = async (req: Request, res: Response) => {
  const response = await authService.login(req.body);
  return res.status(response.status).json(response.error ? { error: response.error } : response.data);
};