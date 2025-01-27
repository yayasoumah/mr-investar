"use client";

import { Opportunity, Image as OpportunityImage } from "@/app/types/opportunities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const router = useRouter();
  
  // Function to get the first image from Description & Gallery section
  const getDescriptionFirstImage = (opportunity: Opportunity): OpportunityImage | undefined => {
    const descriptionSection = opportunity.sections?.find(
      section => section.section_type === "description"
    );
    return descriptionSection?.images?.[0];
  };

  // Get the cover image
  const firstImage = getDescriptionFirstImage(opportunity);

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        {firstImage ? (
          <Image
            src={firstImage.image_url}
            alt={firstImage.caption || opportunity.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
      </div>
      <CardHeader>
        <h3 className="text-lg font-medium">{opportunity.title}</h3>
        <p className="text-sm text-gray-500">
          {opportunity.location.city}, {opportunity.location.region}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Status:</span>
          <span className={opportunity.visibility === "active" ? "text-green-600" : "text-orange-600"}>
            {opportunity.visibility === "active" ? "Available" : "Concluded"}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => router.push(`/admin/dashboard/preview/${opportunity.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
