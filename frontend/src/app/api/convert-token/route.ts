import { createHmac } from "node:crypto";

/**
 * Mints the short-lived pass the conversion worker requires.
 *
 * This is the whole reason the worker can be locked down. The signing secret
 * lives only in this server's environment and in the worker's — never in a
 * browser — so a bot cannot forge a pass, and cannot lift a usable one from
 * the page because each is issued per request and expires in two minutes.
 *
 * The route is intentionally trivial and does no work: it exists to prove the
 * request came from our own origin, which is something only a server holding
 * the secret can attest to.
 */

/** Must match TOKEN_TTL_MS in the worker's src/auth.js. */
const TTL_MS = 2 * 60 * 1000;

// Signed per request against the current clock, so there is nothing to cache
// and a cached response would hand out an already-expiring token.
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const secret = process.env.CONVERT_SHARED_SECRET;

  if (!secret) {
    // Fail closed and say so plainly. Returning a token that cannot work would
    // surface later as an authentication error on the worker, three layers
    // away from the actual cause.
    return Response.json(
      { error: "Conversion is not configured on this deployment." },
      { status: 503 }
    );
  }

  const expiresAt = Date.now() + TTL_MS;
  const signature = createHmac("sha256", secret).update(String(expiresAt)).digest("hex");

  return Response.json(
    { token: `${expiresAt}.${signature}`, expiresAt },
    {
      // Never store this: a shared cache handing the same token to everyone
      // would turn a per-request pass into a public one.
      headers: { "Cache-Control": "no-store, private" },
    }
  );
}
