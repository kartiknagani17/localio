// Converts any string to a URL-safe lowercase slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')  // remove special characters
    .replace(/\s+/g, '-')          // spaces to dashes
    .replace(/-+/g, '-')           // collapse consecutive dashes
    .replace(/^-+|-+$/g, '');      // trim leading and trailing dashes
}

// Generates a 4-character random alphanumeric suffix (a-z, 0-9)
function randomSuffix(len = 4): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: len }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

// Generates a unique slug by checking the DB first.
// Returns the plain slugified business name if available.
// Only appends a 4-char random suffix if the base slug is already taken.
// Retries up to 5 times on the (extremely rare) suffixed collision.
export async function generateUniqueSlug(businessName: string, supabase: any): Promise<string> { // eslint-disable-line
  const base = slugify(businessName);

  // Check if the base slug is free
  const { data: existing } = await supabase
    .from('sites')
    .select('id')
    .eq('slug', base)
    .maybeSingle();

  if (!existing) return base;

  // Base slug taken — try up to 5 times with a 4-char suffix
  for (let i = 0; i < 5; i++) {
    const candidate = `${base}-${randomSuffix()}`;
    const { data: taken } = await supabase
      .from('sites')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();
    if (!taken) return candidate;
  }

  // Absolute fallback (virtually unreachable)
  return `${base}-${Date.now().toString(36).slice(-4)}`;
}
