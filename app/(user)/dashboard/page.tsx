"use client";

import { useEffect, useState } from "react";
import { OpportunityCard } from "./components/opportunity-card";
import { Opportunity } from "@/app/types/opportunities";
import { EmptyState } from "./components/empty-state";

export default function UserDashboardPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("/api/user/opportunities");
        if (!response.ok) throw new Error("Failed to fetch opportunities");
        const data = await response.json();
        setOpportunities(data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Investment Opportunities</h1>
      </div>

      {/* Opportunities Grid */}
      {opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Investment Opportunities"
          description="There are currently no active investment opportunities. Check back soon for new opportunities."
          showExploreButton={false}
        />
      )}
    </div>
  );
}