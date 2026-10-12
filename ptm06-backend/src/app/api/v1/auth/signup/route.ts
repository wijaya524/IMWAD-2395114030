import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import { SignupSchema } from '@/models/auth.dto';
import { AppError } from '@/core/error';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SignupSchema.parse(body);
    const user = await authService.signup(parsed);
    return NextResponse.json({ status: 'SUCCESS', message: 'Registrasi berhasil', data: user }, { status: 201 });
  } catch (err: any) {
    if (err instanceof AppError) return NextResponse.json({ status: 'ERROR', error_code: err.errorCode, message: err.message }, { status: err.statusCode });
    return NextResponse.json({ status: 'ERROR', message: err.message || 'Validation error' }, { status: 400 });
  }
}