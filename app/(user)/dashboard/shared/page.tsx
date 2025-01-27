"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "../components/empty-state";
import { Opportunity } from "@/app/types/opportunities";
import { SharedOpportunityItem } from "./shared-opportunity-item";

/**
 * Shows all opportunities with visibility="private" 
 * that are shared with the current user.
 * The user can see them thanks to RLS.
 * Then also fetch the files for each, if the user has access.
 */
export default function UserSharedOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // This endpoint only returns opportunities user can see
        // (private or otherwise) due to RLS
        const response = await fetch("/api/user/opportunities");
        if (!response.ok) throw new Error("Failed to fetch opportunities");
        const data = await response.json() as Opportunity[];
        // Filter to only "private" ones
        const privateOpps = data.filter((opp) => opp.visibility === "private");
        setOpportunities(privateOpps);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (isLoading) {
    return <div>Loading private opportunities...</div>;
  }

  if (opportunities.length === 0) {
    return (
      <EmptyState
        title="No Shared Opportunities"
        description="There are no private opportunities currently shared with you."
        showExploreButton={false}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shared Opportunities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity) => (
          <SharedOpportunityItem key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  );
}
