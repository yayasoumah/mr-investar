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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ImageUploader } from "./image-uploader";
import { useCreateOpportunity } from "@/hooks/use-create-opportunity";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Section definitions
export const SECTION_TYPES = [
  { id: "description", label: "Description & Gallery" },
  { id: "development", label: "Development Potential" },
  { id: "partner", label: "Industrial Partner" },
  { id: "brand", label: "Brand Affiliation" },
  { id: "management", label: "Management Company" },
  { id: "studio", label: "Project Studio" },
  { id: "financial", label: "Financial" },
] as const;

interface ExistingImage {
  id?: string;
  image_url: string;
  caption?: string;
  details?: string;
  order_number: number;
}

export interface LocalImage extends File {
  preview: string;
  caption?: string;
  details?: string;
  order_number: number;
  id: string;
}

interface ImageUpdate {
  caption?: string;
  details?: string;
  order_number?: number;
}

interface FinancialData {
  equity_distributed: string;
  irr_expected: string;
  fundraising_goal: string;
  duration_months: string;
  pre_money_valuation: string;
}

// Zod schema
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
      id: z.string().optional(),
      section_type: z.string(),
      custom_title: z.string().optional(),
      custom_content: z.string().optional(),
      order_number: z.number(),
      images: z
        .array(
          z.object({
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
  }) satisfies z.ZodType<FinancialData>,
});

export type FormValues = z.infer<typeof formSchema> & {
  financial: FinancialData;
  sections: Array<{
    section_type: string;
    custom_title?: string;
    custom_content?: string;
    order_number: number;
    images?: ExistingImage[];
    localImages?: LocalImage[];
  }>;
};

interface OpportunityFormProps {
  initialData?: FormValues;
  opportunityId?: string;
}

export function OpportunityForm({ initialData }: OpportunityFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress] = useState<{ [key: string]: number }>({});

  const { createOpportunity, isLoading } = useCreateOpportunity();

  // Default sections array
  const defaultSections = [
    { section_type: "description", order_number: 0, images: [], localImages: [] },
    { section_type: "development", order_number: 1, images: [], localImages: [] },
    { section_type: "partner", order_number: 2, images: [], localImages: [] },
    { section_type: "brand", order_number: 3, images: [], localImages: [] },
    { section_type: "management", order_number: 4, images: [], localImages: [] },
    { section_type: "studio", order_number: 5, images: [], localImages: [] },
    { section_type: "financial", order_number: 6, images: [], localImages: [] },
  ];

  // React Hook Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      location: {
        city: "",
        region: "",
      },
      visibility: "draft",
      external_url: "",
      external_platform: "",
      sections: defaultSections,
      financial: {
        equity_distributed: "",
        irr_expected: "",
        fundraising_goal: "",
        duration_months: "",
        pre_money_valuation: "",
      },
    },
    mode: "onChange",
  });

  // Watch the entire form state
  const currentSectionData = form.watch();

  // Reset if initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [form, initialData]);

  // Revoke object URLs on unmount
  useEffect(() => {
    const formRef = form;
    return () => {
      const allSections = formRef.getValues("sections");
      allSections.forEach((section) => {
        section.localImages?.forEach((img) => {
          if (img.preview) {
            URL.revokeObjectURL(img.preview);
          }
        });
      });
    };
  }, [form]);

  // Sync the .financial object from custom_content
  useEffect(() => {
    const financialSection = form.getValues("sections")?.find((s) => s.section_type === "financial");
    if (financialSection?.custom_content) {
      try {
        const parsedData = JSON.parse(financialSection.custom_content);
        form.setValue("financial", parsedData);
      } catch (error) {
        console.error("Error parsing financial data:", error);
      }
    }
  }, [form]);

  const handleStepChange = async (newStep: number) => {
    // Validate step 0 (basic info) first
    if (currentStep === 0) {
      const isValid = await form.trigger(["title", "location.city", "location.region", "visibility"]);
      if (!isValid) {
        toast.error("Please fill in all required fields before proceeding");
        return;
      }
    }
    setCurrentStep(newStep);
  };

  const onSubmit = async (data: FormValues) => {
    createOpportunity(data);
  };

  // Remove local or existing images
  const handleImageRemove = (sectionIndex: number, imageIndex: number, isExisting: boolean) => {
    if (isExisting) {
      const currentImages = form.getValues(`sections.${sectionIndex}.images`) || [];
      form.setValue(
        `sections.${sectionIndex}.images`,
        currentImages.filter((_, i) => i !== imageIndex)
      );
    } else {
      const currentLocal = form.getValues(`sections.${sectionIndex}.localImages`) || [];
      const imageToRemove = currentLocal[imageIndex];
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      form.setValue(
        `sections.${sectionIndex}.localImages`,
        currentLocal.filter((_, i) => i !== imageIndex)
      );
    }
  };

  // Update local images (caption, details, etc.)
  const handleImageUpdate = (sectionIndex: number, imageIndex: number, updates: Partial<LocalImage>) => {
    const currentLocalImages = form.getValues(`sections.${sectionIndex}.localImages`) || [];
    const newLocalImages = currentLocalImages.map((img, i) =>
      i === imageIndex ? { ...img, ...updates } : img
    );
    form.setValue(`sections.${sectionIndex}.localImages`, newLocalImages);
  };

  // Update existing images (caption, details)
  const handleExistingImageUpdate = (
    sectionIndex: number,
    imageIndex: number,
    updates: Partial<ImageUpdate>
  ) => {
    const currentImages = form.getValues(`sections.${sectionIndex}.images`) || [];
    const newImages = currentImages.map((img, i) => (i === imageIndex ? { ...img, ...updates } : img));
    form.setValue(`sections.${sectionIndex}.images`, newImages);
  };

  // Render a normal section
  const renderSection = (sectionIndex: number) => {
    const section = currentSectionData.sections[sectionIndex];
    const localImages = section?.localImages || [];
    const existingImages = section?.images || [];

    return (
      <div className="space-y-6">
        <FormField
          control={form.control}
          name={`sections.${sectionIndex}.custom_title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Title</FormLabel>
              <FormControl>
                <Input
                  key={`title-${sectionIndex}`}
                  placeholder={`Enter ${SECTION_TYPES[sectionIndex].label} title`}
                  type="text"
                  {...field}
                />
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

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Existing Images</h3>
            <div className="grid grid-cols-1 gap-8">
              {existingImages.map((image, imageIndex) => (
                <div 
                  key={`${image.image_url}-${imageIndex}`}
                  className="space-y-4 p-4 border rounded-lg bg-white"
                >
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.image_url}
                      alt={image.caption || `Image ${imageIndex + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-red-500/80 hover:bg-red-500 border-0 text-white"
                        onClick={() => handleImageRemove(sectionIndex, imageIndex, true)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Uploader */}
        <ImageUploader
          sectionIndex={sectionIndex}
          localImages={localImages}
          onImageSelect={(sIndex: number, images: LocalImage[]) => {
            form.setValue(`sections.${sIndex}.localImages`, images);
          }}
          onImageRemove={(sIndex: number, imageIndex: number) =>
            handleImageRemove(sIndex, imageIndex, false)
          }
          onImageUpdate={handleImageUpdate}
          uploadProgress={uploadProgress}
        />
      </div>
    );
  };

  // Render the financial info
  const renderFinancialInformation = () => {
    const financialSection = currentSectionData.sections?.find(
      (s) => s.section_type === "financial"
    );
    let financialData = currentSectionData.financial;

    if (financialSection?.custom_content) {
      try {
        financialData = JSON.parse(financialSection.custom_content);
      } catch (error) {
        console.error("Error parsing financial data:", error);
      }
    }

    const sectionIndex = currentSectionData.sections.findIndex(
      (s) => s.section_type === "financial"
    );
    const localImages = financialSection?.localImages || [];
    const existingImages = financialSection?.images || [];

    return (
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="financial.equity_distributed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equity Distributed (%)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter equity percentage"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    // Update section content
                    const sections = form.getValues("sections");
                    const financialSectionIndex = sections.findIndex(
                      (s) => s.section_type === "financial"
                    );
                    if (financialSectionIndex !== -1) {
                      const updatedContent = {
                        ...financialData,
                        equity_distributed: e.target.value,
                      };
                      form.setValue(
                        `sections.${financialSectionIndex}.custom_content`,
                        JSON.stringify(updatedContent)
                      );
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="financial.irr_expected"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected IRR (%)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter expected IRR"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    const sections = form.getValues("sections");
                    const finIndex = sections.findIndex((s) => s.section_type === "financial");
                    if (finIndex !== -1) {
                      const updatedContent = {
                        ...financialData,
                        irr_expected: e.target.value,
                      };
                      form.setValue(
                        `sections.${finIndex}.custom_content`,
                        JSON.stringify(updatedContent)
                      );
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="financial.fundraising_goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fundraising Goal (€)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter fundraising goal"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    const sections = form.getValues("sections");
                    const finIndex = sections.findIndex((s) => s.section_type === "financial");
                    if (finIndex !== -1) {
                      const updatedContent = {
                        ...financialData,
                        fundraising_goal: e.target.value,
                      };
                      form.setValue(
                        `sections.${finIndex}.custom_content`,
                        JSON.stringify(updatedContent)
                      );
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="financial.duration_months"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (months)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter duration in months"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    const sections = form.getValues("sections");
                    const finIndex = sections.findIndex((s) => s.section_type === "financial");
                    if (finIndex !== -1) {
                      const updatedContent = {
                        ...financialData,
                        duration_months: e.target.value,
                      };
                      form.setValue(
                        `sections.${finIndex}.custom_content`,
                        JSON.stringify(updatedContent)
                      );
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="financial.pre_money_valuation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pre-Money Valuation (€)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter pre-money valuation"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    const sections = form.getValues("sections");
                    const finIndex = sections.findIndex((s) => s.section_type === "financial");
                    if (finIndex !== -1) {
                      const updatedContent = {
                        ...financialData,
                        pre_money_valuation: e.target.value,
                      };
                      form.setValue(
                        `sections.${finIndex}.custom_content`,
                        JSON.stringify(updatedContent)
                      );
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Financial Section Images */}
        <div className="space-y-6 mt-8">
          <h3 className="text-lg font-medium">Financial Section Images</h3>

          {existingImages.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Existing Images</h4>
              <div className="grid grid-cols-1 gap-8">
                {existingImages.map((image, imageIndex) => (
                  <div key={`${image.image_url}-${imageIndex}`} className="space-y-4">
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={image.image_url}
                        alt={image.caption || `Image ${imageIndex + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-red-500/80 hover:bg-red-500 border-0 text-white"
                          onClick={() => handleImageRemove(sectionIndex, imageIndex, true)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload new images */}
          <ImageUploader
            sectionIndex={sectionIndex}
            localImages={localImages}
            onImageSelect={(sIndex: number, newImages: LocalImage[]) => {
              const currentLocalImages = form.getValues(`sections.${sIndex}.localImages`) || [];
              form.setValue(`sections.${sIndex}.localImages`, [...currentLocalImages, ...newImages]);
            }}
            onImageRemove={(sIndex: number, imageIndex: number) =>
              handleImageRemove(sIndex, imageIndex, false)
            }
            onImageUpdate={handleImageUpdate}
            uploadProgress={uploadProgress}
          />
        </div>
      </div>
    );
  };

  // Steps array
  // [0] => Basic Information (no number)
  // [1..7] => Description & Gallery -> Financial, each labeled 1..7
  const steps = [
    {
      title: "Basic Information",
      fields: ["title", "location", "visibility", "external_url", "external_platform"],
    },
    {
      title: "Description & Gallery",
      section: 0,
    },
    {
      title: "Development Potential",
      section: 1,
    },
    {
      title: "Industrial Partner",
      section: 2,
    },
    {
      title: "Brand Affiliation",
      section: 3,
    },
    {
      title: "Management Company",
      section: 4,
    },
    {
      title: "Project Studio",
      section: 5,
    },
    {
      title: "Financial Information",
      section: 6,
    },
  ];

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter opportunity title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="location.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter city" {...field} />
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
                <Input type="text" placeholder="Enter region" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="visibility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Visibility</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="coming_soon">Coming Soon</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="concluded">Concluded</SelectItem>
              </SelectContent>
            </Select>
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
              <Input type="text" placeholder="Enter external URL" {...field} />
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
              <Input type="text" placeholder="Enter external platform" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {steps.map((step, index) => {
            // If it's index 0 => Basic Info => no number
            // If it's index >= 1 => show the actual step number (index)
            const displayLabel = index === 0 ? "" : String(index); // or we can do "B" instead of ""

            return (
              <div
                key={index}
                className="flex items-center cursor-pointer"
                onClick={() => handleStepChange(index)}
              >
                <button
                  type="button"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    index === currentStep
                      ? "bg-[#4FD1C5] text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {displayLabel}
                </button>
                {index < steps.length - 1 && (
                  <div className="w-12 h-[2px] bg-gray-100" />
                )}
              </div>
            );
          })}
        </div>

        {/* Main step panel */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-8">{steps[currentStep].title}</h2>

          <div key={`step-${currentStep}`} className="min-h-[400px]">
            {currentStep === 0 && renderBasicInformation()}
            {currentStep > 0 && currentStep < 7 && renderSection(currentStep - 1)}
            {currentStep === 7 && renderFinancialInformation()}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleStepChange(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6"
            >
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                type="submit"
                disabled={isLoading}
                className="px-6 bg-[#4FD1C5] hover:bg-[#4FD1C5]/90"
              >
                {isLoading ? "Saving..." : "Create"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleStepChange(Math.min(steps.length - 1, currentStep + 1));
                }}
                className="px-6 bg-[#4FD1C5] hover:bg-[#4FD1C5]/90"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
