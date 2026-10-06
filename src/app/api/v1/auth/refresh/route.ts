import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import { RefreshTokenSchema } from '@/models/auth.dto';
import { AppError } from '@/core/error';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = RefreshTokenSchema.parse(rawBody);

    const tokens = await authService.refreshToken(parsed.refresh_token);

    return NextResponse.json(
      {
        status: 'SUCCESS',
        message: 'Access token berhasil diperbarui',
        data: tokens,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { status: 'ERROR', error_code: error.errorCode, message: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { status: 'ERROR', error_code: 'ERR_VALIDATION', message: error.message || 'Format masukan tidak valid' },
      { status: 400 }
    );
  }
}   