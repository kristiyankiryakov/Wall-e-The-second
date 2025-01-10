import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { JWTPayload } from '../types';
import { IAuthService } from './interfaces/IAuthService';

export class AuthService implements IAuthService {
  
  public async register(userData: { username: string; password: string }) {
    try {
      this.throwIfUserExists(userData);

      const user = new User(userData);
      await user.save();

      const token = this.generateToken({ userId: user._id, username: user.username });

      return {
        status: 201,
        data: { user, token }
      };
    } catch (error: any) {
      return {
        status: 500,
        error: error.message
      };
    }
  }

  public async login(credentials: { username: string; password: string }) {
    try {
      const user = await User.findOne({ username: credentials.username });
      if (!user) {
        return {
          status: 401,
          error: 'Invalid credentials'
        };
      }

      const isMatch = await bcrypt.compare(credentials.password, user.password);
      if (!isMatch) {
        return {
          status: 401,
          error: 'Invalid credentials'
        };
      }

      const token = this.generateToken({ userId: user._id, username: user.username });

      return {
        status: 200,
        data: { user, token }
      };
    } catch (error: any) {
      return {
        status: 500,
        error: error.message
      };
    }
  }

  private generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });
  }

  private async throwIfUserExists(userData:{ username: string; password: string }){
    const existingUser = await User.findOne({ username: userData.username });

    if (existingUser) {
      return {
        status: 400,
        error: 'Username already taken'
      };
    }

  }

}