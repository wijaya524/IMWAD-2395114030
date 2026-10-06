import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const SECRET_KEY = process.env.SECRET_KEY;

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateTokenPair(payload: { userId: string; email: string; role: string }) {
  // Access Token: 30 menit
  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '30m' });
  // Refresh Token: 7 hari
  const refreshToken = jwt.sign({ userId: payload.userId }, SECRET_KEY, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY) as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export function verifyDeviceHmac(rawBody: string, signature: string): boolean {
  const secret = process.env.DEVICE_HMAC_SECRET || 'telemetry_device_secret_salt_key';
  const computedHmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  const signatureBuffer = Buffer.from(signature);
  const computedBuffer = Buffer.from(computedHmac);

  if (signatureBuffer.length !== computedBuffer.length) return false;
  return crypto.timingSafeEqual(signatureBuffer, computedBuffer);
}