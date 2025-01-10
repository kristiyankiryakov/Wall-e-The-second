import { IUser, ServiceResponse } from "../../types";

export interface IAuthService {
  register(userData: {
    username: string;
    password: string;
  }): Promise<ServiceResponse<{ token: string }>>;
  
  login(credentials: {
    username: string;
    password: string;
  }): Promise<ServiceResponse<{ token: string }>>;
}