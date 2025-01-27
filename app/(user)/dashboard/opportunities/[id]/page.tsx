export default function UserOpportunityDetailsPage() {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Luxury Beach Resort</h1>
          <p className="text-gray-500 mt-1">Sicily, Italy</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          Submit Proposal
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images and Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-96 bg-gray-100"></div>
            <div className="p-4 flex space-x-4">
              <div className="h-20 w-20 bg-gray-100 rounded"></div>
              <div className="h-20 w-20 bg-gray-100 rounded"></div>
              <div className="h-20 w-20 bg-gray-100 rounded"></div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">About this Property</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
            <div className="space-y-2">
              <h3 className="font-medium">Key Features:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Beachfront location</li>
                <li>50 luxury rooms</li>
                <li>Restaurant and spa facilities</li>
                <li>Private beach access</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Investment Details */}
        <div className="space-y-6">
          {/* Investment Summary */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Investment Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Investment Range</span>
                <span className="font-medium">€2M - €5M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium">Resort</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium">Available</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Expected ROI</span>
                <span className="font-medium">12-15%</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Location</h2>
            <div className="h-48 bg-gray-100 rounded"></div>
            <p className="text-gray-600">
              Located in the heart of Sicily&apos;s coastline, offering stunning views
              and easy access to local attractions.
            </p>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Documents</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Financial Projections.pdf</span>
                <button className="text-primary">Download</button>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Property Details.pdf</span>
                <button className="text-primary">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 