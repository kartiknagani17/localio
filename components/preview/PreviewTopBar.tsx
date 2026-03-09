'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import PaymentModal from '@/components/preview/PaymentModal';

interface PreviewTopBarProps {
  siteId: string;
  slug: string;
  status: 'preview' | 'published';
  templateName: string;
}

export default function PreviewTopBar({ siteId, slug, status, templateName }: PreviewTopBarProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // True if already published (from server) OR just published in this session.
  // The `status` prop is server-rendered and never updates client-side, so we
  // must also check `publishedUrl` to prevent re-publishing after a successful publish.
  const isPublished = status === 'published' || !!publishedUrl;

  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localio.com';
  const urlDisplay = `${slug}.${domain}`;

  const handlePublish = async (subscriptionId: string) => {
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/publish/${siteId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Publish failed');
      setPublishedUrl(data.publicUrl);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Publish failed');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = async () => {
    if (!publishedUrl) return;
    try {
      await navigator.clipboard.writeText(publishedUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-4 py-3 bg-white border-b shadow-sm">
      <span className="font-bold text-gray-800">Localio</span>
      <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">{templateName}</span>
      <div className="flex-1" />
      <span className={`text-sm ${publishedUrl ? 'text-orange-600' : 'text-gray-400'}`}>
        {urlDisplay}
      </span>
      {publishedUrl && (
        <a
          href={publishedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-orange-600 hover:underline"
        >
          Open
        </a>
      )}
      {publishedUrl && (
        <Button variant="secondary" onClick={handleCopy}>
          {copySuccess ? 'Copied!' : 'Copy URL'}
        </Button>
      )}
      {/* publishedUrl covers the case where the user just published in this session
          (status prop stays 'preview' since it's server-rendered and never updates) */}
      <Button
        onClick={() => (!isPublished ? setShowPaymentModal(true) : undefined)}
        disabled={isPublished || isPublishing}
      >
        {isPublished ? 'Published' : isPublishing ? 'Publishing…' : 'Publish'}
      </Button>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={(subscriptionId) => handlePublish(subscriptionId)}
      />
    </header>
  );
}
