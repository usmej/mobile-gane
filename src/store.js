// Purchase layer. The game only talks to this module, never to a payment provider directly.
//  - 'test'  : fake store for development (?shoptest in the URL). No real money ever moves.
//  - 'native': Apple / Google in-app purchase through the app wrapper (to be added when we ship
//              the app; see docs/PAYMENTS.md). Card details never touch our code.
//  - null    : no store available (the live website today). Paid items show "Coming soon".
import { CONFIG } from './config.js';
import { getProduct } from './products.js';

function testMode() {
  try { return new URLSearchParams(location.search).has('shoptest'); } catch (e) { return false; }
}

export function storeKind() {
  if (window.MassDashNativeStore) return 'native';
  if (testMode()) return 'test';
  return CONFIG.payments.enabled ? 'native' : null;
}

export function storeAvailable() {
  const k = storeKind();
  return k === 'test' || (k === 'native' && !!window.MassDashNativeStore);
}

// Resolves { ok: true, productId } or { ok: false, reason }.
export async function purchase(productId) {
  const product = getProduct(productId);
  if (!product) return { ok: false, reason: 'unknown product' };
  const kind = storeKind();
  if (kind === 'test') {
    await new Promise((r) => setTimeout(r, 400));
    return { ok: true, productId, test: true };
  }
  if (kind === 'native' && window.MassDashNativeStore) {
    try { return await window.MassDashNativeStore.purchase(productId); } catch (e) { return { ok: false, reason: 'failed' }; }
  }
  return { ok: false, reason: 'unavailable' };
}

// Resolves an array of product ids the player already owns (store is the source of truth).
export async function restore() {
  const kind = storeKind();
  if (kind === 'native' && window.MassDashNativeStore) {
    try { return await window.MassDashNativeStore.restore(); } catch (e) { return []; }
  }
  return [];
}
