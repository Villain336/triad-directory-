"use client";

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react";

interface PhotoUploadProps {
  onPhotosChange: (files: File[]) => void;
  maxPhotos?: number;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `${file.name}: only JPG, PNG, and WebP images are allowed.`;
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `${file.name}: file must be under 5 MB.`;
  }
  return null;
}

export default function PhotoUpload({ onPhotosChange, maxPhotos = 5 }: PhotoUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(incoming: File[]) {
    setValidationError("");

    const errors: string[] = [];
    const valid: File[] = [];

    for (const f of incoming) {
      const err = validateFile(f);
      if (err) {
        errors.push(err);
      } else {
        valid.push(f);
      }
    }

    if (errors.length > 0) {
      setValidationError(errors[0]);
    }

    const combined = [...files, ...valid].slice(0, maxPhotos);

    // Revoke old object URLs that are no longer needed
    previews.forEach((url) => URL.revokeObjectURL(url));

    const newPreviews = combined.map((f) => URL.createObjectURL(f));
    setFiles(combined);
    setPreviews(newPreviews);
    onPhotosChange(combined);
  }

  function removeFile(index: number) {
    URL.revokeObjectURL(previews[index]);
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onPhotosChange(newFiles);
    setValidationError("");
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    addFiles(selected);
    // Reset so the same file can be re-selected after removal
    e.target.value = "";
  }

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      addFiles(dropped);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, previews]
  );

  const canAddMore = files.length < maxPhotos;

  return (
    <div className="space-y-3">
      {/* Validation error */}
      {validationError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          {validationError}
        </div>
      )}

      {/* Thumbnail previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Photo preview ${i + 1}`}
                className="h-20 w-20 rounded-lg object-cover border border-gray-200 bg-gray-50"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label={`Remove photo ${i + 1}`}
                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow-sm"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone – only shown when more files can be added */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          aria-label="Upload photos"
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? "border-primary-400 bg-primary-50 text-primary-600"
              : "border-gray-300 bg-gray-50 text-gray-500 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600"
          }`}
        >
          {isDragging ? (
            <ImageIcon className="h-7 w-7" />
          ) : (
            <Upload className="h-7 w-7" />
          )}
          <div className="text-sm">
            <span className="font-medium">
              {isDragging ? "Drop photos here" : "Drag & drop photos here"}
            </span>
            <span className="text-gray-400"> or </span>
            <span className="font-medium text-primary-600">browse</span>
          </div>
          <p className="text-xs text-gray-400">
            JPG, PNG, WebP &mdash; max 5 MB each &mdash; up to {maxPhotos} photo{maxPhotos !== 1 ? "s" : ""}
          </p>
          {files.length > 0 && (
            <p className="text-xs text-gray-500">
              {files.length} of {maxPhotos} uploaded
            </p>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={handleInputChange}
        aria-hidden="true"
      />
    </div>
  );
}
