import { z } from 'zod';

const envSchema = z.object({
  // Konfigurasi Database PostgreSQL & Prisma
  DATABASE_URL: z.string().url('DATABASE_URL harus berupa URL koneksi yang valid'),

  // Konfigurasi Keamanan JWT
  SECRET_KEY: z
    .string()
    .min(32, 'SECRET_KEY wajib memiliki panjang minimal 32 karakter demi keamanan'),
  ALGORITHM: z.string().default('HS256'),
  ACCESS_TOKEN_EXPIRE_MINUTES: z.coerce.number().default(30),

  // Konfigurasi Header Keamanan Perangkat Telemetri (HMAC)
  DEVICE_HMAC_SECRET: z
    .string()
    .min(16, 'DEVICE_HMAC_SECRET minimal 16 karakter')
    .default('telemetry_device_secret_salt_key'),

  // Konfigurasi Model AI & File Upload
  MODEL_PATH: z.string().default('./models/decision_tree.pkl'),
  SCALER_PATH: z.string().default('./models/scaler.pkl'),
  MAX_FILE_SIZE_MB: z.coerce.number().default(5),
  
  // Environment Mode
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

// Parsing dan validasi process.env
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Konfigurasi Environment Variable (.env) tidak valid:');
  console.error(parsedEnv.error.format());
  throw new Error('Gagal memuat konfigurasi sistem. Periksa kembali berkas .env Anda.');
}

export const env = parsedEnv.data;