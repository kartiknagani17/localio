// Client-only: map template id → dynamic import for lazy loading in the preview.
// Do not import this from server code.

import type React from 'react';
import type { TemplateProps } from './types';

export type TemplateLoader = () => Promise<{ default: React.ComponentType<TemplateProps> }>;

export const TemplateLoaders: Record<string, TemplateLoader> = {
  '_placeholder': () => import('@/templates/_placeholder'),
  'hair-salon-01': () => import('@/templates/HairSalon'),
  'car-detailer-01': () => import('@/templates/CarDetailing'),
  'car-detailer-02': () => import('@/templates/CarDetailing3'),
  'landscaper-01': () => import('@/templates/Landscaper1'),
  'landscaper-02': () => import('@/templates/Landscaper2'),
  'landscaper-03': () => import('@/templates/Landscaper3'),
  'landscaper-04': () => import('@/templates/Landscaper4'),
  'landscaper-05': () => import('@/templates/Landscaper5'),
  'plumber-01': () => import('@/templates/Plumber1'),
  'plumber-02': () => import('@/templates/Plumber2'),
  'plumber-03':      () => import('@/templates/Plumber3'),
  'electrician-01':  () => import('@/templates/Electrician1'),
  'electrician-02':  () => import('@/templates/Electrician2'),
  'electrician-03':  () => import('@/templates/Electrician3'),
};
