import express from 'express';
import * as walletController from '../controllers/WalletController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.use(auth);

router.post('/', walletController.createWallet);

router.get('/', walletController.getWallets);

router.get('/:walletId', walletController.getWallet);

router.put('/:walletId/deposit', walletController.deposit);

router.put('/:walletId/withdraw', walletController.withdraw);

export default router;