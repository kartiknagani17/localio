'use client';

import { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { BusinessData, BusinessDataPatch } from '@/templates/types';
import DashboardSection from './DashboardSection';
import TextField from './fields/TextField';
import TextAreaField from './fields/TextAreaField';
import ServiceListField from './fields/ServiceListField';
import GalleryField from './fields/GalleryField';
import HoursField from './fields/HoursField';
import TagListField from './fields/TagListField';
import TestimonialListField from './fields/TestimonialListField';
import FaqListField from './fields/FaqListField';

// ── Sketch-style SVG icons (orange via parent span in DashboardSection) ─────

const P = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.75', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function IconBuilding(): ReactNode { return <svg {...P}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function IconPhone(): ReactNode { return <svg {...P}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.61 5.61l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>; }
function IconClock(): ReactNode { return <svg {...P}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconWrench(): ReactNode { return <svg {...P}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>; }
function IconCamera(): ReactNode { return <svg {...P}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function IconStar(): ReactNode { return <svg {...P}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function IconHelpCircle(): ReactNode { return <svg {...P}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function IconMapPin(): ReactNode { return <svg {...P}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function IconAward(): ReactNode { return <svg {...P}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>; }

interface EditDashboardProps {
  siteId: string;
  data: BusinessData;
  update: (patch: BusinessDataPatch) => void;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
}

function SaveStatus({ isSaving, lastSaved, saveError }: Pick<EditDashboardProps, 'isSaving' | 'lastSaved' | 'saveError'>) {
  if (saveError) {
    return <span className="text-xs text-red-500 flex items-center gap-1">⚠ {saveError}</span>;
  }
  if (isSaving) {
    return (
      <span className="text-xs text-gray-400 flex items-center gap-1">
        <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
        Saving...
      </span>
    );
  }
  if (lastSaved) {
    return <span className="text-xs text-green-600 flex items-center gap-1">✓ Saved</span>;
  }
  return null;
}

function DashboardContent({ siteId, data, update, isSaving, lastSaved, saveError }: EditDashboardProps) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-gray-900 text-sm">Edit Your Website</h2>
        <SaveStatus isSaving={isSaving} lastSaved={lastSaved} saveError={saveError} />
      </div>

      <div className="overflow-y-auto flex-1">
        <DashboardSection title="Business Info" icon={<IconBuilding />} defaultOpen>
          <TextField label="Business name" value={data.name} onChange={v => update({ name: v })} placeholder="Your business name" />
          <TextField label="Tagline" value={data.tagline ?? ''} onChange={v => update({ tagline: v })} placeholder="Punchy tagline (6 words max)" />
          <TextField label="Sub-tagline" value={data.subTagline ?? ''} onChange={v => update({ subTagline: v })} placeholder="One supporting sentence" />
          <TextAreaField label="Description" value={data.description ?? ''} onChange={v => update({ description: v })} placeholder="About your business..." />
        </DashboardSection>

        <DashboardSection title="Contact" icon={<IconPhone />}>
          <TextField label="Phone" value={data.phone ?? ''} onChange={v => update({ phone: v })} placeholder="+1 (555) 123-4567" />
          <TextField label="Email" value={data.email ?? ''} onChange={v => update({ email: v })} placeholder="you@business.com" />
          <TextField label="Address" value={data.address ?? ''} onChange={v => update({ address: v })} placeholder="123 Main St" />
          <TextField label="Booking URL" value={data.bookingUrl ?? ''} onChange={v => update({ bookingUrl: v })} placeholder="https://book.example.com" />
        </DashboardSection>

        <DashboardSection title="Hours" icon={<IconClock />}>
          <HoursField value={data.hours} onChange={hours => update({ hours })} />
        </DashboardSection>

        <DashboardSection title="Services" icon={<IconWrench />}>
          <ServiceListField value={data.services ?? []} onChange={services => update({ services })} />
        </DashboardSection>

        <DashboardSection title="Gallery" icon={<IconCamera />}>
          <GalleryField siteId={siteId} value={data.gallery ?? []} onChange={gallery => update({ gallery })} />
        </DashboardSection>

        <DashboardSection title="Testimonials" icon={<IconStar />}>
          <TestimonialListField value={data.testimonials ?? []} onChange={testimonials => update({ testimonials })} />
        </DashboardSection>

        <DashboardSection title="FAQ" icon={<IconHelpCircle />}>
          <FaqListField value={data.faq ?? []} onChange={faq => update({ faq })} />
        </DashboardSection>

        <DashboardSection title="Service Areas" icon={<IconMapPin />}>
          <TagListField label="Service areas" value={data.serviceAreas ?? []} onChange={serviceAreas => update({ serviceAreas })} placeholder="Add a city or area" />
        </DashboardSection>

        <DashboardSection title="Certifications" icon={<IconAward />}>
          <TagListField label="Certifications" value={data.certifications ?? []} onChange={certifications => update({ certifications })} placeholder="Add a certification" />
        </DashboardSection>
      </div>
    </>
  );
}

function MobileBottomSheet(props: EditDashboardProps) {
  const [expanded, setExpanded] = useState(false);
  const touchStartY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY < -60) setExpanded(true);
    if (deltaY > 60) setExpanded(false);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex flex-col"
      style={{
        height: expanded ? '75vh' : '48px',
        transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex items-center justify-center py-3 cursor-pointer shrink-0"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>
      {expanded && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <DashboardContent {...props} />
        </div>
      )}
    </div>
  );
}

const MOBILE_BREAKPOINT = 768; // Bottom sheet only below this (phone); desktop/tablet get right column

export default function EditDashboard(props: EditDashboardProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Phone only: drag-from-bottom sheet. Desktop/tablet: right column (handled by PreviewClient layout).
  if (isMobile) {
    return <MobileBottomSheet {...props} />;
  }

  return (
    <aside className="w-full shrink-0 bg-white flex flex-col h-full overflow-hidden">
      <DashboardContent {...props} />
    </aside>
  );
}
