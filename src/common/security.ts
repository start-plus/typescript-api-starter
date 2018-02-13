import * as crypto from 'mz/crypto';
import { randomBytes as randomBytesSync } from 'crypto';
import * as config from 'config';

/**
 * Random a string
 * @param {Number} length the expected length
 * @returns {String} the string
 */
export function randomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
  const randomBytes = randomBytesSync(length);
  const result = new Array(length);
  let cursor = 0;
  for (let i = 0; i < length; i++) {
    cursor += randomBytes[i];
    result[i] = chars[cursor % chars.length];
  }
  return result.join('');
}
/**
 * Create password hash with pbkdf2
 * @param password the user password
 * @param salt the salt
 * @returns the password hash
 */
export async function createPasswordHash(password: string, salt: string) {
  const hash = await crypto.pbkdf2(
    password,
    salt,
    config.SECURITY.ITERATIONS,
    config.SECURITY.PASSWORD_LENGTH,
    'sha1',
  );
  return hash.toString('hex');
}
