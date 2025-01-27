"use client";

import { useEffect, useState } from "react";
import { FileIcon, Download, Users, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FileAccessModal } from "./file-access-modal";

interface FileItem {
  id: string;
  name: string;
  size: number;
  url: string;
  visibility: "all" | "opportunity_viewers" | "specific_users";
  created_at: string;
}

interface RecentFilesProps {
  opportunityId: string;
  className?: string;
}

export function RecentFiles({ opportunityId, className }: RecentFilesProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // For managing file access
  const [fileForAccess, setFileForAccess] = useState<FileItem | null>(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/opportunities/${opportunityId}/files`);
        if (!response.ok) throw new Error("Failed to fetch files");
        const data = (await response.json()) as FileItem[];

        // The API returns files sorted by created_at desc; take the first 5
        setFiles(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (opportunityId) {
      void fetchFiles();
    }
  }, [opportunityId]);

  if (isLoading) {
    return (
      <div className={cn("space-y-2", className)}>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <>
      <div className={cn("mt-4 space-y-2", className)}>
        <div className="text-sm font-medium text-muted-foreground">Recent Files</div>
        <div className="grid gap-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="group flex items-center gap-3 rounded-lg border p-2 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
                <FileIcon className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </div>
              </div>

              {/* Download */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(file.url, "_blank")}
                aria-label="Download file"
              >
                <Download className="h-4 w-4" />
              </Button>

              {/* If file is specific_users, let admin manage file's access */}
              {file.visibility === "specific_users" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFileForAccess(file)}
                  aria-label="Manage file access"
                  className="hover:text-orange-500"
                >
                  <Users className="h-4 w-4" />
                </Button>
              )}

              {/* If file is 'all' (public), show an icon or remove this block as desired */}
              {file.visibility === "all" && (
                <EyeOff 
                  className="h-4 w-4 text-green-500"
                  aria-label="Public file"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* File Access Modal */}
      <FileAccessModal
        isOpen={!!fileForAccess}
        onClose={() => setFileForAccess(null)}
        opportunityId={opportunityId}
        fileId={fileForAccess?.id || ""}
      />
    </>
  );
}
