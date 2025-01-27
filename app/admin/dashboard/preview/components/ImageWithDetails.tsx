"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ImageWithDetailsProps {
  imageUrl: string;
  caption?: string;
  details?: string;
}

export function ImageWithDetails({ imageUrl, caption, details }: ImageWithDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg shadow-md">
        <Image
          src={imageUrl}
          alt={caption || ""}
          fill
          className="object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      
      {/* Caption and Details */}
      {(caption || details) && (
        <div className="space-y-2 px-2">
          {caption && (
            <h3 className="text-2xl font-semibold text-[#142D42]">{caption}</h3>
          )}
          {details && (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {details}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
