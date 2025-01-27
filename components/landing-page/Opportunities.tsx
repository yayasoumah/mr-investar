"use client";

import { useEffect, useState } from "react";
import { Opportunity, Image as OpportunityImage } from "@/app/types/opportunities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("/api/featured/opportunities");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch opportunities");
        }

        setOpportunities(data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        setError(error instanceof Error ? error.message : "Failed to load opportunities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Get the first image from Description & Gallery section
  const getFirstImage = (opportunity: Opportunity): OpportunityImage | undefined => {
    const descriptionSection = opportunity.sections?.find(
      section => section.section_type === "description"
    );
    return descriptionSection?.images?.[0];
  };

  return (
    <section id="opportunities" className="bg-white py-20">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-secondary mb-4">
            Featured Investment Opportunities
          </h2>
          <p className="text-xl text-grey-500 max-w-2xl mx-auto">
            Discover our handpicked selection of premium hospitality properties across Italy&apos;s most prestigious locations.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-gray-600">Loading opportunities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No opportunities available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => {
              const firstImage = getFirstImage(opportunity);
              
              return (
                <Card key={opportunity.id} className="overflow-hidden">
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
                      <span className="text-green-600">Available</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/auth/signin" className="w-full" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}