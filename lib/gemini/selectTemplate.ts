import { TEMPLATE_REGISTRY } from '@/templates/registry';
import { BusinessData } from '@/templates/types';

export function selectTemplate(businessData: BusinessData): string {
  const type = businessData.businessType
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_');

  const candidates = TEMPLATE_REGISTRY.filter(t => {
    if (t.id === '_placeholder') return false;
    if (t.notFor.includes(type)) return false;

    // Exclude templates whose requiredFields are missing or empty
    for (const field of t.requiredFields) {
      const val = businessData[field];
      if (val === undefined || val === null || val === '') return false;
      if (Array.isArray(val) && val.length === 0) return false;
    }

    return true;
  });

  if (candidates.length === 0) return '_placeholder';

  // 1. Exact match: businessType is directly in a template's bestFor list
  const exactMatches = candidates.filter(t => t.bestFor.includes(type));
  if (exactMatches.length === 1) return exactMatches[0].id;
  if (exactMatches.length > 1) return weightedPick(exactMatches);

  // 2. Partial match: businessType contains or is contained within a bestFor keyword
  const partial = candidates.find(t =>
    t.bestFor.some(keyword => type.includes(keyword) || keyword.includes(type))
  );
  if (partial) return partial.id;

  // 3. No match found — use first available real template as generic fallback
  return candidates[0].id;
}

function weightedPick(templates: { id: string; priority?: number }[]): string {
  const totalWeight = templates.reduce((sum, t) => sum + (t.priority ?? 1), 0);
  let roll = Math.random() * totalWeight;
  for (const t of templates) {
    roll -= t.priority ?? 1;
    if (roll <= 0) return t.id;
  }
  return templates[templates.length - 1].id;
}
