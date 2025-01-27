"use client";

import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface LocalImage extends File {
  preview: string;
  caption?: string;
  details?: string;
  order_number: number;
  id: string;
}

interface ImageUploaderProps {
  sectionIndex: number;
  localImages: LocalImage[];
  onImageSelect: (sectionIndex: number, images: LocalImage[]) => void;
  onImageRemove: (sectionIndex: number, imageIndex: number) => void;
  onImageUpdate: (
    sectionIndex: number,
    imageIndex: number,
    updates: Partial<LocalImage>
  ) => void;
  uploadProgress: { [key: string]: number };
}

/**
 * Renders a button to select images,
 * and a list of locally selected images (with caption/details).
 * Actual upload is done by your "useCreateOpportunity" or
 * direct fetch calls after the user finalizes creation.
 */
export function ImageUploader({
  sectionIndex,
  localImages,
  onImageSelect,
  onImageRemove,
  onImageUpdate,
  uploadProgress,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When user selects files in the file picker
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      // Convert each picked file into a "LocalImage" with a preview URL
      const newImages: LocalImage[] = await Promise.all(
        files.map(async (file, index) => {
          const preview = URL.createObjectURL(file);
          const imageFile = new File([file], file.name, {
            type: file.type,
            lastModified: file.lastModified,
          });

          return Object.assign(imageFile, {
            preview,
            order_number: localImages.length + index + 1,
            id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
            caption: "",
            details: "",
          }) as LocalImage;
        })
      );

      onImageSelect(sectionIndex, [...localImages, ...newImages]);

      // Clear out the file input so user can select the same file again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [localImages, onImageSelect, sectionIndex]
  );

  // Update caption
  const handleCaptionChange = useCallback(
    (imageIndex: number, value: string) => {
      onImageUpdate(sectionIndex, imageIndex, { caption: value });
    },
    [onImageUpdate, sectionIndex]
  );

  // Update details
  const handleDetailsChange = useCallback(
    (imageIndex: number, value: string) => {
      onImageUpdate(sectionIndex, imageIndex, { details: value });
    },
    [onImageUpdate, sectionIndex]
  );

  return (
    <div className="space-y-4">
      {/* "Add Images" button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Add Images</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* List of local images (preview, caption, details) */}
      {localImages.length > 0 && (
        <div className="grid grid-cols-1 gap-8">
          {localImages.map((image, index) => (
            <div key={image.id} className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-red-500/80 hover:bg-red-500 border-0 text-white"
                    onClick={() => onImageRemove(sectionIndex, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {/* Optional progress bar if you handle chunked or partial uploads */}
                {uploadProgress[`${sectionIndex}-${index}`] !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                    <div
                      className="h-full bg-[#4FD1C5] transition-all duration-300"
                      style={{
                        width: `${uploadProgress[`${sectionIndex}-${index}`]}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Caption</Label>
                  <Input
                    type="text"
                    placeholder="Add a caption for this image..."
                    value={image.caption || ""}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Details</Label>
                  <Tabs defaultValue="edit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100/50">
                      <TabsTrigger 
                        value="edit"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:font-medium"
                      >
                        Edit
                      </TabsTrigger>
                      <TabsTrigger 
                        value="preview"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:font-medium"
                      >
                        Preview
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                      <Textarea
                        placeholder="Add details about this image using Markdown syntax..."
                        value={image.details || ""}
                        onChange={(e) => handleDetailsChange(index, e.target.value)}
                        rows={3}
                        className="font-mono border-gray-200"
                      />
                    </TabsContent>
                    <TabsContent value="preview" className="prose prose-sm max-w-none">
                      <div className="rounded-md border border-gray-200 p-6">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {image.details || "*No details yet*"}
                        </ReactMarkdown>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
