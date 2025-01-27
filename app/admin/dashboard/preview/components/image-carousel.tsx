"use client";

import { Image as OpportunityImage } from "@/app/types/opportunities";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ImageCarouselProps {
  images: OpportunityImage[];
  className?: string;
}

const TEXT_TRUNCATE_LENGTH = 300; // Characters to show before truncating

interface CollapsibleTextProps {
  text: string;
  className?: string;
}

function CollapsibleText({ text, className = "" }: CollapsibleTextProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shouldTruncate = text.length > TEXT_TRUNCATE_LENGTH;

  const renderMarkdown = (content: string) => (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );

  if (!shouldTruncate) {
    return renderMarkdown(text);
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      {renderMarkdown(isOpen ? text : text.slice(0, TEXT_TRUNCATE_LENGTH) + "...")}
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full mt-2">
          {isOpen ? (
            <div className="flex items-center">
              Show Less <ChevronUp className="ml-2 h-4 w-4" />
            </div>
          ) : (
            <div className="flex items-center">
              Read More <ChevronDown className="ml-2 h-4 w-4" />
            </div>
          )}
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  );
}

export function ImageCarousel({ images, className = "" }: ImageCarouselProps) {
  if (!images || images.length === 0) {
    return (
      <div className={`relative aspect-[4/3] w-full bg-gray-100 rounded-lg ${className}`} />
    );
  }

  return (
    <div className="space-y-6">
      <Carousel className={`w-full ${className}`}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={image.image_url}
                  alt={image.caption || `Image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
      
      {/* Image Details */}
      <div className="space-y-6">
        {images.map((image, index) => (
          <div key={index} className="space-y-4 prose max-w-none">
            {image.caption && (
              <div>
                <h4 className="text-xl font-medium text-[#142D42] leading-tight mb-2">
                  {image.caption}
                </h4>
              </div>
            )}
            {image.details && (
              <CollapsibleText text={image.details} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
