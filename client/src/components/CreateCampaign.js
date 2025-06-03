import { useState, useEffect } from 'react';
import { Search, Filter, Users, MessageSquare, Tag, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CreateCampaign() {
  const [segments, setSegments] = useState([]);
  const [filteredSegments, setFilteredSegments] = useState([]);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState([]);
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [customerRangeFilter, setCustomerRangeFilter] = useState('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const segmentsPerPage = 6;

  // Animation states
  const [notification, setNotification] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Mobile sidebar state
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const fetchSegment = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/campaign/segment`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch segments');
        }
        const data = await response.json();
        setSegments(data.data);
        setFilteredSegments(data.data);
      } catch (error) {
        console.error('Error fetching segments:', error);
        showNotification('Failed to load segments', 'error');
      }
    };

    fetchSegment();
  }, []);

  // Filter segments based on search and filters
  useEffect(() => {
    let filtered = segments.filter(segment =>
      segment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (customerRangeFilter !== 'all') {
      filtered = filtered.filter(segment => {
        const count = segment.customers;
        switch (customerRangeFilter) {
          case 'small': return count < 500;
          case 'medium': return count >= 500 && count < 1500;
          case 'large': return count >= 1500;
          default: return true;
        }
      });
    }

    setFilteredSegments(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [segments, searchTerm, customerRangeFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSegments.length / segmentsPerPage);
  const startIndex = (currentPage - 1) * segmentsPerPage;
  const endIndex = startIndex + segmentsPerPage;
  const currentSegments = filteredSegments.slice(startIndex, endIndex);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleSegmentSelection = (id) => {
    setSelectedSegmentIds((prev) =>
      prev.includes(id) ? prev.filter(segId => segId !== id) : [...prev, id]
    );
  };

  const handleCreateCampaign = async () => {
    if (!campaignName || !message || selectedSegmentIds.length === 0) {
      showNotification("Please fill all required fields and select at least one segment.", 'error');
      return;
    }

    setIsCreating(true);

    try {
      console.log("Creating campaign with segments:", selectedSegmentIds);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/campaign/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          name: campaignName,
          message,
          description,
          segments: selectedSegmentIds
        })
      });

      const result = await response.json();
      if (response.ok) {
        showNotification("Campaign created successfully!", 'success');
        setCampaignName('');
        setMessage('');
        setDescription('');
        setSelectedSegmentIds([]);
        setShowMobileSidebar(false); // Close mobile sidebar on success
      } else {
        showNotification(result.message || "Failed to create campaign", 'error');
      }
    } catch (err) {
      console.error("Campaign creation failed:", err);
      showNotification("Something went wrong. Please try again.", 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const getTotalCustomers = () => {
    return segments
      .filter(segment => selectedSegmentIds.includes(segment._id))
      .reduce((total, segment) => total + segment.customers, 0);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Notification Component
  const NotificationComponent = () => {
    if (!notification) return null;

    return (
      <div className={`fixed top-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-3 px-4 sm:px-6 py-4 rounded-lg shadow-lg border transform transition-all duration-500 ease-in-out ${notification.type === 'success'
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-red-50 border-red-200 text-red-800'
        } animate-slide-in`}>
        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } animate-bounce-in`}>
          {notification.type === 'success' ? (
            <Check className="w-4 h-4 text-white animate-check" />
          ) : (
            <X className="w-4 h-4 text-white" />
          )}
        </div>
        <span className="font-medium text-sm sm:text-base">{notification.message}</span>
      </div>
    );
  };

  // Campaign Summary Component (for mobile modal and desktop sidebar)
  const CampaignSummary = ({ isMobile = false }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 ${!isMobile ? 'sticky top-6' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Campaign Summary</h3>
        </div>
        {isMobile && (
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Selected Segments</span>
          <span className="font-semibold text-gray-900">{selectedSegmentIds.length}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Total Audience</span>
          <span className="font-semibold text-gray-900">{getTotalCustomers().toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${campaignName && message && selectedSegmentIds.length > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
            }`}>
            {campaignName && message && selectedSegmentIds.length > 0 ? 'Ready to Launch' : 'Incomplete'}
          </span>
        </div>
      </div>

      <button
        onClick={handleCreateCampaign}
        disabled={selectedSegmentIds.length === 0 || !campaignName || !message || isCreating}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
      >
        {isCreating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Creating...
          </>
        ) : (
          'Create Campaign'
        )}
      </button>

      {selectedSegmentIds.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Selected segments:</p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {segments
              .filter(s => selectedSegmentIds.includes(s._id))
              .map(segment => (
                <div key={segment._id} className="flex justify-between items-center text-xs">
                  <span className="text-gray-700 truncate pr-2">{segment.name}</span>
                  <span className="text-gray-500 flex-shrink-0">{segment.customers.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes checkmark {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out 0.2s both;
        }
        
        .animate-check {
          stroke-dasharray: 20;
          stroke-dashoffset: 20;
          animation: checkmark 0.6s ease-out 0.4s both;
        }
      `}</style>

      <NotificationComponent />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create New Campaign</h1>
              <p className="text-gray-600 text-sm sm:text-base">Design and launch targeted marketing campaigns</p>
            </div>
            
            {/* Mobile Summary Button */}
            <div className="xl:hidden">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
              >
                <Tag className="w-4 h-4" />
                <span>View Summary ({selectedSegmentIds.length})</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Campaign Details - Left Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Campaign Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Campaign Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter campaign name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your campaign message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Add campaign description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Segments Selection Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Select Audience Segments </h2>
                  <span className="text-sm text-gray-500 ml-2">
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search segments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 flex-shrink-0">Customer Count:</label>
                    <select
                      value={customerRangeFilter}
                      onChange={(e) => setCustomerRangeFilter(e.target.value)}
                      className="w-full sm:w-auto px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Sizes</option>
                      <option value="small">Small ({'<'} 500)</option>
                      <option value="medium">Medium (500-1,500)</option>
                      <option value="large">Large ({'>'} 1,500)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Segments Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 min-h-[400px]">
                {currentSegments.map(segment => (
                  <div
                    key={segment._id}
                    onClick={() => toggleSegmentSelection(segment._id)}
                    className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${selectedSegmentIds.includes(segment._id)
                        ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-2">{segment.name}</h3>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${selectedSegmentIds.includes(segment._id) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                        {selectedSegmentIds.includes(segment._id) && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs">{segment.customers.toLocaleString()} customers</span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredSegments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm sm:text-base">No segments found matching your criteria</p>
                </div>
              )}

              {/* Pagination */}
              {filteredSegments.length > 0 && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600 text-center sm:text-left">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredSegments.length)} of {filteredSegments.length} segments
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1 overflow-x-auto max-w-xs">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex-shrink-0 ${currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Summary Sidebar - Right Column */}
          <div className="xl:col-span-1 hidden xl:block">
            <CampaignSummary />
          </div>
        </div>
      </div>

      {/* Mobile Summary Modal */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileSidebar(false)} />
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-xl p-6 max-h-[90vh] overflow-y-auto">
            <CampaignSummary isMobile={true} />
          </div>
        </div>
      )}
    </div>
  );
}