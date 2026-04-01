"use client";

import { useState, useRef } from "react";
import { Star, Upload, X, CheckCircle, AlertCircle, Camera } from "lucide-react";

interface WriteReviewFormProps {
  businessId: string;
  businessName: string;
  onSuccess?: () => void;
}

export default function WriteReviewForm({ businessId, businessName, onSuccess }: WriteReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [email, setEmail] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => {
      if (!f.type.startsWith("image/")) return false;
      if (f.size > 5 * 1024 * 1024) return false;
      return true;
    });

    const combined = [...photos, ...validFiles].slice(0, 5);
    setPhotos(combined);

    // Generate previews
    const previews: string[] = [];
    combined.forEach((file) => {
      const url = URL.createObjectURL(file);
      previews.push(url);
    });
    setPhotoPreviews(previews);
  }

  function removePhoto(index: number) {
    URL.revokeObjectURL(photoPreviews[index]);
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (content.trim().length < 20) {
      setError("Review must be at least 20 characters.");
      return;
    }

    setLoading(true);

    try {
      // Upload photos first if any
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const formData = new FormData();
        formData.append("file", photo);
        formData.append("businessId", businessId);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          if (url) photoUrls.push(url);
        }
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          authorName: authorName.trim(),
          email: email.trim(),
          rating,
          content: content.trim(),
          photos: photoUrls,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit review. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      onSuccess?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
        <h3 className="mt-3 text-lg font-semibold text-gray-900">Review Submitted!</h3>
        <p className="mt-1 text-sm text-gray-600">
          Thank you for reviewing <span className="font-medium">{businessName}</span>. Your review is pending approval and will appear shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-5 space-y-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">Write a Review for {businessName}</h3>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
              aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-100 text-gray-300"
                }`}
              />
            </button>
          ))}
          {(hoverRating || rating) > 0 && (
            <span className="ml-2 text-sm font-medium text-gray-600">
              {ratingLabels[hoverRating || rating]}
            </span>
          )}
        </div>
      </div>

      {/* Review Content */}
      <div>
        <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder={`Share your experience with ${businessName}... (minimum 20 characters)`}
          required
          minLength={20}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
        />
        <p className={`mt-1 text-xs ${content.length < 20 && content.length > 0 ? "text-red-400" : "text-gray-400"}`}>
          {content.length} / 20 characters minimum
        </p>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Camera className="inline h-4 w-4 mr-1 text-gray-400" />
          Add Photos <span className="text-gray-400 font-normal">(optional, up to 5)</span>
        </label>

        {photoPreviews.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {photoPreviews.map((preview, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt={`Photo preview ${i + 1}`}
                  className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {photos.length < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload photos (JPG, PNG, WebP &mdash; max 5MB each)
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      {/* Name and Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            id="review-name"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            placeholder="Jane Smith"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="review-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="review-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <p className="mt-1 text-xs text-gray-400">Not published publicly</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
