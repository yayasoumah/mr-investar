"use client";

import { Opportunity, Image } from "@/app/types/opportunities";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileIcon } from "lucide-react";

// For type clarity
interface FileRecord {
  id: string;
  name: string;
  size: number;
  url: string;
  visibility: "all" | "opportunity_viewers" | "specific_users";
  created_at: string;
  updated_at: string;
}

interface SharedOpportunityItemProps {
  opportunity: Opportunity;
}

/**
 * Renders a single private Opportunity card, plus the files the user can see.
 */
export function SharedOpportunityItem({ opportunity }: SharedOpportunityItemProps) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  // Fetch user-accessible files for this opportunity
  useEffect(() => {
    async function fetchFiles() {
      try {
        setIsLoadingFiles(true);
        const res = await fetch(`/api/user/opportunities/${opportunity.id}/files`);
        if (!res.ok) {
          throw new Error("Failed to fetch files");
        }
        const data = (await res.json()) as FileRecord[];
        setFiles(data);
      } catch (err) {
        console.error("Error fetching files for opportunity:", err);
      } finally {
        setIsLoadingFiles(false);
      }
    }
    fetchFiles();
  }, [opportunity.id]);

  // Simple helper to format file size
  function formatFileSize(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Function to get the first image from Description & Gallery section
  function getDescriptionFirstImage(opportunity: Opportunity): Image | undefined {
    const descriptionSection = opportunity.sections?.find(
      section => section.section_type === "description"
    );
    return descriptionSection?.images?.[0];
  }

  // Get the first image from Description & Gallery section
  const coverImage = getDescriptionFirstImage(opportunity);

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {/* Maybe a thumbnail if available */}
      <div className="relative h-40 w-full bg-gray-100">
        {coverImage && (
          <img
            src={coverImage.image_url}
            alt={opportunity.title}
            className="object-cover h-full w-full"
          />
        )}
      </div>
      <CardHeader>
        <h3 className="text-lg font-medium">
          {opportunity.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {opportunity.location.city}, {opportunity.location.region}
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <p className="text-sm">
          Visibility: <span className="font-medium text-orange-600">Private</span>
        </p>

        {/* List files accessible by user */}
        <div className="border-t pt-2">
          <p className="text-sm font-medium mb-2">Files Shared with You</p>
          {isLoadingFiles ? (
            <p className="text-sm text-gray-500">Loading files...</p>
          ) : files.length === 0 ? (
            <p className="text-sm text-gray-500">No files</p>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-center justify-between p-2 rounded bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(file.url, "_blank")}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        {/* If you want, link to a detailed page */}
        {/* e.g. <Button onClick={() => router.push(`/opportunities/${opportunity.id}`)}>View</Button> */}
        {/* Or some other logic */}
      </CardFooter>
    </Card>
  );
}
