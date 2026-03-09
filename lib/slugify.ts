// Converts any string to a URL-safe lowercase slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')  // remove special characters
    .replace(/\s+/g, '-')          // spaces to dashes
    .replace(/-+/g, '-')            // collapse consecutive dashes
    .replace(/^-+|-+$/g, '');       // trim leading and trailing dashes
}

// Generates a unique slug by appending a short base-36 timestamp suffix.
// Example: 'apex-auto-detailing' + Date.now().toString(36) = 'apex-auto-detailing-lrfb4c'
// The suffix guarantees uniqueness without needing a DB lookup first.
export function uniqueSlug(businessName: string): string {
  const base   = slugify(businessName);
  const suffix = Date.now().toString(36);
  return `${base}-${suffix}`;
}
