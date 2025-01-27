"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { uploadFile } from "@/lib/utils/uploadFile";
import { FileIcon, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
  onFileUploaded?: () => void;
}

type FileVisibility = "all" | "opportunity_viewers" | "specific_users";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function FileUploadModal({
  isOpen,
  onClose,
  opportunityId,
  onFileUploaded,
}: FileUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<FileVisibility>("opportunity_viewers");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const selectedFile = files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 50MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      await uploadFile(file, {
        name: file.name,
        size: file.size,
        visibility,
        opportunityId,
      });
      toast.success("File uploaded successfully!");
      onClose();
      onFileUploaded?.();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        toast.error(err.message || "Failed to upload file");
      } else {
        console.error(err);
        toast.error("Failed to upload file");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Choose a file to upload for this opportunity and set its visibility.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* File Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("fileInput")?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50",
              file && "border-primary/50 bg-primary/5"
            )}
          >
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files)}
              disabled={isLoading}
            />
            
            {file ? (
              <div className="flex items-center gap-2 p-2">
                <FileIcon className="w-8 h-8 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate max-w-[300px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to select a file
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum file size: 50MB
                </p>
              </>
            )}
          </div>

          {/* Visibility */}
          <div className="grid w-full items-center gap-1.5">
            <Label className="text-sm font-medium">Who can see this file?</Label>
            <Select
              value={visibility}
              onValueChange={(v: FileVisibility) => setVisibility(v)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opportunity_viewers">
                  Opportunity Viewers (Recommended)
                </SelectItem>
                <SelectItem value="all">Everyone</SelectItem>
                <SelectItem value="specific_users">Specific Users Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {visibility === "opportunity_viewers" && "Only users with access to this opportunity can view this file"}
              {visibility === "all" && "Anyone can view this file"}
              {visibility === "specific_users" && "Only selected users can view this file"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
