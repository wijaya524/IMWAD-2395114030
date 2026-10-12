import { NextRequest, NextResponse } from 'next/server';
import { verify_access_token, UserTokenPayload } from '@/core/jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: UserTokenPayload;
}

/**
 * Helper guard untuk melindungi endpoint (Protected Route)
 * Mengembalikan UserTokenPayload jika sah, atau NextResponse (HTTP 401/403) jika tidak sah.
 */
export function authenticate_request(req: NextRequest): UserTokenPayload | NextResponse {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      {
        status: 'ERROR',
        error_code: 'ERR_MISSING_TOKEN',
        message: 'Header otorisasi Bearer token wajib disertakan',
      },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7).trim();

  try {
    const userPayload = verify_access_token(token);
    return userPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        {
          status: 'ERROR',
          error_code: 'ERR_TOKEN_EXPIRED',
          message: 'Access token telah kadaluarsa, silakan gunakan refresh token',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        status: 'ERROR',
        error_code: 'ERR_INVALID_TOKEN',
        message: 'Kredensial token tidak valid atau telah dimanipulasi',
      },
      { status: 401 }
    );
  }
}