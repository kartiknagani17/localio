// Client-only: map template id → dynamic import for lazy loading in the preview.
// Do not import this from server code.
//
// Paths mirror the folder structure: templates/{businessType}/{TemplateName}
// When you add a new template, add one line here following the same pattern.

import type React from 'react';
import type { TemplateProps } from './types';

export type TemplateLoader = () => Promise<{ default: React.ComponentType<TemplateProps> }>;

export const TemplateLoaders: Record<string, TemplateLoader> = {
  // ── fallback ──────────────────────────────────────────────────────────────
  '_placeholder':    () => import('@/templates/_placeholder'),
  // ── car-detailer ──────────────────────────────────────────────────────────
  'car-detailer-01': () => import('@/templates/car-detailer/CarDetailing'),
  'car-detailer-02': () => import('@/templates/car-detailer/CarDetailing3'),
  // ── electrician ───────────────────────────────────────────────────────────
  'electrician-01':  () => import('@/templates/electrician/Electrician1'),
  'electrician-02':  () => import('@/templates/electrician/Electrician2'),
  'electrician-03':  () => import('@/templates/electrician/Electrician3'),
  // ── hair-salon ────────────────────────────────────────────────────────────
  'hair-salon-01':   () => import('@/templates/hair-salon/HairSalon'),
  // ── landscaper ────────────────────────────────────────────────────────────
  'landscaper-01':   () => import('@/templates/landscaper/Landscaper1'),
  'landscaper-02':   () => import('@/templates/landscaper/Landscaper2'),
  'landscaper-03':   () => import('@/templates/landscaper/Landscaper3'),
  'landscaper-04':   () => import('@/templates/landscaper/Landscaper4'),
  'landscaper-05':   () => import('@/templates/landscaper/Landscaper5'),
  // ── plumber ───────────────────────────────────────────────────────────────
  'plumber-01':      () => import('@/templates/plumber/Plumber1'),
  'plumber-02':      () => import('@/templates/plumber/Plumber2'),
  'plumber-03':      () => import('@/templates/plumber/Plumber3'),
};
