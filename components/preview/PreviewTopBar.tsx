'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import PublishFlowDialog from '@/components/preview/PublishFlowDialog';

interface PreviewTopBarProps {
  siteId:       string;
  slug:         string;
  status:       'preview' | 'published';
  templateName: string;
  businessName: string;
}

export default function PreviewTopBar({
  siteId,
  slug,
  status,
  templateName,
  businessName,
}: PreviewTopBarProps) {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishedUrl, setPublishedUrl]           = useState<string | null>(null);
  const [copySuccess, setCopySuccess]             = useState(false);

  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localio.live';

  const isPublished = status === 'published' || !!publishedUrl;

  const resolvedPublishedUrl =
    publishedUrl ?? (status === 'published' ? `https://${domain}/${slug}` : null);

  const draftUrl  = `https://${domain}/d/${slug}`;
  const activeUrl = resolvedPublishedUrl ?? draftUrl;
  const urlDisplay = activeUrl.replace('https://', '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-4 py-3 bg-white border-b shadow-sm">
      <span className="font-bold text-gray-800">Localio</span>
      <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">{templateName}</span>

      <div className="flex-1" />

      {/* URL display */}
      <span className={`text-sm font-mono hidden sm:block ${isPublished ? 'text-green-600' : 'text-gray-400'}`}>
        {!isPublished && (
          <span className="mr-1 px-1 py-0.5 text-xs bg-amber-100 text-amber-700 rounded font-sans">Draft</span>
        )}
        {urlDisplay}
      </span>

      {/* Open in new tab */}
      <a
        href={activeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-sm hover:underline hidden sm:block ${isPublished ? 'text-green-600' : 'text-gray-400'}`}
      >
        Open ↗
      </a>

      {/* Copy URL */}
      <Button variant="secondary" onClick={handleCopy}>
        {copySuccess ? 'Copied!' : 'Copy URL'}
      </Button>

      {/* Publish button */}
      <Button
        onClick={() => { if (!isPublished) setShowPublishDialog(true); }}
        disabled={isPublished}
        className={isPublished ? '!bg-green-500 hover:!bg-green-500 cursor-default' : ''}
      >
        {isPublished ? '✓ Published' : 'Publish'}
      </Button>

      {/* Full publish flow: auth → confirm → PayPal → success */}
      <PublishFlowDialog
        isOpen={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        siteId={siteId}
        businessName={businessName}
        slug={slug}
        onPublished={(url) => {
          setPublishedUrl(url);
          // dialog closes itself on success via "Back to editor" button
        }}
      />
    </header>
  );
}
