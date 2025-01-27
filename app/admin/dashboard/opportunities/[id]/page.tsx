"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { OpportunityUpdateForm } from "../components/opportunity-update-form";
import { Opportunity } from "@/app/types/opportunities";
import { SECTION_TYPES } from "../components/opportunity-form";
import { Skeleton } from "@/components/ui/skeleton";

interface EditOpportunityPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Type that matches exactly what the form expects
interface FormOpportunity {
  title: string;
  location: {
    city: string;
    region: string;
  };
  visibility: "draft" | "private" | "coming_soon" | "active" | "concluded";
  external_url?: string;
  external_platform?: string;
  sections: Array<{
    section_type: string;
    custom_title?: string;
    custom_content?: string;
    order_number: number;
    images?: Array<{
      image_url: string;
      caption?: string;
      details?: string;
      order_number: number;
    }>;
  }>;
  financial: {
    equity_distributed: string;
    irr_expected: string;
    fundraising_goal: string;
    duration_months: string;
    pre_money_valuation: string;
  };
}

export default function EditOpportunityPage({
  params: paramsPromise,
}: EditOpportunityPageProps) {
  const params = use(paramsPromise);
  const [opportunity, setOpportunity] = useState<FormOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/opportunities/${params.id}`);
        const responseData = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error(responseData.error || "Failed to fetch opportunity");
        }

        const data: Opportunity = responseData;

        // Transform the data to match form structure
        const formData: FormOpportunity = {
          title: data.title,
          location: data.location,
          visibility: data.visibility,
          external_url: data.external_url || "",
          external_platform: data.external_platform || "",
          sections: SECTION_TYPES.map((type) => {
            const existingSection = data.sections?.find(
              (section) => section.section_type === type.id
            );

            return {
              section_type: type.id,
              custom_title: existingSection?.custom_title || "",
              custom_content: existingSection?.custom_content || "",
              order_number:
                existingSection?.order_number ||
                SECTION_TYPES.findIndex((t) => t.id === type.id) + 1,
              images:
                existingSection?.images?.map((image) => ({
                  image_url: image.image_url,
                  caption: image.caption || "",
                  details: image.details || "",
                  order_number: image.order_number,
                })) || [],
            };
          }),
          // Initialize financial data with default empty values
          financial: {
            equity_distributed: "",
            irr_expected: "",
            fundraising_goal: "",
            duration_months: "",
            pre_money_valuation: "",
          },
        };

        // Extract financial data from the financial section
        const financialSection = data.sections?.find(
          (section) => section.section_type === "financial"
        );

        if (financialSection?.custom_content) {
          try {
            // Parse financial data from JSON in custom_content
            const parsedFinancialData = JSON.parse(financialSection.custom_content);
            formData.financial = {
              equity_distributed: parsedFinancialData.equity_distributed || "",
              irr_expected: parsedFinancialData.irr_expected || "",
              fundraising_goal: parsedFinancialData.fundraising_goal || "",
              duration_months: parsedFinancialData.duration_months || "",
              pre_money_valuation: parsedFinancialData.pre_money_valuation || "",
            };
          } catch (e) {
            console.error("Error parsing financial data:", e);
            // Already initialized defaults
          }
        }

        setOpportunity(formData);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching the opportunity"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunity();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[800px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-yellow-500 text-xl mb-4">No Data</div>
            <p className="text-gray-600">Could not load opportunity data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Opportunity</h1>
      </div>

      <OpportunityUpdateForm initialData={opportunity} opportunityId={params.id} />
    </div>
  );
}
