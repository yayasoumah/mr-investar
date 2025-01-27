"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner";

interface UserProfileMinimal {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface FileAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
  fileId: string;
}

/**
 * Allows admin to select which user(s) can see a file that has visibility = 'specific_users'.
 * Fetches all users from /api/admin/users,
 * then calls /api/admin/opportunities/[id]/files/[fileId]/access for read/write.
 */
export function FileAccessModal({
  isOpen,
  onClose,
  opportunityId,
  fileId,
}: FileAccessModalProps) {
  const [allUsers, setAllUsers] = useState<UserProfileMinimal[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoadingAccess, setIsLoadingAccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch all users
    const fetchAllUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");
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

    fetchAllUsers();
  }, [isOpen]);

  // Fetch current file access
  useEffect(() => {
    if (!isOpen) return;
    if (!fileId || !opportunityId) return;

    const fetchFileAccess = async () => {
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
    };

    fetchFileAccess();
  }, [isOpen, opportunityId, fileId]);

  const handleToggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    } else {
      setSelectedUserIds((prev) => [...prev, userId]);
    }
  };

  const handleSave = async () => {
    try {
      const url = `/api/admin/opportunities/${opportunityId}/files/${fileId}/access`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedUserIds }),
      });
      if (!res.ok) {
        throw new Error("Failed to save file access list");
      }
      toast.success("File access updated");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error updating file access");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage File Access</DialogTitle>
          <DialogDescription>
            Select which users should see this file (visibility: Specific Users).
          </DialogDescription>
        </DialogHeader>

        {isLoadingUsers || isLoadingAccess ? (
          <div className="space-y-2 mt-2">
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} className="h-5 w-full" />
            ))}
          </div>
        ) : (
          <div className="max-h-96 overflow-auto border rounded p-2 mt-2 space-y-2">
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

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoadingUsers || isLoadingAccess}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
