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

interface OpportunityAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
}

/**
 * Allows admin to select which user(s) can see this opportunity (when visibility = 'private').
 * Uses /api/admin/users to fetch all users, 
 * uses /api/admin/opportunities/[id]/access to read & write the selected userIds.
 */
export function OpportunityAccessModal({
  isOpen,
  onClose,
  opportunityId,
}: OpportunityAccessModalProps) {
  const [allUsers, setAllUsers] = useState<UserProfileMinimal[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoadingAccess, setIsLoadingAccess] = useState(false);

  // Fetch all users
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

    fetchAllUsers();
  }, [isOpen]);

  // Fetch who has access
  useEffect(() => {
    if (!isOpen) return;
    if (!opportunityId) return;

    const fetchOpportunityAccess = async () => {
      try {
        setIsLoadingAccess(true);
        const res = await fetch(`/api/admin/opportunities/${opportunityId}/access`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          if (res.status === 401) {
            throw new Error("Authentication required. Please log in again.");
          } else if (res.status === 403) {
            throw new Error("You don't have permission to access this resource.");
          } else {
            throw new Error(errorData.error || "Failed to fetch access list");
          }
        }
        const data = (await res.json()) as string[]; // array of userIds
        setSelectedUserIds(data);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching opportunity access list");
      } finally {
        setIsLoadingAccess(false);
      }
    };

    fetchOpportunityAccess();
  }, [isOpen, opportunityId]);

  const handleToggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    } else {
      setSelectedUserIds((prev) => [...prev, userId]);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/admin/opportunities/${opportunityId}/access`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedUserIds }),
      });
      if (!res.ok) {
        throw new Error("Failed to save access list");
      }
      toast.success("Updated access successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error updating access");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Opportunity Access</DialogTitle>
          <DialogDescription>
            Select which users should see this opportunity when it is set to Private.
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
