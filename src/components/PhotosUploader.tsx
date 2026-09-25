"use client";

import { useRef, useState } from "react";

export function PhotosUploader({
  listingId,
  initialPhotos,
}: {
  listingId: string;
  initialPhotos: string[];
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);

    const presignRes = await fetch("/api/uploads/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });

    if (!presignRes.ok) {
      const data = await presignRes.json().catch(() => null);
      setUploading(false);
      setError(data?.error ?? "Couldn't start the upload. Try again.");
      return;
    }

    const { uploadUrl, publicUrl } = await presignRes.json();

    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!putRes.ok) {
      setUploading(false);
      setError("Upload to storage failed. Try again.");
      return;
    }

    const nextPhotos = [...photos, publicUrl];

    const patchRes = await fetch(`/api/listings/${listingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photos: nextPhotos }),
    });

    setUploading(false);

    if (!patchRes.ok) {
      setError("Saved the upload, but couldn't attach it to the listing.");
      return;
    }

    setPhotos(nextPhotos);
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((url) => (
          <div
            key={url}
            className="relative aspect-square overflow-hidden rounded-[10px] bg-accent-tint"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square items-center justify-center rounded-[10px] border-[1.5px] border-dashed border-border disabled:opacity-60"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A69F91"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {uploading && <p className="mt-3 text-xs text-muted">Uploading…</p>}
      {error && <p className="mt-3 text-xs text-accent">{error}</p>}
    </div>
  );
}
