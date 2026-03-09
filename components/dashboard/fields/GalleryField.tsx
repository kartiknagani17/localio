'use client';

import { useRef, useState } from 'react';
import { GalleryItem } from '@/templates/types';

interface GalleryFieldProps {
  siteId: string;
  value: GalleryItem[];
  onChange: (gallery: GalleryItem[]) => void;
}

export default function GalleryField({ siteId, value, onChange }: GalleryFieldProps) {
  const gallery = value ?? [];
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    const newItems: GalleryItem[] = [];
    let failCount = 0;
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'general');
      formData.append('label', '');

      try {
        const res = await fetch(`/api/upload/${siteId}`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          newItems.push({ imageUrl: data.url, type: 'general', label: '' });
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    if (newItems.length > 0) onChange([...gallery, ...newItems]);
    if (failCount > 0) {
      setUploadError(`${failCount} file${failCount > 1 ? 's' : ''} failed to upload. Check file size (max 5 MB) and type (JPG/PNG/WEBP).`);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const updateItem = (index: number, field: keyof GalleryItem, val: string) => {
    const next = [...gallery];
    next[index] = { ...next[index], [field]: val } as GalleryItem;
    onChange(next);
  };

  const remove = (index: number) => onChange(gallery.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full py-6 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600 transition disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Click to add photos'}
      </button>
      {uploadError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {uploadError}
        </p>
      )}

      {gallery.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {gallery.map((g, i) => (
            <div key={i} className="relative group">
              <img
                src={g.imageUrl}
                alt={g.label ?? ''}
                className="w-full h-24 object-cover rounded-lg"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="mt-1 flex gap-1">
                <select
                  value={g.type}
                  onChange={e => updateItem(i, 'type', e.target.value)}
                  className="text-xs border rounded px-1 py-0.5 flex-1"
                >
                  <option value="general">General</option>
                  <option value="before">Before</option>
                  <option value="after">After</option>
                </select>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-red-400 hover:text-red-600 text-xs px-1"
                >
                  &times;
                </button>
              </div>
              <input
                type="text"
                value={g.label ?? ''}
                onChange={e => updateItem(i, 'label', e.target.value)}
                placeholder="Label"
                className="mt-1 w-full text-xs border rounded px-1.5 py-0.5"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
