import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '@/core/config';

export interface UserTokenPayload {
  sub: string;      // User ID (UUID)
  email: string;
  role: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number; // detik (1800s = 30 menit)
}

const JWT_SECRET: string = env.SECRET_KEY;
const ACCESS_EXPIRES_IN = `${env.ACCESS_TOKEN_EXPIRE_MINUTES}m`; // Default: 30 menit
const REFRESH_EXPIRES_IN = '7d';                                 // 7 hari

/**
 * Mengenerate Access Token (30 menit) dan Refresh Token (7 hari)
 */
export function generate_token_pair(payload: UserTokenPayload): TokenPair {
  const signOptions: SignOptions = {
    algorithm: 'HS256',
  };

  // 1. Access Token: masa berlaku 30 menit
  const access_token = jwt.sign(
    {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      token_type: 'access',
    },
    JWT_SECRET,
    { ...signOptions, expiresIn: ACCESS_EXPIRES_IN }
  );

  // 2. Refresh Token: masa berlaku 7 hari (hanya membawa sub untuk meminimalkan data exposure)
  const refresh_token = jwt.sign(
    {
      sub: payload.sub,
      token_type: 'refresh',
    },
    JWT_SECRET,
    { ...signOptions, expiresIn: REFRESH_EXPIRES_IN }
  );

  return {
    access_token,
    refresh_token,
    token_type: 'Bearer',
    expires_in: env.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
  };
}

/**
 * Verifikasi dan decode Access Token.
 * Melempar error spesifik jika token invalid atau expired.
 */
export function verify_access_token(token: string): UserTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as any;
  if (decoded.token_type !== 'access') {
    throw new Error('INVALID_TOKEN_TYPE');
  }
  return {
    sub: decoded.sub,
    email: decoded.email,
    role: decoded.role,
  };
}

/**
 * Verifikasi Refresh Token.
 */
export function verify_refresh_token(token: string): { sub: string } {
  const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as any;
  if (decoded.token_type !== 'refresh') {
    throw new Error('INVALID_TOKEN_TYPE');
  }
  return { sub: decoded.sub };
}