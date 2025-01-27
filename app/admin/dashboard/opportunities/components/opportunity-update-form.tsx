"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./image-uploader";
import { SECTION_TYPES } from "./opportunity-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateOpportunity } from "@/hooks/use-update-opportunity";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface LocalImage extends File {
  preview: string;
  caption?: string;
  details?: string;
  order_number: number;
  id: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.object({
    city: z.string().min(1, "City is required"),
    region: z.string().min(1, "Region is required"),
  }),
  visibility: z.enum(["draft", "private", "coming_soon", "active", "concluded"]),
  external_url: z.string().optional(),
  external_platform: z.string().optional(),
  sections: z.array(
    z.object({
      section_type: z.string(),
      custom_title: z.string().optional(),
      custom_content: z.string().optional(),
      order_number: z.number(),
      images: z
        .array(
          z.object({
            id: z.string().optional(),
            image_url: z.string(),
            caption: z.string().optional(),
            details: z.string().optional(),
            order_number: z.number(),
          })
        )
        .optional(),
      localImages: z.array(z.any()).optional(),
    })
  ),
  financial: z.object({
    equity_distributed: z.string(),
    irr_expected: z.string(),
    fundraising_goal: z.string(),
    duration_months: z.string(),
    pre_money_valuation: z.string(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface OpportunityUpdateFormProps {
  initialData: FormValues;
  opportunityId: string;
}

export function OpportunityUpdateForm({ initialData, opportunityId }: OpportunityUpdateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateOpportunity } = useUpdateOpportunity();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Remove a local or existing image
  const handleImageRemove = (
    sectionIndex: number,
    imageIndex: number,
    isExisting: boolean = false
  ) => {
    if (isExisting) {
      const currentSection = form.getValues(`sections.${sectionIndex}`);
      const currentImages = currentSection.images || [];
      const updatedImages = currentImages
        .filter((_, i) => i !== imageIndex)
        .map((img, idx) => ({
          ...img,
          order_number: idx + 1,
        }));
      form.setValue(`sections.${sectionIndex}.images`, updatedImages);
    } else {
      const currentLocalImages = form.getValues(`sections.${sectionIndex}.localImages`) || [];
      const imageToRemove = currentLocalImages[imageIndex];
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      const updatedLocalImages = currentLocalImages
        .filter((_, i) => i !== imageIndex)
        .map((img, idx) => ({
          ...img,
          order_number: idx + 1,
        }));
      form.setValue(`sections.${sectionIndex}.localImages`, updatedLocalImages);
    }
    form.trigger(`sections.${sectionIndex}`);
  };

  // Handle newly selected local images
  const handleImageSelect = (sectionIndex: number, images: LocalImage[]) => {
    const currentSection = form.getValues(`sections.${sectionIndex}`);
    const existingImages = currentSection.images || [];
    const currentLocalImages = currentSection.localImages || [];
    const startOrderNumber = existingImages.length + currentLocalImages.length + 1;

    const updatedImages = images.map((img, idx) => ({
      ...img,
      order_number: startOrderNumber + idx,
    }));

    form.setValue(`sections.${sectionIndex}.localImages`, updatedImages, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    form.trigger(`sections.${sectionIndex}`);
  };

  // Handle updates (caption/details) for newly added local images
  const handleImageUpdate = (
    sectionIndex: number,
    imageIndex: number,
    updates: Partial<LocalImage>
  ) => {
    const currentSection = form.getValues(`sections.${sectionIndex}`);
    const currentLocalImages = currentSection.localImages || [];
    const updatedLocalImages = [...currentLocalImages];
    updatedLocalImages[imageIndex] = { ...updatedLocalImages[imageIndex], ...updates };

    form.setValue(`sections.${sectionIndex}.localImages`, updatedLocalImages, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // Handle updates for existing images (edit caption/details)
  const handleExistingImageUpdate = (
    sectionIndex: number,
    imageIndex: number,
    updates: Partial<LocalImage>
  ) => {
    const currentSection = form.getValues(`sections.${sectionIndex}`);
    const currentImages = currentSection.images || [];
    const updatedImages = [...currentImages];
    updatedImages[imageIndex] = { ...updatedImages[imageIndex], ...updates };

    form.setValue(`sections.${sectionIndex}.images`, updatedImages, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = async (data: FormValues) => {
    if (!opportunityId) {
      toast.error("Opportunity ID is required");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateOpportunity(opportunityId, data);
    } catch (error) {
      console.error("Error updating opportunity:", error);
      toast.error("Failed to update opportunity");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render a single section, including logic for financial fields
  const renderSection = (section: FormValues["sections"][0], sectionIndex: number) => {
    const localImages = section?.localImages || [];
    const existingImages = section?.images || [];

    // If section_type === "financial", show specialized financial fields
    if (section.section_type === "financial") {
      return (
        <Card key={section.section_type} className="mb-6 border shadow-none">
          <CardHeader>
            <CardTitle>{SECTION_TYPES[sectionIndex].label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name={`financial.equity_distributed`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equity Distributed (%)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" max="100" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`financial.irr_expected`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected IRR (%)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`financial.fundraising_goal`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fundraising Goal (€)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="1000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`financial.duration_months`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Months)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" step="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`financial.pre_money_valuation`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pre-Money Valuation (€)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="1000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-8">
              {/* Upload new images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload New Images</h3>
                <ImageUploader
                  sectionIndex={sectionIndex}
                  localImages={localImages as LocalImage[]}
                  onImageSelect={handleImageSelect}
                  onImageRemove={(sectIdx, imgIdx) => handleImageRemove(sectIdx, imgIdx, false)}
                  onImageUpdate={handleImageUpdate}
                  uploadProgress={{}}
                />
              </div>

              {/* Existing images with caption/details fields */}
              {existingImages.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Existing Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {existingImages.map((image, imageIndex) => (
                      <div
                        key={image.id || image.image_url}
                        className="group relative rounded-xl overflow-hidden bg-gray-100 shadow-md p-4"
                      >
                        <div className="aspect-[16/10] w-full mb-3 overflow-hidden">
                          <img
                            src={image.image_url}
                            alt={image.caption || `Image ${imageIndex + 1}`}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="mb-2">
                          <FormLabel className="text-sm font-semibold">Caption</FormLabel>
                          <Input
                            type="text"
                            value={image.caption || ""}
                            onChange={(e) =>
                              handleExistingImageUpdate(sectionIndex, imageIndex, {
                                caption: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="mb-2">
                          <FormLabel className="text-sm font-semibold">Details</FormLabel>
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
                                onChange={(e) =>
                                  handleExistingImageUpdate(sectionIndex, imageIndex, {
                                    details: e.target.value,
                                  })
                                }
                                rows={3}
                                className="font-mono border-gray-200"
                              />
                            </TabsContent>
                            <TabsContent value="preview" className="prose prose-sm max-w-none">
                              <div className="rounded-md border border-gray-200 bg-white/50 p-6">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {image.details || "*No details yet*"}
                                </ReactMarkdown>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>

                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => handleImageRemove(sectionIndex, imageIndex, true)}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    // Otherwise, a "normal" section
    return (
      <Card key={section.section_type} className="mb-6 border shadow-none">
        <CardHeader>
          <CardTitle>{SECTION_TYPES[sectionIndex].label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <FormField
            control={form.control}
            name={`sections.${sectionIndex}.custom_title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`sections.${sectionIndex}.custom_content`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
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
                        key={`content-${sectionIndex}`}
                        placeholder={`Enter ${SECTION_TYPES[sectionIndex].label} content using Markdown syntax`}
                        className="min-h-[200px] font-mono border-gray-200"
                        {...field}
                      />
                    </TabsContent>
                    <TabsContent value="preview" className="prose prose-sm max-w-none">
                      <div className="rounded-md border border-gray-200 bg-white/50 p-6">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {field.value || "*No content yet*"}
                        </ReactMarkdown>
                      </div>
                    </TabsContent>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Uploader for new images */}
          <div className="space-y-4">
            <Label>Images</Label>
            <ImageUploader
              sectionIndex={sectionIndex}
              localImages={localImages}
              onImageSelect={(sectionIndex, images) => handleImageSelect(sectionIndex, images)}
              onImageRemove={(sectionIndex, imageIndex) =>
                handleImageRemove(sectionIndex, imageIndex)
              }
              onImageUpdate={(sectionIndex, imageIndex, updates) =>
                handleImageUpdate(sectionIndex, imageIndex, updates)
              }
              uploadProgress={{}}
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-4">
              <Label>Existing Images</Label>
              <div className="grid grid-cols-1 gap-8">
                {existingImages.map((image, imageIndex) => (
                  <div key={image.id || imageIndex} className="space-y-4 p-4 border border-gray-200 rounded-lg">
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={image.image_url}
                        alt={image.caption || `Image ${imageIndex + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Caption</Label>
                        <Input
                          type="text"
                          placeholder="Add a caption for this image..."
                          value={image.caption || ""}
                          onChange={(e) =>
                            handleExistingImageUpdate(sectionIndex, imageIndex, {
                              caption: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Details</Label>
                        <Tabs defaultValue="edit" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100/50">
                            <TabsTrigger value="edit">Edit</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                          </TabsList>
                          <TabsContent value="edit">
                            <Textarea
                              placeholder="Add details about this image using Markdown syntax..."
                              value={image.details || ""}
                              onChange={(e) =>
                                handleExistingImageUpdate(sectionIndex, imageIndex, {
                                  details: e.target.value,
                                })
                              }
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

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleImageRemove(sectionIndex, imageIndex, true)}
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container max-w-5xl mx-auto space-y-8 pb-12"
      >
        <Card className="border shadow-none">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location.region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="external_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="external_platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External Platform</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Render each section */}
        {form.getValues("sections").map((section, index) => renderSection(section, index))}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Opportunity"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
