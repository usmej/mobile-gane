// Real-money products (cosmetic only). Prices shown here are the fallback for test mode;
// a real app store returns the localized price at runtime.
// RULES (docs/PAYMENTS.md): cosmetics only, never gems/mass/levels/continues, no random rewards,
// price always shown in real money, every purchase goes through the parent gate + a confirm screen.
export const PRODUCTS = [
  {
    id: 'massdash.supporter',
    title: 'Supporter Pack',
    price: '$2.99',
    blurb: 'Golden Triple T, plus a big thank-you for supporting Mass Dash.',
    grants: { skins: ['golden-t'] },
    oneTime: true,
  },
];

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

export function productForSkin(skinId) {
  return PRODUCTS.find((p) => p.grants?.skins?.includes(skinId)) || null;
}
