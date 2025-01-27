"use client";

import { useEffect, useState } from "react";
import { OpportunityCard } from "./components/opportunity-card";
import { Opportunity } from "@/app/types/opportunities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileX } from "lucide-react";
import Link from "next/link";

export default function AdminPreviewPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("/api/admin/preview/opportunities");
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
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User View Preview</h1>
      </div>

      {/* Opportunities Grid */}
      {opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <FileX className="w-12 h-12 text-gray-400" />
            <div className="space-y-2">
              <h3 className="text-xl font-medium">No Opportunities Available</h3>
              <p className="text-gray-500">There are currently no investment opportunities to preview.</p>
            </div>
            <Link href="/admin/dashboard/opportunities/create">
              <Button>Create New Opportunity</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}