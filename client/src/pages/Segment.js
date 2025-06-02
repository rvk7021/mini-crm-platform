import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Eye, Trash2, Users, TrendingUp, ShoppingBag, Mail, Phone, Calendar, Target, ChevronLeft, ChevronRight
} from 'lucide-react';
import CreateSegment from '../components/CreateSegment';


function ViewSegment({ segment, onBack }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSegment, setCurrentSegment] = useState(null);

  const customersPerPage = 10;

  useEffect(() => {
    if (segment) {
      setCurrentSegment(segment);
    }
  }, [segment]);

  // Early loading state
  if (!currentSegment || !currentSegment.customers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-gray-600">Loading segment data...</p>
        </div>
      </div>
    );
  }

  const segmentName = currentSegment.name || 'Unnamed Segment';
  const segmentDescription = currentSegment.description || 'No description provided';
  const createdAt = currentSegment?.createdAt ? new Date(currentSegment.createdAt) : new Date();
  const createdBy = currentSegment.createdBy || 'Unknown';
  const customers = currentSegment.customers || [];

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c?.totalSpent || 0), 0);
  const activeCustomers = customers.filter(c => (c?.totalSpent || 0) > 0).length;

  const filteredCustomers = customers.filter(c => {
    const firstName = c?.firstName || '';
    const lastName = c?.lastName || '';
    const email = c?.email || '';
    const fullName = c?.fullName || '';
    return (
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + customersPerPage);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

  const formatDate = (dateString) => {
    if (!dateString) return 'No orders';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getCategoryColor = (category) => {
    if (!category) return 'bg-gray-100 text-gray-600';
    const colors = {
      electronics: 'bg-blue-100 text-blue-700',
      clothing: 'bg-purple-100 text-purple-700',
      books: 'bg-green-100 text-green-700',
      home: 'bg-orange-100 text-orange-700',
      'home decor': 'bg-orange-100 text-orange-700',
      grocery: 'bg-yellow-100 text-yellow-700',
      beauty: 'bg-pink-100 text-pink-700',
      fitness: 'bg-red-100 text-red-700',
      jewelry: 'bg-indigo-100 text-indigo-700',
      toys: 'bg-cyan-100 text-cyan-700',
    };
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">Segment Overview</h1>
            </div>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Segment Info & Metrics */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Segment Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold text-gray-900 truncate">{segmentName}</h2>
                <p className="text-sm text-gray-500 mt-1">{segmentDescription}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Created by <span className="font-medium text-gray-700">{createdBy}</span></div>
                  <div>{formatDate(createdAt)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-semibold text-gray-900">{totalCustomers.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Total Customers</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRevenue)}</div>
                <div className="text-xs text-gray-500 mt-1">Total Revenue</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2">
                  <ShoppingBag className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-semibold text-gray-900">{activeCustomers.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Active Customers</div>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mx-auto mb-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-sm font-semibold text-gray-900">{formatDate(createdAt)}</div>
                <div className="text-xs text-gray-500 mt-1">Created</div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Directory */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Directory Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Customer Directory</h3>
                <span className="text-sm text-gray-500">({filteredCustomers.length})</span>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Customer List */}
          <div className="divide-y divide-gray-200">
            {filteredCustomers.length > 0 ? (
              currentCustomers.map((c, idx) => {
                const firstName = c?.firstName || c?.fullName?.split(' ')[0] || 'Unknown';
                const lastName = c?.lastName || c?.fullName?.split(' ').slice(1).join(' ') || '';
                const email = c?.email || 'No email';
                const phone = c?.phone || 'No phone';
                const totalSpent = c?.totalSpent || 0;
                const lastOrder = c?.lastOrder;
                const preferredCategory = c?.preferredCategory || null;

                return (
                  <div key={c?._id || idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      {/* Customer Info */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center font-medium text-sm flex-shrink-0">
                          {(firstName[0] || '') + (lastName[0] || '') || 'C'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-medium text-gray-900 truncate">
                              {firstName} {lastName}
                            </p>
                            {preferredCategory && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(preferredCategory)}`}>
                                {preferredCategory}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1 truncate">
                              <Mail size={12} />
                              {email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={12} />
                              {phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Stats */}
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-lg font-semibold text-green-600">
                          {formatCurrency(totalSpent)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(lastOrder)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No customers match your search.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">

              <div className="flex items-center justify-between">
                <div className="bg-gray-50 px-4 lg:px-6 py-3 text-sm text-gray-500 text-center border-t border-gray-200">
                  Showing {startIndex + 1} to {Math.min(startIndex + customersPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <span className="text-sm font-medium text-gray-900 px-3">
                    {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SegmentPage() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'view'
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [segments, setSegments] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const segmentsPerPage = 6;

  useEffect(() => {
    const fetchSegments = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/segment/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          console.error('Failed to fetch segments');
          return;
        }

        const data = await response.json();

        if (data.success) {
          const transformedSegments = data.data.map(segment => ({
            ...segment,
            createdBy: segment.createdBy?.username || 'Unknown',
            totalCustomers: segment.customers?.length || 0,
            // Keep original customer data structure for ViewSegment
            customers: segment.customers || []
          }));

          setSegments(transformedSegments);
        } else {
          console.error('Error fetching segments:', data.message);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchSegments();
  }, []);

  const handleDeleteSegment = async (segmentId) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/segment/${segmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        console.error('Failed to delete segment');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSegments(prevSegments => prevSegments.filter(segment => segment._id !== segmentId));
        console.log('Segment deleted successfully');
      } else {
        console.error('Error deleting segment:', data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleViewSegment = (segment) => {
    setSelectedSegment(segment);
    setCurrentView('view');
  };

  const filteredSegments = (segments || []).filter(segment =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    segment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSegments.length / segmentsPerPage);
  const startIndex = (currentPage - 1) * segmentsPerPage;
  const currentSegments = filteredSegments.slice(startIndex, startIndex + segmentsPerPage);

  if (currentView === 'create') {
    return <CreateSegment onBack={() => setCurrentView('list')} />;
  }

  if (currentView === 'view' && selectedSegment) {
    return <ViewSegment segment={selectedSegment} onBack={() => setCurrentView('list')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Segments</h1>
              <p className="text-sm text-gray-600 mt-1">Organize and analyze your customer base</p>
            </div>
            <button
              onClick={() => setCurrentView('create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
            >
              <Plus size={18} />
              Create Segment
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        {segments && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{segments.length}</p>
                  <p className="text-sm text-gray-600">Total Segments</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {segments.reduce((sum, s) => sum + s.totalCustomers, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Segment Customers</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {segments.length > 0 ? Math.round(segments.reduce((sum, s) => sum + s.totalCustomers, 0) / segments.length) : 0}
                  </p>
                  <p className="text-sm text-gray-600">Avg per Segment</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search segments..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>{filteredSegments.length} segments found</span>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Segments Grid */}
        {segments === null ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentSegments.map((segment) => (
              <div key={segment._id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group">
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {segment.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {segment.totalCustomers} customers
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleViewSegment(segment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Segment"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSegment(segment._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Segment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {segment.description.length > 100
                      ? `${segment.description.substring(0, 100)}...`
                      : segment.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(segment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      <span>{segment.createdBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg border border-gray-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(startIndex + segmentsPerPage, filteredSegments.length)}</span> of{' '}
                <span className="font-medium">{filteredSegments.length}</span> segments
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="px-3 py-2 text-sm font-medium text-gray-900">
                  {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {segments && filteredSegments.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No segments match your search' : 'No segments created yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm
                ? 'Try adjusting your search terms or clear the search to see all segments.'
                : 'Create your first customer segment to start organizing and analyzing your customer base.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setCurrentView('create')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                <Plus size={18} />
                Create Your First Segment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}