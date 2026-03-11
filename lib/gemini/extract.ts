import { GoogleGenerativeAI } from '@google/generative-ai';
import { BusinessData, SiteCopy } from '@/templates/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ExtractInput {
  businessName: string;
  city:         string;
  businessType: string;
}

export async function extractBusinessData(
  raw: ExtractInput
): Promise<BusinessData> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 65536, // avoid truncation of full BusinessData JSON
    },
  });

  const prompt = buildPrompt(raw);
  const result = await model.generateContent(prompt);
  const text   = result.response.text();

  const clean = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  const parsed: BusinessData = parseOrRepair(clean);

  parsed.name         = parsed.name         || raw.businessName;
  parsed.businessType = parsed.businessType || raw.businessType;
  parsed.city         = parsed.city         || raw.city;

  parsed.services       = parsed.services       ?? [];
  parsed.gallery        = parsed.gallery        ?? [];
  parsed.testimonials   = parsed.testimonials   ?? [];
  parsed.faq            = parsed.faq            ?? [];
  parsed.stats          = parsed.stats          ?? [];
  parsed.certifications = parsed.certifications ?? [];
  parsed.serviceAreas   = parsed.serviceAreas   ?? [raw.city];
  parsed.copy           = parsed.copy           ?? {} as SiteCopy;

  // Normalise testimonials: Gemini sometimes returns { review, quote, message }
  // instead of the required { text } field. Map any known alias → text.
  parsed.testimonials = parsed.testimonials.map((t: Record<string, unknown>) => ({
    ...t,
    text:   (t.text   as string) || (t.review as string) || (t.quote as string) || (t.message as string) || '',
    rating: (t.rating as number) ?? 5,
  }));

  return parsed;
}

function parseOrRepair(clean: string): BusinessData {
  try {
    return JSON.parse(clean) as BusinessData;
  } catch {
    // Gemini sometimes truncates mid-string/object — attempt quick repairs
    const trimmed = clean.trimEnd();
    const repairs = [
      trimmed + (trimmed.endsWith('"') ? '}' : '"}'),
      trimmed.replace(/,+\s*$/, '') + '}',
    ];
    for (const repaired of repairs) {
      try {
        return JSON.parse(repaired) as BusinessData;
      } catch {
        // try next repair
      }
    }
    throw new Error(
      `Gemini returned invalid JSON. Preview: ${clean.slice(0, 300)}`
    );
  }
}

function buildPrompt(raw: ExtractInput): string {
  return `You are a professional website copywriter for local businesses.
Given the raw business information below, return a complete JSON object.
The object must exactly match the BusinessData TypeScript interface.

RULES — follow every one precisely:
1.  Return ONLY raw JSON. No markdown. No code fences. No explanation.
    Start with { and end with }.
2.  Every field in BusinessData must be present in your response.
3.  For any field the owner did not provide, generate professional content.
4.  tagline: max 6 words, punchy, specific to this business type.
5.  subTagline: max 12 words, one supporting sentence.
6.  description: exactly 2-3 sentences, first-person plural (We...).
7.  Generate exactly 4 faq entries relevant to this specific business type.
    Each entry MUST use exactly these two fields: { "q": "the question", "a": "the answer" }.
8.  Generate exactly 4 stats entries (years in business, customers, etc.).
9.  Tone matches the business: energetic for gyms, warm for salons,
    professional for contractors, inviting for restaurants.
10. Generate 3-5 services with name, price, duration, description, and features.
11. services[].description: one sentence maximum.
12. services[].features: array of 4-5 short strings.
13. businessType must be snake_case e.g. car_detailer, hair_salon.
14. hours must be an object with weekdays, saturday, and sunday strings.
15. All arrays must be actual arrays. Never null.
16. testimonials: generate 3 realistic fake customer reviews.
    Each MUST use exactly these fields: { "name": "First L.", "text": "The review text here.", "rating": 5, "context": "Service type — City" }.
    Use "text" — never "review", "quote", or "message".
17. Generate 2-4 certifications relevant to this business type.
18. Generate 2-4 service areas near the given city.
19. Each stat object MUST include three fields: value (the number as a string, e.g. "2400"),
    label (e.g. "Cars Detailed"), and suffix (e.g. "+" or "%" or "★" or " yrs").
    Never include the suffix inside the value string.
20. Generate a "copy" object with ALL of the following keys. Make the language feel
    authentic and specific to this exact business type and city. Every value must be
    a short string (max 10 words). Keep tone consistent with Rule 9.
    Required keys:
      nav_cta, hero_cta_primary, hero_cta_secondary,
      services_label, services_heading, services_subheading, services_item_cta,
      gallery_label, gallery_heading, gallery_subheading, gallery_cta,
      testimonials_label,
      team_label, team_heading,
      about_label, about_heading, about_cta,
      faq_label, faq_heading,
      cta_label, cta_heading, cta_subheading, cta_primary.

INPUT:
businessType:   ${raw.businessType}
businessName:   ${raw.businessName}
city:           ${raw.city}

Return the JSON object now:`;
}
