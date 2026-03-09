// templates/types.ts
// Single source of truth for all data shapes in Localio.
// Import from here in every component, API route, and template.

// ── A single service offered by the business ──────────────────────────────
export interface ServiceItem {
  name: string;
  price?: string;
  duration?: string;
  description?: string;
  features?: string[];
}

// ── A single image in the gallery or before/after section ─────────────────
export interface GalleryItem {
  imageUrl: string;
  label?: string;
  type: 'before' | 'after' | 'general';
}

// ── A customer review ─────────────────────────────────────────────────────
export interface Testimonial {
  name: string;
  text: string;
  rating: number;    // 1 to 5
  context?: string;  // e.g. 'BMW M4 — Full Detail'
}

// ── A single FAQ entry ────────────────────────────────────────────────────
export interface FAQ {
  q: string;
  a: string;
}

// ── Section copy — all visible text personalised by Gemini ────────────────
export interface SiteCopy {
  // Nav
  nav_cta:             string;  // "Book Now" / "Schedule a Visit"

  // Hero
  hero_cta_primary:    string;  // "Book a Detail" / "Book an Appointment"
  hero_cta_secondary:  string;  // "See Results" / "View Gallery"

  // Services section
  services_label:      string;  // "What We Offer" / "Our Services"
  services_heading:    string;  // "Detail Packages" / "Crafted for You"
  services_subheading: string;  // "Every service performed by certified technicians..."
  services_item_cta:   string;  // "Book This Package" / "Book This Service"

  // Gallery section
  gallery_label:       string;  // "The Results" / "The Work"
  gallery_heading:     string;  // "Before & After" / "Beauty That Speaks for Itself"
  gallery_subheading:  string;  // "Drag the slider to see..." / "Every cut, every colour."
  gallery_cta:         string;  // "Book Now →" / "See Our Work →"

  // Testimonials section
  testimonials_label:  string;  // "What Clients Say" / "Client Love"

  // Team section (HairSalon; ignored by CarDetailing)
  team_label:          string;  // "The Team" / "Meet the Artists"
  team_heading:        string;  // "Artists, Not Just Stylists" / "Your Specialists"

  // About section
  about_label:         string;  // "Our Story" / "Our Philosophy"
  about_heading:       string;  // "Precision in every pass." / "More than a salon."
  about_cta:           string;  // "Book Your Detail" / "Book a Consultation"

  // FAQ section
  faq_label:           string;  // "Got Questions?" / "Questions"
  faq_heading:         string;  // "Common Questions" / "Everything You Need to Know"

  // Final CTA section
  cta_label:           string;  // "Get In Touch" / "Begin Your Experience"
  cta_heading:         string;  // "Ready for a showroom finish?" / "Your transformation starts here."
  cta_subheading:      string;  // "Book online in 60 seconds or give us a call."
  cta_primary:         string;  // "Book Online" / "Reserve Your Appointment"
}

// ── A stat display (e.g. '500+ Cars', 'Since 2012') ──────────────────────
export interface Stat {
  value: string | number;  // Gemini may return either format; StatCounter handles both
  label: string;
  suffix?: string;         // e.g. '+', '%', '★' — rendered after the animated number
}

// ── Business operating hours ──────────────────────────────────────────────
export interface BusinessHours {
  weekdays?: string;   // e.g. 'Mon - Fri: 9am - 5pm'
  saturday?: string;   // e.g. 'Sat: 10am - 3pm'
  sunday?: string;     // e.g. 'Closed'
}

// ── Core data object — drives every template ──────────────────────────────
// Populated by Gemini from form input.
// Stored as jsonb in the sites table.
// Passed as the only prop to every template component.
export interface BusinessData {
  // Always present — required fields
  name:         string;
  businessType: string;  // snake_case: 'car_detailer', 'hair_salon', etc.
  city:         string;
  // Contact
  phone?:       string;
  email?:       string;
  address?:     string;
  bookingUrl?:  string;
  // Hero copy
  tagline?:     string;
  subTagline?:  string;
  // About section
  description?: string;
  // Hours
  hours?:       BusinessHours;
  // Content — always arrays, never undefined (default to [])
  services?:       ServiceItem[];
  gallery?:        GalleryItem[];
  testimonials?:   Testimonial[];
  faq?:            FAQ[];
  stats?:          Stat[];
  certifications?: string[];
  serviceAreas?:   string[];
  copy?:           SiteCopy;
}

// ── The only prop shape every template accepts ────────────────────────────
export interface TemplateProps {
  businessData: BusinessData;
  // When true the template is being rendered inside the preview editor.
  // Templates should disable any global side-effects (custom cursors, body
  // style mutations, etc.) so they don't bleed into the editor chrome.
  isPreview?: boolean;
}

// ── Raw data from the form — before Gemini extraction ─────────────────────
export interface RawFormData {
  businessType: string;
  businessName: string;
  city:         string;
  phone?:       string;
  email?:       string;
  description?: string;
  services?: Array<{
    name:     string;
    price:    string;
    duration: string;
  }>;
  uploadedImageUrls?: Array<{
    url:   string;
    type:  'before' | 'after' | 'general';
    label: string;
  }>;
  hours?: Record<string, {
    open:   string;
    close:  string;
    closed: boolean;
  }>;
  bookingUrl?: string;
}

// ── The 3-question onboarding form ──────────────────────────────────────
// Replaces the full RawFormData for initial generation.
// RawFormData is kept above — it may be used in future.
export interface QuickFormData {
  businessName: string;
  city:         string;
  businessType: string;
}

// ── Partial update sent from the dashboard to /api/update/[id] ──────────
// Only changed fields are sent. The API merges into the existing DB record.
export type BusinessDataPatch = Partial<BusinessData>;

// ── Shape of a row returned from the Supabase sites table ─────────────────
export interface SiteRow {
  id:            string;
  slug:          string;
  template_id:   string;
  business_data: BusinessData;
  status:        'preview' | 'published';
  created_at:    string;
}
