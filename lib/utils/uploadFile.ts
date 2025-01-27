import { v4 as uuidv4 } from "uuid";

/**
 * Upload a file (any type) to Supabase Storage, returning its public URL & path.
 */
export async function uploadFile(
  file: File,
  metadata?: {
    name?: string;
    size?: number;
    visibility?: string; // 'all' | 'opportunity_viewers' | 'specific_users'
    opportunityId?: string;
  }
): Promise<{
  publicUrl: string;
  path: string;
}> {
  const formData = new FormData();

  // Generate unique name so we don't clash in the bucket
  const fileExtension = file.name.split(".").pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension || "dat"}`;

  // Create a new File with the unique name
  const uniqueFile = new File([file], uniqueFileName, { type: file.type });
  formData.append("file", uniqueFile);

  if (metadata) {
    // We'll pass along the original name & other metadata
    formData.append(
      "metadata",
      JSON.stringify({
        ...metadata,
        originalName: file.name,
      })
    );
  }

  // POST to our Next.js route for uploading
  const response = await fetch("/api/admin/files/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  const data = await response.json();
  return {
    publicUrl: data.publicUrl,
    path: data.path,
  };
}
