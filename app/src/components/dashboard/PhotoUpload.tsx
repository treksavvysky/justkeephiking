'use client';

import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';

interface PhotoUploadProps {
  onUploadComplete: (url: string) => void;
}

export default function PhotoUpload({ onUploadComplete }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(10);

    try {
      // Compress image
      const options = {
        maxSizeMB: 0.5, // 500KB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        onProgress: (p: number) => setProgress(10 + p * 0.4),
      };

      const compressedFile = await imageCompression(file, options);
      setProgress(50);

      // Upload to Supabase Storage
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `trail-updates/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      setProgress(80);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      setProgress(100);
      setPreview(publicUrl);
      onUploadComplete(publicUrl);
      setUploading(false);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload photo');
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {!preview && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
          >
            {uploading ? (
              <div className="space-y-2">
                <div className="text-4xl">⏳</div>
                <div className="text-sm text-muted">Uploading... {progress}%</div>
                <div className="w-full bg-background rounded-full h-2 max-w-xs mx-auto">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl">📸</div>
                <div className="text-sm font-medium">Click to upload photo</div>
                <div className="text-xs text-muted">
                  JPG, PNG, or WEBP • Max 5MB • Will be compressed to ~500KB
                </div>
              </div>
            )}
          </label>
        </div>
      )}

      {preview && (
        <div className="relative border border-border rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}
