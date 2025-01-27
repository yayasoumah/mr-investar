"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "../components/empty-state";
import { OpportunityCard } from "../components/opportunity-card";
import { Opportunity } from "@/app/types/opportunities";

export default function UserOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState("all");
  const [location, setLocation] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("/api/user/opportunities");
        if (!response.ok) throw new Error("Failed to fetch opportunities");
        const data = await response.json();
        setOpportunities(data);
        setFilteredOpportunities(data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  useEffect(() => {
    let filtered = opportunities;

    // Filter by type
    if (type !== "all") {
      filtered = filtered.filter((opp) => 
        opp.sections?.some((section) => 
          section.section_type?.toLowerCase() === type.toLowerCase()
        )
      );
    }

    // Filter by location
    if (location !== "all") {
      filtered = filtered.filter((opp) => 
        opp.location.city.toLowerCase() === location.toLowerCase()
      );
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((opp) => 
        opp.title.toLowerCase().includes(searchLower) ||
        opp.location.city.toLowerCase().includes(searchLower) ||
        opp.location.region.toLowerCase().includes(searchLower)
      );
    }

    setFilteredOpportunities(filtered);
  }, [opportunities, type, location, search]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-3xl font-bold">Investment Opportunities</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-x-4">
        <select 
          className="px-3 py-2 border rounded-md"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="hotel">Hotel</option>
          <option value="resort">Resort</option>
          <option value="villa">Villa</option>
        </select>
        <select 
          className="px-3 py-2 border rounded-md"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="all">All Locations</option>
          <option value="sicily">Sicily</option>
          <option value="rome">Rome</option>
          <option value="alps">Alps</option>
        </select>
        <input
          type="text"
          placeholder="Search opportunities..."
          className="px-3 py-2 border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Matching Opportunities"
          description={
            opportunities.length > 0
              ? "No opportunities match your current filters. Try adjusting your search criteria."
              : "There are currently no active investment opportunities. Check back soon for new opportunities."
          }
          showExploreButton={false}
        />
      )}
    </div>
  );
}