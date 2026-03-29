"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ListingGalleryProps {
  images: string[];
  businessName: string;
}

export default function ListingGallery({ images, businessName }: ListingGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  function next() {
    setActiveIndex((i) => (i + 1) % images.length);
  }

  function prev() {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <>
      <section>
        <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                setLightboxOpen(true);
              }}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 border border-gray-200 hover:border-primary-300 transition-colors"
            >
              <div className="flex h-full items-center justify-center text-gray-400">
                <div className="text-center">
                  <ZoomIn className="mx-auto h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  <span className="block mt-1 text-xs">
                    {businessName} - Photo {i + 1}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 opacity-50" />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex flex-col items-center gap-4 max-w-4xl w-full">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white/60">
                <span className="text-lg">{businessName}</span>
                <br />
                <span className="text-sm">Photo {activeIndex + 1} of {images.length}</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-12 w-16 shrink-0 rounded border-2 bg-gray-800 flex items-center justify-center text-xs text-white/50 ${
                    i === activeIndex ? "border-white" : "border-transparent opacity-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
