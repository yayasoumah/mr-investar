import { OpportunityForm } from "../components/opportunity-form";

export default function CreateOpportunityPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Opportunity</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <OpportunityForm />
      </div>
    </div>
  );
} 