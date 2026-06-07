import crypto from "crypto";

/**
 * Password hashing with scrypt (built into Node — no native bcrypt needed).
 * Format: scrypt$N$salt$hash (all hex). Verified in constant time.
 */
const N = 16384;
const KEYLEN = 64;

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16);
    crypto.scrypt(password, salt, KEYLEN, { N }, (err, derived) => {
      if (err) return reject(err);
      resolve(`scrypt$${N}$${salt.toString("hex")}$${derived.toString("hex")}`);
    });
  });
}

export function verifyPassword(password: string, stored: string): Promise<boolean> {
  return new Promise((resolve) => {
    const parts = stored.split("$");
    if (parts.length !== 4 || parts[0] !== "scrypt") return resolve(false);
    const cost = parseInt(parts[1], 10);
    const salt = Buffer.from(parts[2], "hex");
    const expected = Buffer.from(parts[3], "hex");
    crypto.scrypt(password, salt, expected.length, { N: cost }, (err, derived) => {
      if (err) return resolve(false);
      resolve(derived.length === expected.length && crypto.timingSafeEqual(derived, expected));
    });
  });
}
