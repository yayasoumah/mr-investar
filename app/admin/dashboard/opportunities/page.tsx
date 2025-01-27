"use client";

import { useEffect, useState } from "react";
import { OpportunityList } from "./components/opportunity-list";
import { Opportunity } from "@/app/types/opportunities";

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("/api/admin/opportunities");
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

  return <OpportunityList initialOpportunities={opportunities} />;
} 