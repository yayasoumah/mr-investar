import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormValues } from "@/app/admin/dashboard/opportunities/components/opportunity-form";
import { uploadImages } from "@/lib/utils/uploadImage";

/**
 * Represents an image stored in `sections[].images`.
 * Note the optional `id?: string` so TS won't complain 
 * about `img.id`.
 */
interface SectionImage {
  id?: string;
  image_url: string;
  caption?: string;
  details?: string;
  order_number: number;
}

interface UseUpdateOpportunityResult {
  updateOpportunity: (opportunityId: string, data: FormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useUpdateOpportunity(): UseUpdateOpportunityResult {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOpportunity = async (opportunityId: string, values: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // For each section, upload any newly added local images
      const sectionsWithImageUrls = await Promise.all(
        values.sections.map(async (section) => {
          // existing images from the form, typed with optional "id"
          const existingImages: SectionImage[] = section.images || [];
          const localImages = section.localImages || [];

          if (localImages.length === 0) {
            // No new uploads; just keep the existing images (which may already have updated captions)
            return {
              ...section,
              images: existingImages,
            };
          }

          // Otherwise, upload the local images
          const uploaded = await uploadImages(localImages);

          // Merge existing images + newly uploaded images
          return {
            ...section,
            images: [
              ...existingImages.map((img) => ({
                // preserve any existing ID
                id: img.id,
                image_url: img.image_url,
                caption: img.caption,
                details: img.details,
                order_number: img.order_number,
              })),
              ...uploaded.map((u) => ({
                // new uploads won't have an ID from the DB yet
                image_url: u.image_url,
                caption: u.caption || "",
                details: u.details || "",
                // Offset order_number by however many existing images we have
                order_number: existingImages.length + u.order_number,
              })),
            ],
            localImages: undefined, // Remove local images array
          };
        })
      );

      // Construct final payload with merged images
      const finalPayload = {
        ...values,
        sections: sectionsWithImageUrls.map((section) => ({
          section_type: section.section_type,
          custom_title: section.custom_title,
          custom_content: section.custom_content,
          order_number: section.order_number,
          images: section.images,
        })),
      };

      // Send final payload to your API
      const response = await fetch(`/api/admin/opportunities/${opportunityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPayload),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || "Failed to update opportunity");
      }

      toast.success("Opportunity updated successfully!", {
        duration: 3000,
      });

      // Navigate back to the opportunities list
      router.push("/admin/dashboard/opportunities");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update opportunity";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateOpportunity,
    isLoading,
    error,
  };
}
