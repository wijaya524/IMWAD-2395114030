/**
 * Utility untuk menghitung HMAC-SHA256 signature pada payload telemetri.
 * Mendukung environment Browser (Web Crypto API) dan Node.js (crypto module).
 */

export async function computeHmacSha256(message: string, secret: string = 'telemetry_device_secret_salt_key'): Promise<string> {
  // Jika berjalan di Node.js
  if (typeof window === 'undefined') {
    try {
      const nodeCrypto = await import('crypto');
      return nodeCrypto.createHmac('sha256', secret).update(message).digest('hex');
    } catch {
      // Fallback ke Web Crypto
    }
  }

  // Jika berjalan di Browser (Web Crypto API)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback fallback deterministik (jika subtle crypto tidak tersedia di insecure context)
  return 'hmac_sha256_mock_hash';
}
