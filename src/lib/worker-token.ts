/**
 * Worker Token System — AES-256-GCM Encrypted + HMAC-SHA256 Signed
 *
 * Token format: base64url(iv).base64url(ciphertext).base64url(authTag).base64url(signature)
 *   - iv:        12-byte random initialization vector
 *   - ciphertext: AES-256-GCM encrypted JSON payload
 *   - authTag:   16-byte GCM authentication tag
 *   - signature:  HMAC-SHA256 of "iv.ciphertext.authTag" (tamper protection)
 */

import { createCipheriv, createDecipheriv, createHmac, createHash, timingSafeEqual, randomBytes } from 'crypto';

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'TF3k8mNx9qLz7wRv2sYp5iBc6dAo0gHj';
const TOKEN_EXPIRY = 8 * 60 * 60 * 1000; // 8 hours (CDN links typically expire within 8h)

// Derive separate keys for encryption and signing from TOKEN_SECRET
function deriveKeys() {
  const encKey = createHash('sha256').update(TOKEN_SECRET + ':encryption').digest();
  const sigKey = createHash('sha256').update(TOKEN_SECRET + ':signing').digest();
  return { encKey, sigKey };
}

interface TokenPayload {
  /** CDN URL to proxy/redirect to */
  u: string;
  /** Cookie header for CDN auth */
  c: string;
  /** Filename for Content-Disposition header */
  n: string;
  /** Mode: 'download' | 'stream' | 'thumbnail' */
  m: string;
  /** Expiration timestamp (ms) */
  e: number;
}

/**
 * Generate an encrypted + signed token for the Cloudflare Worker.
 *
 * Steps:
 * 1. Create JSON payload { u, c, n, m, e }
 * 2. Encrypt with AES-256-GCM (random 12-byte IV)
 * 3. Sign "iv.ciphertext.authTag" with HMAC-SHA256
 * 4. Return "iv.ciphertext.authTag.signature" as base64url segments
 */
export function generateWorkerToken(data: {
  url: string;
  cookie?: string;
  name?: string;
  mode: 'download' | 'stream' | 'thumbnail';
}): string {
  const { encKey, sigKey } = deriveKeys();

  const payload: TokenPayload = {
    u: data.url,
    c: data.cookie || '',
    n: data.name || 'download',
    m: data.mode,
    e: Date.now() + TOKEN_EXPIRY,
  };

  const payloadJson = JSON.stringify(payload);

  // Encrypt with AES-256-GCM
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(payloadJson, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Base64url encode all parts
  const ivB64 = iv.toString('base64url');
  const ctB64 = encrypted.toString('base64url');
  const tagB64 = authTag.toString('base64url');

  // Sign "iv.ciphertext.authTag" with HMAC-SHA256
  const signInput = `${ivB64}.${ctB64}.${tagB64}`;
  const signature = createHmac('sha256', sigKey)
    .update(signInput)
    .digest('base64url');

  return `${ivB64}.${ctB64}.${tagB64}.${signature}`;
}

/**
 * Verify and decrypt a worker token.
 * Returns null if the token is invalid, tampered, or expired.
 *
 * Steps:
 * 1. Split token into iv, ciphertext, authTag, signature
 * 2. Verify HMAC-SHA256 signature (tamper detection)
 * 3. Decrypt with AES-256-GCM
 * 4. Parse JSON payload
 * 5. Check expiration
 */
export function verifyWorkerToken(token: string): TokenPayload | null {
  try {
    const { encKey, sigKey } = deriveKeys();

    const parts = token.split('.');
    if (parts.length !== 4) return null;

    const [ivB64, ctB64, tagB64, signature] = parts;
    if (!ivB64 || !ctB64 || !tagB64 || !signature) return null;

    // Step 1: Verify HMAC signature (tamper detection)
    const signInput = `${ivB64}.${ctB64}.${tagB64}`;
    const expectedSig = createHmac('sha256', sigKey)
      .update(signInput)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

    // Step 2: Decrypt with AES-256-GCM
    const iv = Buffer.from(ivB64, 'base64url');
    const ciphertext = Buffer.from(ctB64, 'base64url');
    const authTag = Buffer.from(tagB64, 'base64url');

    const decipher = createDecipheriv('aes-256-gcm', encKey, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    // Step 3: Parse payload
    const payloadJson = decrypted.toString('utf-8');
    const payload: TokenPayload = JSON.parse(payloadJson);

    // Step 4: Check expiration
    if (payload.e && Date.now() > payload.e) return null;

    return payload;
  } catch {
    // Decryption fails = invalid/tampered token
    return null;
  }
}

/**
 * Build a full Worker URL with an encrypted signed token
 */
export function buildWorkerUrl(
  workerUrl: string,
  data: {
    url: string;
    cookie?: string;
    name?: string;
    mode: 'download' | 'stream' | 'thumbnail';
  }
): string {
  const token = generateWorkerToken(data);
  // Clean worker URL (remove trailing slash)
  const base = workerUrl.replace(/\/+$/, '');
  return `${base}/${data.mode}?token=${token}`;
}
