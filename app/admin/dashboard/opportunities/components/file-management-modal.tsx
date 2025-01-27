"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

/**
 * We define minimal user type & the type for visibility
 */
interface UserProfileMinimal {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

type FileVisibility = "all" | "opportunity_viewers" | "specific_users";

/**
 * The props for our file-management modal
 */
interface FileManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
  fileId: string;
  initialVisibility: FileVisibility;
}

export function FileManagementModal({
  isOpen,
  onClose,
  opportunityId,
  fileId,
  initialVisibility,
}: FileManagementModalProps) {
  const [allUsers, setAllUsers] = useState<UserProfileMinimal[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // The local "visibility" state
  const [visibility, setVisibility] = useState<FileVisibility>(initialVisibility);

  // Loading states
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingAccess, setIsLoadingAccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * 1) Fetch all users once the modal is opened
   */
  useEffect(() => {
    if (!isOpen) return;

    const fetchAllUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const res = await fetch("/api/admin/users");
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = (await res.json()) as UserProfileMinimal[];
        const mapped = data.map((u) => ({
          id: u.id,
          first_name: u.first_name || "",
          last_name: u.last_name || "",
        }));
        setAllUsers(mapped);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching users");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    void fetchAllUsers();
  }, [isOpen]);

  /**
   * 2) A function to fetch the file’s current user access
   */
  const fetchFileAccess = useCallback(async () => {
    try {
      setIsLoadingAccess(true);
      const url = `/api/admin/opportunities/${opportunityId}/files/${fileId}/access`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch file access list");
      const data = (await res.json()) as string[]; // array of userIds
      setSelectedUserIds(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching file access list");
    } finally {
      setIsLoadingAccess(false);
    }
  }, [opportunityId, fileId]);

  /**
   * 3) Use effect to call fetchFileAccess if "specific_users"
   */
  useEffect(() => {
    if (!isOpen) return;
    if (visibility === "specific_users") {
      void fetchFileAccess();
    }
  }, [isOpen, visibility, fetchFileAccess]);

  /**
   * Toggle a user in/out of the selectedUserIds list
   */
  const handleToggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  /**
   * The main SAVE function:
   *  - 1) PATCH the file’s "visibility"
   *  - 2) If "specific_users," PUT the user access
   */
  const handleSave = async () => {
    setIsSaving(true);

    try {
      // 1) PATCH the file’s visibility
      const patchUrl = `/api/admin/opportunities/${opportunityId}/files/${fileId}`;
      const patchRes = await fetch(patchUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
      });
      if (!patchRes.ok) {
        throw new Error("Failed to update file visibility");
      }

      // 2) If specific_users, update user access
      if (visibility === "specific_users") {
        const putAccessUrl = `/api/admin/opportunities/${opportunityId}/files/${fileId}/access`;
        const putRes = await fetch(putAccessUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: selectedUserIds }),
        });
        if (!putRes.ok) {
          throw new Error("Failed to update file access for specific users");
        }
      }

      toast.success("File updated successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save file changes"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Manage File</DialogTitle>
          <DialogDescription>
            Change this file’s visibility and (if needed) select which users can view it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 1) Visibility dropdown */}
          <div className="grid gap-1.5">
            <Label className="text-sm font-medium">Visibility</Label>
            <Select
              value={visibility}
              onValueChange={(v: FileVisibility) => setVisibility(v)}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All (Public)</SelectItem>
                <SelectItem value="opportunity_viewers">Opportunity Viewers</SelectItem>
                <SelectItem value="specific_users">Specific Users</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Who should be allowed to see or download this file?
            </p>
          </div>

          {/* 2) If "specific_users," show the user checkboxes */}
          {visibility === "specific_users" && (
            <div className="grid gap-1.5">
              <Label className="text-sm font-medium">Users with Access</Label>
              {isLoadingUsers || isLoadingAccess ? (
                <div className="space-y-2 mt-2">
                  {[...Array(3)].map((_, idx) => (
                    <Skeleton key={idx} className="h-5 w-full" />
                  ))}
                </div>
              ) : (
                <div className="max-h-64 overflow-auto border rounded p-2 mt-2 space-y-2">
                  {allUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No users found.</p>
                  ) : (
                    allUsers.map((user) => (
                      <Label
                        key={user.id}
                        className="flex items-center space-x-2 py-1 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedUserIds.includes(user.id)}
                          onCheckedChange={() => handleToggleUser(user.id)}
                        />
                        <span className="text-sm">
                          {user.first_name} {user.last_name}
                        </span>
                      </Label>
                    ))
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Only these selected users will see this file.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
