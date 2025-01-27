"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Opportunity, Financial, Image } from "@/app/types/opportunities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionContent } from "@/components/opportunities/section-content";
import { FinancialDetails } from "@/components/opportunities/financial-details";

interface OpportunityDetailPageProps {
  params: Promise<{ id: string }>;
}

// Section type order based on opportunity form
const SECTION_TYPE_ORDER = [
  "description",
  "development",
  "partner",
  "brand",
  "management",
  "studio",
  "financial",
] as const;

// Function to get section order index
function getSectionOrderIndex(type: string): number {
  const index = SECTION_TYPE_ORDER.indexOf(type as typeof SECTION_TYPE_ORDER[number]);
  return index === -1 ? SECTION_TYPE_ORDER.length : index;
}

// Function to get a human-readable section title
function getSectionTitle(type: string, index: number): string {
  const titles: { [key: string]: string } = {
    description: "Description & Gallery",
    development: "Development Progress",
    partner: "Partners",
    brand: "Brand",
    management: "Management",
    studio: "Studio",
    financial: "Financial Details"
  };
  const baseTitle = titles[type] || type.charAt(0).toUpperCase() + type.slice(1);
  return `${index + 1}. ${baseTitle}`;
}

// Function to safely parse JSON
function tryParseJSON<T>(jsonString: string | undefined): T | null {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return null;
  }
}

// Function to get status color class
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

// Function to get human-readable status label
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
function getDescriptionFirstImage(opportunity: Opportunity): Image | undefined {
  const descriptionSection = opportunity.sections?.find(
    section => section.section_type === "description"
  );
  return descriptionSection?.images?.[0];
}

export default function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { id } = use(params);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await fetch(`/api/user/opportunities/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch opportunity");
        }
        const data = await response.json();
        setOpportunity(data);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!opportunity) {
    notFound();
  }

  // Sort sections by predefined order and then by order_number
  const sortedSections = [...(opportunity.sections || [])].sort((a, b) => {
    const orderA = getSectionOrderIndex(a.section_type);
    const orderB = getSectionOrderIndex(b.section_type);
    if (orderA !== orderB) return orderA - orderB;
    return (a.order_number || 0) - (b.order_number || 0);
  });

  // Get cover image for header
  const coverImage = getDescriptionFirstImage(opportunity);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{opportunity.title}</h1>
      </div>

      {/* Cover Image */}
      {coverImage && (
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
          <img
            src={coverImage.image_url}
            alt={coverImage.caption || opportunity.title}
            className="w-full h-full object-cover"
          />
          {coverImage.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
              <p className="text-sm">{coverImage.caption}</p>
            </div>
          )}
        </div>
      )}

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-600">Status</span>
              <p className={getStatusColor(opportunity.visibility)}>
                {getStatusLabel(opportunity.visibility)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Location</span>
              <p>{opportunity.location?.city}, {opportunity.location?.region}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-8">
        {sortedSections.map((section, index) => {
          // Parse financial data from section content if it's a financial section
          let financialData: Financial | undefined;
          if (section.section_type === "financial" && section.custom_content) {
            const parsedData = tryParseJSON<{
              equity_distributed?: string;
              irr_expected?: string;
              fundraising_goal?: string;
              duration_months?: string;
              pre_money_valuation?: string;
            }>(section.custom_content);
            if (parsedData) {
              financialData = {
                equity_distributed: parsedData.equity_distributed || "0",
                irr_expected: parsedData.irr_expected || "0",
                fundraising_goal: parsedData.fundraising_goal || "0",
                duration_months: parsedData.duration_months || "0",
                pre_money_valuation: parsedData.pre_money_valuation || "0"
              };
            }
          }

          return (
            <Card key={section.id} className="overflow-hidden">
              <CardContent className="p-8">
                <SectionContent
                  title={getSectionTitle(section.section_type, index)}
                  customTitle={section.custom_title}
                  content={
                    section.section_type === "financial" && financialData ? (
                      <FinancialDetails financial={financialData} />
                    ) : (
                      section.custom_content
                    )
                  }
                  images={section.images}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Invest Button */}
      {opportunity.external_url && opportunity.visibility === "active" && (
        <div className="flex justify-center py-8">
          <a 
            href={opportunity.external_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full max-w-md"
          >
            <Button 
              className="w-full py-6 text-lg" 
              size="lg"
            >
              Invest Now
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
