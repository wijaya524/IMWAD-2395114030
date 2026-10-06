import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import { verifyToken } from '@/core/security';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ status: 'ERROR', error_code: 'ERR_UNAUTHORIZED', message: 'Token tidak disertakan' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ status: 'ERROR', error_code: 'ERR_INVALID_TOKEN', message: 'Token tidak valid atau kadaluarsa' }, { status: 401 });
  }

  const user = await authService.getProfile(decoded.userId);
  return NextResponse.json({ status: 'SUCCESS', data: user });
}