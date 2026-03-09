// templates/registry.ts
//
// This is the template registry. It starts with only the placeholder.
// Real templates are added here in a future phase.
// When a template is added:
//   1. Create the component at templates/{TemplateName}/index.tsx
//   2. Import it here and add one entry to TEMPLATE_REGISTRY
//   3. Nothing else changes

import React from 'react';
import { BusinessData, TemplateProps } from './types';
import PlaceholderTemplate from './_placeholder';
import CarDetailing from './CarDetailing';
import CarDetailing3 from './CarDetailing3';
import HairSalon from './HairSalon';
import Landscaper1 from './Landscaper1';
import Landscaper2 from './Landscaper2';
import Landscaper3 from './Landscaper3';
import Landscaper4 from './Landscaper4';
import Landscaper5 from './Landscaper5';
import Plumber1 from './Plumber1';
import Plumber2 from './Plumber2';
import Plumber3 from './Plumber3';
import Electrician1 from './Electrician1';
import Electrician2 from './Electrician2';
import Electrician3 from './Electrician3';

export interface TemplateColors {
  bg:     string;   // page background
  nav:    string;   // nav bar background
  accent: string;   // primary accent / CTA button color
  dark:   boolean;  // true = dark theme (hero text will be light)
}

export interface TemplateRegistryEntry {
  id:             string;                              // Unique ID: 'car-detailer-01'
  name:           string;                              // Display name: 'Apex Clean'
  description:    string;                              // One-sentence aesthetic summary
  bestFor:        string[];                            // businessType values this suits
  notFor:         string[];                            // businessType values to never use
  requiredFields: (keyof BusinessData)[];              // Must exist to use this template
  component:      React.ComponentType<TemplateProps>;  // The React component
  priority?:      number;                              // Weight for selection among matches (default 1)
  previewImageUrl?: string;                            // Static screenshot for future UI
  colorScheme?:   string;                              // e.g. 'warm', 'dark', 'clean'
  colors?:        TemplateColors;                      // Used by theme-picker mini preview card
}

export const TEMPLATE_REGISTRY: TemplateRegistryEntry[] = [
  // ── Placeholder — DO NOT REMOVE ────────────────────────────────────────
  // Used when no real template matches the business type.
  // Proves the pipeline works before real templates exist.
  {
    id:             '_placeholder',
    name:           'Placeholder',
    description:    'Development placeholder. Not for production use.',
    bestFor:        [],  // Empty: never matched directly, only used as fallback
    notFor:         [],
    requiredFields: ['name', 'city'],
    component:      PlaceholderTemplate,
    priority:       1,
  },

  // ── Real templates ──────────────────────────────────────────────────────
  {
    id:             'plumber-01',
    name:           'AquaPro',
    description:    'Dark and bold. Stands out immediately.',
    bestFor:        ['plumber', 'plumbing', 'plumbing_service', 'plumbing_company', 'emergency_plumber', 'drain_cleaning', 'pipe_repair', 'water_heater'],
    notFor:         ['restaurant', 'salon', 'hair_salon', 'gym', 'landscaper', 'car_detailer'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colorScheme:    'dark',
    colors:         { bg: '#080d1a', nav: '#0a1628', accent: '#00b4d8', dark: true },
    component:      Plumber1,
  },
  {
    id:             'plumber-02',
    name:           'Forge',
    description:    'Clean and professional. Classic, trustworthy feel.',
    bestFor:        ['plumber', 'plumbing', 'plumbing_service', 'plumbing_company', 'emergency_plumber', 'drain_cleaning', 'pipe_repair', 'water_heater'],
    notFor:         ['restaurant', 'salon', 'hair_salon', 'gym', 'landscaper', 'car_detailer'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colorScheme:    'light',
    colors:         { bg: '#fafaf8', nav: '#1c1c1c', accent: '#f97316', dark: false },
    component:      Plumber2,
  },
  {
    id:             'plumber-03',
    name:           'GreenLine',
    description:    'Fresh and earthy. Stands out from the crowd.',
    bestFor:        ['plumber', 'plumbing', 'plumbing_service', 'plumbing_company', 'emergency_plumber', 'drain_cleaning', 'pipe_repair', 'water_heater'],
    notFor:         ['restaurant', 'salon', 'hair_salon', 'gym', 'landscaper', 'car_detailer'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colorScheme:    'light',
    colors:         { bg: '#fefdf8', nav: '#2d6a4f', accent: '#d4a017', dark: false },
    component:      Plumber3,
  },
  {
    id:             'electrician-03',
    name:           'Spark',
    description:    'Bright and confident. Built to get the phone ringing.',
    bestFor:        ['electrician', 'electrical', 'electrical_contractor', 'electrical_service', 'master_electrician', 'electrical_repair', 'electrical_installation', 'ev_charger', 'smart_home_wiring'],
    notFor:         ['restaurant', 'salon', 'hair_salon', 'gym', 'landscaper', 'car_detailer', 'plumber'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colorScheme:    'light',
    colors:         { bg: '#fff5f5', nav: '#991b1b', accent: '#dc2626', dark: false },
    component:      Electrician3,
  },
  {
    id:             'electrician-02',
    name:           'Volt',
    description:    'Electric and bold. Demands attention right away.',
    bestFor:        ['electrician', 'electrical', 'electrical_contractor', 'electrical_service', 'master_electrician', 'electrical_repair', 'electrical_installation', 'ev_charger', 'smart_home_wiring'],
    notFor:         ['restaurant', 'salon', 'hair_salon', 'gym', 'landscaper', 'car_detailer', 'plumber'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colorScheme:    'light',
    colors:         { bg: '#eef2ff', nav: '#312e81', accent: '#eab308', dark: false },
    component:      Electrician2,
  },
  {
    id:             'electrician-01',
    name:           'CurrentFlow',
    description:    'Light and airy. Friendly, approachable vibe.',
    bestFor:        ['electrician', 'electrical', 'electrical_contractor', 'electrical_service', 'master_electrician', 'electrical_repair', 'electrical_installation', 'ev_charger', 'smart_home_wiring'],
    notFor:         ['restaurant', 'salon', 'hair_salon', 'gym', 'landscaper', 'car_detailer', 'plumber'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colorScheme:    'light',
    colors:         { bg: '#f0f9ff', nav: '#0c4a6e', accent: '#f59e0b', dark: false },
    component:      Electrician1,
  },
  {
    id:             'hair-salon-01',
    name:           'Maison Dorée',
    description:    'Luxury and upscale. Dark, rich editorial look.',
    bestFor:        ['hair_salon', 'beauty_salon', 'hairdresser', 'blow_dry_bar', 'hair_studio'],
    notFor:         ['restaurant', 'car_detailer', 'contractor', 'gym', 'medical'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colors:         { bg: '#1a0a2e', nav: '#120720', accent: '#c9a84c', dark: true },
    component:      HairSalon,
  },
  {
    id:             'car-detailer-01',
    name:           'Prestige Clean',
    description:    'Premium and polished. Clean, serious, trustworthy.',
    bestFor:        ['car_detailer', 'auto_detailing', 'car_wash', 'mobile_detailing'],
    notFor:         ['restaurant', 'salon', 'medical', 'gym'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colors:         { bg: '#f8f7f2', nav: '#1e3a5f', accent: '#c8a96e', dark: false },
    component:      CarDetailing,
  },
  {
    id:             'car-detailer-02',
    name:           'Velocity',
    description:    'High-energy and sporty. Fast, bold, eye-catching.',
    bestFor:        ['car_detailer', 'auto_detailing', 'car_wash', 'mobile_detailing', 'auto_spa', 'car_care', 'auto_detailer'],
    notFor:         ['restaurant', 'salon', 'medical', 'gym', 'hair_salon'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colorScheme:    'light',
    colors:         { bg: '#ffffff', nav: '#111111', accent: '#f97316', dark: false },
    component:      CarDetailing3,
  },
  {
    id:             'landscaper-01',
    name:           'Verdant',
    description:    'Natural and calm. Classic outdoor business look.',
    bestFor:        ['landscaper', 'lawn_care', 'lawn_service', 'garden_design', 'landscaping', 'gardener', 'tree_service', 'groundskeeping', 'lawn_maintenance'],
    notFor:         ['restaurant', 'salon', 'medical', 'gym', 'car_detailer', 'hair_salon'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colorScheme:    'light',
    colors:         { bg: '#faf7f0', nav: '#2d5a27', accent: '#5a9648', dark: false },
    component:      Landscaper1,
  },
  {
    id:             'landscaper-02',
    name:           'Botanica',
    description:    'Warm and organic. Feels rooted in nature.',
    bestFor:        ['landscaper', 'lawn_care', 'lawn_service', 'garden_design', 'landscaping', 'gardener', 'tree_service', 'groundskeeping', 'lawn_maintenance'],
    notFor:         ['restaurant', 'salon', 'medical', 'gym', 'car_detailer', 'hair_salon'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colorScheme:    'light',
    colors:         { bg: '#f5ede0', nav: '#3d5928', accent: '#d4820a', dark: false },
    component:      Landscaper2,
  },
  {
    id:             'landscaper-03',
    name:           'Terrain',
    description:    'Modern and minimal. Clean lines, bold contrast.',
    bestFor:        ['landscaper', 'lawn_care', 'lawn_service', 'garden_design', 'landscaping', 'gardener', 'tree_service', 'groundskeeping', 'lawn_maintenance'],
    notFor:         ['restaurant', 'salon', 'medical', 'gym', 'car_detailer', 'hair_salon'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colorScheme:    'light',
    colors:         { bg: '#f8fafc', nav: '#1e293b', accent: '#84cc16', dark: false },
    component:      Landscaper3,
  },
  {
    id:             'landscaper-04',
    name:           'GreenCraft',
    description:    'Lush and lively. Full of personality and movement.',
    bestFor:        ['landscaper', 'lawn_care', 'lawn_service', 'garden_design', 'landscaping', 'gardener', 'tree_service', 'groundskeeping', 'lawn_maintenance'],
    notFor:         ['restaurant', 'salon', 'medical', 'gym', 'car_detailer', 'hair_salon'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colorScheme:    'light',
    colors:         { bg: '#f0fdf4', nav: '#15803d', accent: '#22c55e', dark: false },
    component:      Landscaper4,
  },
  {
    id:             'landscaper-05',
    name:           'Canopy',
    description:    'Dark and premium. Makes your work look high-end.',
    bestFor:        ['landscaper', 'lawn_care', 'lawn_service', 'garden_design', 'landscaping', 'gardener', 'tree_service', 'groundskeeping', 'lawn_maintenance'],
    notFor:         ['restaurant', 'salon', 'medical', 'gym', 'car_detailer', 'hair_salon'],
    requiredFields: ['name', 'city'],
    priority:       1,
    colorScheme:    'dark',
    colors:         { bg: '#1a2e1a', nav: '#0f1f0f', accent: '#d4a017', dark: true },
    component:      Landscaper5,
  },
];

// Returns a template by its ID, or undefined if not found
export function getTemplateById(id: string): TemplateRegistryEntry | undefined {
  return TEMPLATE_REGISTRY.find(t => t.id === id);
}

// Always returns something — falls back to placeholder if no match
export function getTemplateSafe(id: string): TemplateRegistryEntry {
  return getTemplateById(id) ?? getTemplateById('_placeholder')!;
}

// Returns all templates that are valid for this business type (same filter as selectTemplate).
// Excludes _placeholder so the strip shows only real themes. Used by the preview page to build the template picker.
export function getTemplatesForBusinessType(businessData: BusinessData): TemplateRegistryEntry[] {
  const type = businessData.businessType
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_');

  return TEMPLATE_REGISTRY.filter(t => {
    if (t.id === '_placeholder') return false;
    if (t.notFor.includes(type)) return false;
    for (const field of t.requiredFields) {
      const val = businessData[field];
      if (val === undefined || val === null || val === '') return false;
      if (Array.isArray(val) && val.length === 0) return false;
    }
    return true;
  });
}
