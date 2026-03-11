'use client';
// trigger redeploy — picks up updated NEXT_PUBLIC_SITE_DOMAIN env var
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
  const [isPublishing, setIsPublishing]         = useState(false);
  const [publishedUrl, setPublishedUrl]         = useState<string | null>(null);
  const [copySuccess, setCopySuccess]           = useState(false);

  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localio.live';

  // True if already published (from server) OR just published in this session
  const isPublished = status === 'published' || !!publishedUrl;

  // Resolved published URL:
  //   - Set by the publish API response after publishing in this session, OR
  //   - Derived from slug if the server already knows it's published
  const resolvedPublishedUrl =
    publishedUrl ?? (status === 'published' ? `https://${domain}/${slug}` : null);

  // Draft shareable URL — always available before publishing
  const draftUrl = `https://${domain}/d/${slug}`;

  // Active URL — published URL takes precedence once available
  const activeUrl    = resolvedPublishedUrl ?? draftUrl;
  const urlDisplay   = activeUrl.replace('https://', '');

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
    try {
      await navigator.clipboard.writeText(activeUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // ignore — clipboard may be unavailable in some browsers
    }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-4 py-3 bg-white border-b shadow-sm">
      <span className="font-bold text-gray-800">Localio</span>
      <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">{templateName}</span>

      <div className="flex-1" />

      {/* URL display — draft or published */}
      <span className={`text-sm font-mono ${isPublished ? 'text-green-600' : 'text-gray-400'}`}>
        {isPublished ? '' : <span className="mr-1 px-1 py-0.5 text-xs bg-amber-100 text-amber-700 rounded font-sans">Draft</span>}
        {urlDisplay}
      </span>

      {/* Open in new tab */}
      <a
        href={activeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-sm hover:underline ${isPublished ? 'text-green-600' : 'text-gray-400'}`}
      >
        Open ↗
      </a>

      {/* Copy URL — always available */}
      <Button variant="secondary" onClick={handleCopy}>
        {copySuccess ? 'Copied!' : 'Copy URL'}
      </Button>

      {/* Publish button */}
      <Button
        onClick={() => (!isPublished ? setShowPaymentModal(true) : undefined)}
        disabled={isPublished || isPublishing}
      >
        {isPublished ? 'Published ✓' : isPublishing ? 'Publishing…' : 'Publish'}
      </Button>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={(subscriptionId) => handlePublish(subscriptionId)}
      />
    </header>
  );
}
