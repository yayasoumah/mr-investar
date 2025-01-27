import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormValues } from "@/app/admin/dashboard/opportunities/components/opportunity-form";
import { uploadImages } from "@/lib/utils/uploadImage";

/**
 * Hook for creating opportunities with optimized image uploads
 */
export function useCreateOpportunity() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOpportunity = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: For each section, upload and optimize images
      const sectionsWithImageUrls = await Promise.all(
        values.sections.map(async (section) => {
          const localImages = section.localImages || [];

          if (localImages.length === 0) {
            return {
              ...section,
              images: section.images || [],
            };
          }

          // Upload images with optimization
          const uploaded = await uploadImages(localImages);

          return {
            ...section,
            images: uploaded.map((u) => ({
              image_url: u.image_url,
              caption: u.caption || "",
              details: u.details || "",
              order_number: u.order_number,
            })),
          };
        })
      );

      // Step 2: Construct the final payload
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

      // Step 3: Create the opportunity
      const response = await fetch("/api/admin/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create opportunity");
      }

      await response.json(); // Consume the response

      // Show success message
      toast.success("Opportunity created successfully!", {
        duration: 3000,
      });

      // Navigate back to opportunities list
      router.push("/admin/dashboard/opportunities");
      router.refresh();

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create opportunity";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOpportunity,
    isLoading,
    error,
  };
}
