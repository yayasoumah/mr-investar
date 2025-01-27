"use client";

import { ReactNode, useState } from "react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ImageCarousel } from "./image-carousel";
import { Image as OpportunityImage } from "@/app/types/opportunities";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SectionContentProps {
  title?: string;
  customTitle?: string;
  content?: string | ReactNode;
  images?: OpportunityImage[];
  className?: string;
}

const TEXT_TRUNCATE_LENGTH = 300; // Characters to show before truncating

export function SectionContent({ title, customTitle, content, images, className = "" }: SectionContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const textContent = typeof content === "string" ? content : null;
  const shouldTruncate = textContent && textContent.length > TEXT_TRUNCATE_LENGTH;

  const renderMarkdownContent = (text: string) => (
    <ReactMarkdown
      className="text-gray-700 leading-relaxed text-justify"
      remarkPlugins={[remarkGfm]}
    >
      {text}
    </ReactMarkdown>
  );

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Images */}
        {images && images.length > 0 && (
          <div className="lg:col-span-6">
            <ImageCarousel images={images} />
          </div>
        )}
        
        {/* Right Column - Content */}
        <div className={`${images && images.length > 0 ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          {/* Title Area */}
          <div className="space-y-3">
            {title && (
              <h3 className="text-xl font-medium">
                <span className="text-[#3FD3CC] uppercase tracking-wider">{title}</span>
              </h3>
            )}
            {customTitle && (
              <h2 className="text-4xl font-medium text-[#142D42] leading-tight">{customTitle}</h2>
            )}
          </div>

          {/* Content Area */}
          {content && (
            <div className="prose max-w-none mt-6">
              {typeof content === "string" ? (
                shouldTruncate ? (
                  <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <div>
                      {renderMarkdownContent(isOpen ? textContent : textContent.slice(0, TEXT_TRUNCATE_LENGTH) + "...")}
                    </div>
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
                ) : (
                  renderMarkdownContent(content)
                )
              ) : (
                content
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
