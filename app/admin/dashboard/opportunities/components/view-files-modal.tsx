"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, Trash2, FileIcon, Eye, EyeOff, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { FileAccessModal } from "./file-access-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FileItem {
  id: string;
  name: string;
  size: number;
  url: string;
  visibility: "all" | "opportunity_viewers" | "specific_users";
  created_at: string;
}

interface ViewFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
}

export function ViewFilesModal({ isOpen, onClose, opportunityId }: ViewFilesModalProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fileForAccess, setFileForAccess] = useState<FileItem | null>(null);
  const [visibilityLoading, setVisibilityLoading] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/opportunities/${opportunityId}/files`);
      if (!res.ok) {
        throw new Error("Failed to fetch files");
      }
      const data = (await res.json()) as FileItem[];
      setFiles(
        data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        toast.error(error.message || "Error fetching files");
      } else {
        console.error(error);
        toast.error("Error fetching files");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && opportunityId) {
      void fetchFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, opportunityId]);

  const handleDeleteFile = async (file: FileItem) => {
    try {
      setDeleteLoading(true);
      const deleteUrl = `/api/admin/opportunities/${opportunityId}/files?fileId=${file.id}`;
      const res = await fetch(deleteUrl, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete file");
      }
      toast.success("File deleted successfully");
      setFileToDelete(null);
      void fetchFiles();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        toast.error(error.message || "Error deleting file");
      } else {
        console.error(error);
        toast.error("Error deleting file");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleVisibilityChange = async (fileId: string, newVisibility: string) => {
    try {
      setVisibilityLoading(fileId);
      const res = await fetch(
        `/api/admin/opportunities/${opportunityId}/files/${fileId}/visibility`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ visibility: newVisibility }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update visibility");
      }

      // Update local state
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, visibility: newVisibility as FileItem["visibility"] } : f
        )
      );

      toast.success("File visibility updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update file visibility");
    } finally {
      setVisibilityLoading(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleDownload = async (file: FileItem) => {
    try {
      window.open(file.url, "_blank");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        toast.error(error.message || "Error downloading file");
      } else {
        console.error(error);
        toast.error("Error downloading file");
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Files</DialogTitle>
            <DialogDescription>
              Manage files associated with this opportunity
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileIcon className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No files uploaded</h3>
                <p className="text-sm text-muted-foreground">
                  Upload files to share them with your investors
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{file.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={file.visibility}
                          onValueChange={(value) => handleVisibilityChange(file.id, value)}
                          disabled={visibilityLoading === file.id}
                        >
                          <SelectTrigger className="w-[220px] h-9">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent className="min-w-[220px]">
                            <SelectItem value="all" className="py-2">
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-green-500 shrink-0" />
                                <span>All Users</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="opportunity_viewers" className="py-2">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-500 shrink-0" />
                                <span>Opportunity Viewers</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="specific_users" className="py-2">
                              <div className="flex items-center gap-2">
                                <EyeOff className="h-4 w-4 text-orange-500 shrink-0" />
                                <span>Specific Users</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>
                        <time
                          dateTime={file.created_at}
                          className="text-sm text-muted-foreground"
                        >
                          {new Date(file.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(file)}
                            title="Download file"
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          {/* If the file is specific_users, let admin manage the file's access */}
                          {file.visibility === "specific_users" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setFileForAccess(file)}
                              title="Manage File Access"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setFileToDelete(file)}
                            className={cn(
                              "hover:text-red-500",
                              deleteLoading && "pointer-events-none opacity-50"
                            )}
                            title="Delete file"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!fileToDelete}
        onOpenChange={() => !deleteLoading && setFileToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{fileToDelete?.name}&quot;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => fileToDelete && handleDeleteFile(fileToDelete)}
              disabled={deleteLoading}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal for managing file-specific access */}
      <FileAccessModal
        isOpen={!!fileForAccess}
        onClose={() => setFileForAccess(null)}
        opportunityId={opportunityId}
        fileId={fileForAccess?.id || ""}
      />
    </>
  );
}
