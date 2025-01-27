"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, memo, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";
import { Opportunity, Image } from "@/app/types/opportunities";
import { FileUploadModal } from "./file-upload-modal";
import { ViewFilesModal } from "./view-files-modal";
import { OpportunityActions } from "./opportunity-actions";
import { RecentFiles } from "./recent-files";

type VisibilityStatus = "draft" | "private" | "coming_soon" | "active" | "concluded";
type FilterStatus = VisibilityStatus | "all";

export function OpportunityList({
  initialOpportunities,
}: {
  initialOpportunities: Opportunity[];
}) {
  const router = useRouter();

  // Local state
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [opportunities, setOpportunities] = useState<Opportunity[]>(
    initialOpportunities
  );
  const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>(
    {}
  );

  // File modals
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(
    null
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewFilesModalOpen, setIsViewFilesModalOpen] = useState(false);

  const handleOpenUploadModal = (oppId: string) => {
    setSelectedOpportunityId(oppId);
    setIsUploadModalOpen(true);
  };

  const handleOpenViewFilesModal = (oppId: string) => {
    setSelectedOpportunityId(oppId);
    setIsViewFilesModalOpen(true);
  };

  // Handlers
  const handleImageError = useCallback((opportunityId: string) => {
    setImageLoadError((prev) => ({
      ...prev,
      [opportunityId]: true,
    }));
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/admin/opportunities/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete opportunity");
        }
        setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
        toast.success("Opportunity deleted successfully");
        router.refresh();
      } catch (error) {
        console.error("Error deleting opportunity:", error);
        toast.error("Error deleting opportunity");
        router.refresh();
      }
    },
    [router]
  );

  const handleStatusChange = useCallback(
    async (id: string, newStatus: VisibilityStatus) => {
      // Optimistic UI update
      const oldOpportunities = [...opportunities];
      setOpportunities((prev) =>
        prev.map((opp) => (opp.id === id ? { ...opp, visibility: newStatus } : opp))
      );

      try {
        const response = await fetch(`/api/admin/opportunities/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ visibility: newStatus }),
        });

        if (!response.ok) {
          throw new Error("Failed to update opportunity status");
        }

        toast.success("Status updated successfully");
      } catch (error) {
        console.error("Error updating opportunity status:", error);
        toast.error("Error updating status");

        // Revert optimistic update
        setOpportunities(oldOpportunities);
      }
    },
    [opportunities]
  );

  const OpportunityItem = memo(
    ({
      opportunity,
      onStatusChange,
      onDelete,
      imageLoadFailed,
      onImageError,
    }: {
      opportunity: Opportunity;
      onStatusChange: (id: string, status: VisibilityStatus) => void;
      onDelete: (id: string) => void;
      imageLoadFailed: boolean;
      onImageError: () => void;
    }) => {
      // Function to get the first image from Description section
      function getDescriptionFirstImage(opportunity: Opportunity): Image | undefined {
        const descriptionSection = opportunity.sections?.find(
          (section) => section.section_type === "description"
        );
        return descriptionSection?.images?.[0];
      }

      // Get the cover image
      const coverImage = getDescriptionFirstImage(opportunity);

      return (
        <div className="p-6">
          <div className="flex gap-6">
            {/* Thumbnail container */}
            <div className="relative w-48 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {coverImage && !imageLoadFailed ? (
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage.image_url}
                    alt={coverImage.caption || opportunity.title}
                    className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                    onError={() => {
                      console.error("Image load error:", coverImage.image_url);
                      onImageError();
                    }}
                  />
                  {coverImage.caption && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                      <p className="text-white text-sm p-2 truncate">
                        {coverImage.caption}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs text-gray-500">
                    {imageLoadFailed ? "Image failed to load" : "No image available"}
                  </span>
                </div>
              )}
            </div>

            {/* Title / Location / Actions */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{opportunity.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {opportunity.location.city}, {opportunity.location.region}
                  </p>
                </div>

                <OpportunityActions
                  currentStatus={opportunity.visibility}
                  onStatusChange={(status) => onStatusChange(opportunity.id, status)}
                  onEdit={() => router.push(`/admin/dashboard/opportunities/${opportunity.id}`)}
                  onDelete={() => onDelete(opportunity.id)}
                  onUploadFile={() => handleOpenUploadModal(opportunity.id)}
                  onViewFiles={() => handleOpenViewFilesModal(opportunity.id)}
                  opportunityId={opportunity.id}
                />
              </div>

              <RecentFiles 
                opportunityId={opportunity.id} 
                className="mt-4"
              />
            </div>
          </div>
        </div>
      );
    }
  );

  OpportunityItem.displayName = "OpportunityItem";

  // Filtered opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opportunity) => {
      if (filter === "all") return true;
      return opportunity.visibility === filter;
    });
  }, [opportunities, filter]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header row */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Opportunities</h1>
        <Button onClick={() => router.push("/admin/dashboard/opportunities/create")}>
          Create New
        </Button>
      </div>

      {/* Filter */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={filter} onValueChange={(value: FilterStatus) => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="coming_soon">Coming Soon</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="concluded">Concluded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Opportunities list */}
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y">
          {filteredOpportunities.length === 0 && (
            <div className="p-6 text-center text-gray-500">No opportunities found</div>
          )}
          {filteredOpportunities.map((opportunity) => (
            <OpportunityItem
              key={opportunity.id}
              opportunity={opportunity}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              imageLoadFailed={imageLoadError[opportunity.id] === true}
              onImageError={() => handleImageError(opportunity.id)}
            />
          ))}
        </div>
      </div>

      {/* File modals */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        opportunityId={selectedOpportunityId || ""}
        onFileUploaded={() => {
          // If you want to refresh anything after an upload, do so here
        }}
      />
      <ViewFilesModal
        isOpen={isViewFilesModalOpen}
        onClose={() => setIsViewFilesModalOpen(false)}
        opportunityId={selectedOpportunityId || ""}
      />
    </div>
  );
}
