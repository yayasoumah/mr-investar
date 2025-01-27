"use client";

import { Opportunity, Image as OpportunityImage } from "@/app/types/opportunities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

function getStatusColor(visibility: string) {
  switch (visibility) {
    case "active":
      return "text-green-600";     // Active = green
    case "private":
      return "text-orange-600";    // Private = orange
    case "coming_soon":
      return "text-blue-600";      // Coming Soon = blue
    case "draft":
      return "text-gray-600";      // Draft = gray
    case "concluded":
      return "text-purple-600";    // Concluded = purple
    default:
      return "text-gray-600";      // Fallback
  }
}

function getStatusLabel(visibility: string) {
  switch (visibility) {
    case "active":
      return "Available";
    case "private":
      return "Private";
    case "coming_soon":
      return "Coming Soon";
    case "draft":
      return "Draft";
    case "concluded":
      return "Concluded";
    default:
      return "Unknown";
  }
}

// Function to get the first image from Description & Gallery section
function getDescriptionFirstImage(opportunity: Opportunity): OpportunityImage | undefined {
  const descriptionSection = opportunity.sections?.find(
    section => section.section_type === "description"
  );
  return descriptionSection?.images?.[0];
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const router = useRouter();
  
  // Get the first image from Description & Gallery section
  const coverImage = getDescriptionFirstImage(opportunity);

  return (
    <Card className="overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-48 w-full">
        {coverImage ? (
          <Image
            src={coverImage.image_url}
            alt={coverImage.caption || opportunity.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
      </div>

      {/* Header */}
      <CardHeader>
        <h3 className="text-lg font-medium">{opportunity.title}</h3>
        <p className="text-sm text-gray-500">
          {opportunity.location.city}, {opportunity.location.region}
        </p>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Status:</span>
          <span className={getStatusColor(opportunity.visibility)}>
            {getStatusLabel(opportunity.visibility)}
          </span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => router.push(`/opportunities/${opportunity.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
