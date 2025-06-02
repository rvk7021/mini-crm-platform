import React, { useState, useMemo } from 'react';
import {
    Search, Users, Calendar, ChevronLeft, ChevronRight,
    Download, MoreVertical, Mail, Phone, Tag,
    ShoppingBag, Clock, User
} from 'lucide-react';

export default function ViewSegment({ segment, id, onBack }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading,] = useState();
    const [error,] = useState(null);


    const customersPerPage = 10;
    const customers = useMemo(() => segment?.customers || [], [segment]);

    console.log('Customers data:', customers);
    console.log('Customers length:', customers.length);

    const filteredCustomers = useMemo(() =>
        customers.filter(customer =>
            customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [searchTerm, customers]
    );

    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
    const startIndex = (currentPage - 1) * customersPerPage;
    const currentCustomers = filteredCustomers.slice(startIndex, startIndex + customersPerPage);

    const getCategoryColor = (category) => {
        const colors = {
            'Electronics': 'bg-blue-100 text-blue-800 border-blue-200',
            'electronics': 'bg-blue-100 text-blue-800 border-blue-200',
            'Clothing': 'bg-purple-100 text-purple-800 border-purple-200',
            'Books': 'bg-green-100 text-green-800 border-green-200',
            'Grocery': 'bg-orange-100 text-orange-800 border-orange-200',
            'Beauty': 'bg-pink-100 text-pink-800 border-pink-200',
            'Fitness': 'bg-red-100 text-red-800 border-red-200',
            'Home Decor': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'Jewelry': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Toys': 'bg-cyan-100 text-cyan-800 border-cyan-200'
        };
        return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getChannelIcon = (channel) => {
        switch (channel?.toLowerCase()) {
            case 'email': return <Mail size={14} />;
            case 'sms': return <Phone size={14} />;
            case 'whatsapp': return <Phone size={14} />;
            case 'phone': return <Phone size={14} />;
            case 'push': return <Tag size={14} />;
            default: return <Mail size={14} />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] || '?'}${lastName?.[0] || ''}`;
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading segment data...</p>
                    <p className="text-sm text-gray-400 mt-2">Debug: ID={id}, segment={!!segment}</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <h3 className="font-bold">Error Loading Segment</h3>
                        <p className="mt-2">{error}</p>
                        <div className="mt-2 text-sm">
                            <p>Debug info:</p>
                            <p>ID: {id}</p>
                            <p>segment provided: {!!segment ? 'Yes' : 'No'}</p>
                            <p>Base URL: {process.env.REACT_APP_BASE_URL || 'Not set'}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            console.log('Current state:', { segment, loading, error, id });
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Debug Log
                    </button>
                </div>
            </div>
        );
    }

    if (!segment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">No segment data available</p>
                    <div className="text-sm text-gray-400">
                        <p>Debug info:</p>
                        <p>ID: {id}</p>
                        <p>segment: {segment ? 'Provided' : 'Not provided'}</p>
                        <p>Loading: {loading ? 'Yes' : 'No'}</p>
                        <p>Error: {error || 'None'}</p>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <ChevronLeft size={18} />
                                <span className="hidden sm:inline">Back to Segments</span>
                                <span className="sm:hidden">Back</span>
                            </button>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">View Segment</h1>
                                <p className="text-sm text-gray-500 hidden sm:block">Detailed segment analysis and customer overview</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Download size={20} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Segment Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                            <div className="flex-1">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                    {segment.name || 'Untitled Segment'}
                                </h2>
                                <p className="text-gray-600 text-base leading-relaxed">
                                    {segment.description || 'No description available'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg border border-blue-200">
                                <Users size={20} />
                                <span className="font-semibold">{customers.length} customers</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Users size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-gray-900">{customers.length}</p>
                                    <p className="text-sm text-gray-600">Total Customers</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                                <div className="p-2 bg-green-600 rounded-lg">
                                    <Calendar size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-gray-900">
                                        {formatDate(segment.createdAt)}
                                    </p>
                                    <p className="text-sm text-gray-600">Date Created</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100 sm:col-span-2 lg:col-span-1">
                                <div className="p-2 bg-purple-600 rounded-lg">
                                    <User size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-gray-900">
                                        {segment.createdBy?.username || 'Unknown'}
                                    </p>
                                    <p className="text-sm text-gray-600">Created By</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customers Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 sm:p-8 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Customers</h3>
                                <p className="text-sm text-gray-500 mt-1">{filteredCustomers.length} total customers in this segment</p>
                            </div>
                            <div className="relative">
                                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search customers..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferences</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentCustomers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {getInitials(customer.firstName, customer.lastName)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {customer.firstName} {customer.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">ID: {customer._id.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-900">{customer.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-600">{customer.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <ShoppingBag size={16} className="text-green-600" />
                                                <span className="text-lg font-bold text-green-600">
                                                    ${customer.totalSpent?.toFixed(2) || '0.00'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {formatDate(customer.lastOrder)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                {customer.preferredCategory && (
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(customer.preferredCategory)}`}>
                                                        {customer.preferredCategory}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    {getChannelIcon(customer.preferredChannel)}
                                                    <span className="text-xs text-gray-600">
                                                        {customer.preferredChannel} • {customer.preferredDay}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden">
                        {currentCustomers.map((customer) => (
                            <div key={customer._id} className="p-4 border-b border-gray-200 last:border-b-0">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-semibold">
                                            {getInitials(customer.firstName, customer.lastName)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900 truncate">
                                                    {customer.firstName} {customer.lastName}
                                                </h4>
                                                <p className="text-sm text-gray-600 truncate">{customer.email}</p>
                                                <p className="text-sm text-gray-500">{customer.phone}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-green-600">
                                                    ${customer.totalSpent?.toFixed(2) || '0.00'}
                                                </p>
                                                <p className="text-xs text-gray-500">Total spent</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {customer.preferredCategory && (
                                                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(customer.preferredCategory)}`}>
                                                    {customer.preferredCategory}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                                                {getChannelIcon(customer.preferredChannel)}
                                                {customer.preferredChannel}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            Last order: {formatDate(customer.lastOrder)} • Prefers {customer.preferredDay}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="text-sm text-gray-600 text-center sm:text-left">
                                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(startIndex + customersPerPage, filteredCustomers.length)}</span> of{' '}
                                    <span className="font-medium">{filteredCustomers.length}</span> customers
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                        <span className="hidden sm:inline">Previous</span>
                                    </button>
                                    <div className="flex items-center gap-1">
                                        <span className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg">
                                            {currentPage}
                                        </span>
                                        <span className="text-sm text-gray-500">of {totalPages}</span>
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredCustomers.length === 0 && (
                        <div className="text-center py-12">
                            <Users size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                            <p className="text-gray-500">
                                {searchTerm ? 'Try adjusting your search terms.' : 'This segment doesn\'t have any customers yet.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}