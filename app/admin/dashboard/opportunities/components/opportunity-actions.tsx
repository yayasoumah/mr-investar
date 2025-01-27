"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Trash2,
  Upload,
  Files,
  EyeOff,
  Clock,
  Check,
  Archive,
  FileText,
  Pencil,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OpportunityAccessModal } from "./opportunity-access-modal";

type VisibilityStatus = "draft" | "private" | "coming_soon" | "active" | "concluded";

interface OpportunityActionsProps {
  currentStatus: VisibilityStatus;
  onStatusChange: (status: VisibilityStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
  onUploadFile: () => void;
  onViewFiles: () => void;
  opportunityId: string;
}

export function OpportunityActions({
  currentStatus,
  onStatusChange,
  onEdit,
  onDelete,
  onUploadFile,
  onViewFiles,
  opportunityId,
}: OpportunityActionsProps) {
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  const getStatusIcon = (status: VisibilityStatus) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4 text-zinc-500" />;
      case "private":
        return <EyeOff className="h-4 w-4 text-orange-500" />;
      case "coming_soon":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "active":
        return <Check className="h-4 w-4 text-green-500" />;
      case "concluded":
        return <Archive className="h-4 w-4 text-purple-500" />;
    }
  };

  const getStatusLabel = (status: VisibilityStatus) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "private":
        return "Private";
      case "coming_soon":
        return "Coming Soon";
      case "active":
        return "Active";
      case "concluded":
        return "Concluded";
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/5 active:scale-95 transition-all"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white border border-border shadow-lg rounded-md"
        >
          <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={onEdit}
              className="hover:bg-primary/5 cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Opportunity
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2 py-1.5">
              Files
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={onUploadFile}
              className="hover:bg-primary/5 cursor-pointer"
            >
              <Upload className="mr-2 h-4 w-4 text-black" />
              <span className="text-black">Upload File</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onViewFiles}
              className="hover:bg-primary/5 cursor-pointer"
            >
              <Files className="mr-2 h-4 w-4" />
              View All Files
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2 py-1.5">
              Visibility
            </DropdownMenuLabel>
            {["draft", "private", "coming_soon", "active", "concluded"].map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => onStatusChange(status as VisibilityStatus)}
                className={cn(
                  "flex items-center cursor-pointer py-2",
                  currentStatus === status
                    ? "bg-primary/10 hover:bg-primary/15"
                    : "hover:bg-primary/5"
                )}
              >
                {getStatusIcon(status as VisibilityStatus)}
                <span
                  className={cn(
                    "ml-2",
                    currentStatus === status && "font-medium"
                  )}
                >
                  {getStatusLabel(status as VisibilityStatus)}
                </span>
                {currentStatus === status && (
                  <Check className="ml-auto h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}

            {/* If current status is private, we can manage user access */}
            {currentStatus === "private" && (
              <DropdownMenuItem
                onClick={() => setIsAccessModalOpen(true)}
                className="hover:bg-primary/5 cursor-pointer"
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Access
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-border" />

          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50 hover:text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="bg-white border border-border shadow-lg sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Opportunity</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Are you sure you want to delete this opportunity? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline">Cancel</Button>
                <Button
                  variant="danger"
                  onClick={onDelete}
                  className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Access modal for private */}
      <OpportunityAccessModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        opportunityId={opportunityId}
      />
    </>
  );
}
