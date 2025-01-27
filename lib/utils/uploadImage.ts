import { LocalImage } from "@/app/admin/dashboard/opportunities/components/opportunity-form";

/**
 * Optimizes and uploads an image to the server.
 * Returns the uploaded image URL and metadata.
 */
export async function uploadImage(
  file: File,
  metadata?: {
    caption?: string;
    details?: string;
    order_number: number;
    preview?: string;
  }
): Promise<LocalImage & { image_url: string }> {
  // Create form data with image and metadata
  const formData = new FormData();
  formData.append("file", file);
  
  if (metadata) {
    formData.append("metadata", JSON.stringify(metadata));
  }

  // Upload to our API route
  const response = await fetch("/api/admin/opportunities/images", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload image");
  }

  const result = await response.json();
  
  // Create a File-like object that matches LocalImage type
  const localImage = {
    ...file, // Spread all File properties
    preview: metadata?.preview || URL.createObjectURL(file),
    image_url: result.publicUrl,
    caption: metadata?.caption || "",
    details: metadata?.details || "",
    order_number: metadata?.order_number || 0,
    id: result.id || crypto.randomUUID(),
    // Implement File interface methods
    arrayBuffer: () => file.arrayBuffer(),
    slice: (start?: number, end?: number, contentType?: string) => file.slice(start, end, contentType),
    stream: () => file.stream(),
    text: () => file.text(),
  } as LocalImage & { image_url: string };

  return localImage;
}

/**
 * Uploads multiple images in parallel with progress tracking.
 */
export async function uploadImages(
  images: LocalImage[]
): Promise<Array<LocalImage & { image_url: string }>> {
  return Promise.all(
    images.map(async (img) => {
      // Convert base64/blob URL to File object if needed
      const response = await fetch(img.preview);
      const blob = await response.blob();
      const file = new File([blob], `image-${img.id}.jpg`, { 
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      return uploadImage(file, {
        caption: img.caption,
        details: img.details,
        order_number: img.order_number,
        preview: img.preview,
      });
    })
  );
}
