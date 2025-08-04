export function scoreContract(offer: any, orgPrestige = 50): number {
  const base = parseInt(offer.basePay || 0);
  const bonus = parseInt(offer.bonus || 0);
  const prestigeFactor = orgPrestige * 0.5;
  const roleMultiplier = {
    'undercard': 1,
    'co-main': 1.2,
    'main-event': 1.5
  }[offer.role || 'undercard'];

  return base + bonus + prestigeFactor * (roleMultiplier || 1);
}
