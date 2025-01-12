import { WalletService } from './services/WalletService';
import { WalletValidator } from './validators/WalletValidator';

class Container {
  private static instance: Container;
  private instances: { [key: string]: any } = {};

  private constructor() {
    const walletValidator = new WalletValidator();
    const walletService = new WalletService(walletValidator);

    this.instances['walletValidator'] = walletValidator;
    this.instances['walletService'] = walletService;
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public get<T>(key: string): T {
    if (!this.instances[key]) {
      throw new Error(`No instance registered for key: ${key}`);
    }
    return this.instances[key];
  }
}

export default Container.getInstance();