import React, { useState } from 'react';
import { ChevronLeft, Filter, Sparkles, Users, Info, Search, Calendar, DollarSign, Tag, Mail, User, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-gray-800/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-white text-md font-medium">Saving segment...</p>
        </div>
    </div>
);

const Notification = ({ type, message, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = type === 'success' ? <Check size={18} /> : <X size={18} />;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-6 right-6 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50`}
        >
            {icon}
            <span className="font-medium text-sm">{message}</span>
            <button onClick={onClose} className="ml-2">
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default function CreateSegment({ onBack }) {
    const [activeTab, setActiveTab] = useState('prompt'); // 'prompt' or 'custom'
    const [segmentName, setSegmentName] = useState('');
    const [segmentDescription, setSegmentDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Prompt-based filtering
    const [promptText, setPromptText] = useState('');
    const [promptResults, setPromptResults] = useState(null);
    const [promptLoading, setPromptLoading] = useState(false);

    // Custom filtering
    const [customFilters, setCustomFilters] = useState({
        totalSpent: { operator: 'gt', value: '' },
        lastOrder: { operator: 'gte', value: '' },
        preferredCategory: '',
        preferredChannel: '',
        firstName: '',
        email: ''
    });
    const [customResults, setCustomResults] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const handlePromptFilter = async () => {
        if (!promptText.trim()) {
            showNotification('error', 'Please enter a prompt');
            return;
        }
        setPromptLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/segment/list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prompt: promptText })
            });

            const data = await response.json();
            if (data.success) {
                setPromptResults(data);
                setCurrentPage(1);
                showNotification('success', 'Filter applied successfully');
            } else {
                showNotification('error', data.message || 'Failed to apply filter');
            }
        } catch (error) {
            console.error('Error fetching prompt results:', error);
            showNotification('error', 'Error applying filter');
        } finally {
            setPromptLoading(false);
        }
    };

    const handleCustomFilter = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('You must be logged in to view customers.');
            }

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/customer/list`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch customers');
            }

            const sampleData = await response.json();
            if (!sampleData.success) {
                throw new Error(sampleData.message || 'Failed to fetch customers');
            }

            let filteredData = sampleData.data || [];

            if (customFilters.totalSpent.value) {
                const value = parseFloat(customFilters.totalSpent.value);
                const operator = customFilters.totalSpent.operator;

                filteredData = filteredData.filter(customer => {
                    const totalSpent = customer.totalSpent || 0;
                    switch (operator) {
                        case 'gt': return totalSpent > value;
                        case 'lt': return totalSpent < value;
                        case 'gte': return totalSpent >= value;
                        case 'lte': return totalSpent <= value;
                        default: return true;
                    }
                });
            }

            if (customFilters.lastOrder.value) {
                const filterDate = new Date(customFilters.lastOrder.value);
                const operator = customFilters.lastOrder.operator;

                filteredData = filteredData.filter(customer => {
                    if (!customer.lastOrder) return false;
                    const lastOrderDate = new Date(customer.lastOrder);

                    switch (operator) {
                        case 'gte': return lastOrderDate >= filterDate;
                        case 'lte': return lastOrderDate <= filterDate;
                        default: return true;
                    }
                });
            }

            if (customFilters.preferredCategory) {
                filteredData = filteredData.filter(customer =>
                    customer.preferredCategory &&
                    customer.preferredCategory.toLowerCase() === customFilters.preferredCategory.toLowerCase()
                );
            }

            if (customFilters.preferredChannel) {
                filteredData = filteredData.filter(customer =>
                    customer.preferredChannel &&
                    customer.preferredChannel.toLowerCase() === customFilters.preferredChannel.toLowerCase()
                );
            }

            if (customFilters.firstName.trim()) {
                const searchName = customFilters.firstName.toLowerCase().trim();
                filteredData = filteredData.filter(customer =>
                    customer.firstName &&
                    customer.firstName.toLowerCase().includes(searchName)
                );
            }

            if (customFilters.email.trim()) {
                const searchEmail = customFilters.email.toLowerCase().trim();
                filteredData = filteredData.filter(customer =>
                    customer.email &&
                    customer.email.toLowerCase().includes(searchEmail)
                );
            }

            setCustomResults(filteredData);
            setCurrentPage(1);
            showNotification('success', `Found ${filteredData.length} customers`);

        } catch (error) {
            console.error('Error fetching and filtering customers:', error);
            showNotification('error', 'Error fetching customers: ' + error.message);
            setCustomResults([]);
        }
    };

    const handleSaveSegment = async () => {
        if (!segmentName) {
            showNotification('error', 'Please provide a name for the segment');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/segment/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: segmentName,
                    description: segmentDescription,
                    rule: activeTab === 'prompt' ? promptResults?.filter : customFilters,
                    customers: activeTab === 'prompt'
                        ? promptResults?.data?.map(c => c._id)
                        : customResults.map(c => c._id),
                    user_id: user?._id
                })
            });

            const data = await response.json();

            if (data.success) {
                showNotification('success', 'Segment saved successfully!');
                setTimeout(() => onBack(), 1500);
            } else {
                showNotification('error', data.message || 'Failed to save segment');
            }
        } catch (error) {
            console.error('Error saving segment:', error);
            showNotification('error', 'Error saving segment');
        } finally {
            setLoading(false);
        }
    };

    const clearAllFilters = () => {
        setCustomFilters({
            totalSpent: { operator: 'gt', value: '' },
            lastOrder: { operator: 'gte', value: '' },
            preferredCategory: '',
            preferredChannel: '',
            firstName: '',
            email: ''
        });
        setCustomResults([]);
        showNotification('success', 'Filters cleared');
    };

    const hasActiveFilters = () => {
        return customFilters.totalSpent.value ||
            customFilters.lastOrder.value ||
            customFilters.preferredCategory ||
            customFilters.preferredChannel ||
            customFilters.firstName.trim() ||
            customFilters.email.trim();
    };

    const currentResults = activeTab === 'prompt' ? promptResults?.data : customResults;

    // Pagination calculations
    const totalPages = currentResults ? Math.ceil(currentResults.length / resultsPerPage) : 0;
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResultsPage = currentResults ? currentResults.slice(indexOfFirstResult, indexOfLastResult) : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 w-full">
            <AnimatePresence>
                {notification && (
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>

            {loading && <LoadingSpinner />}

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow w-fit group"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
                        <span className="font-medium text-sm">Back to Segments</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create New Segment</h1>
                        <p className="text-gray-600 mt-1 text-sm">Build targeted customer segments with AI or custom filters</p>
                    </div>
                </div>

                {/* Segment Basic Info */}
                <div className="bg-white rounded-xl shadow border border-gray-100 p-5 mb-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Segment Information</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">Segment Name</label>
                            <input
                                type="text"
                                value={segmentName}
                                onChange={(e) => setSegmentName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                                placeholder="e.g., High Value Customers"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">Description</label>
                            <input
                                type="text"
                                value={segmentDescription}
                                onChange={(e) => setSegmentDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                                placeholder="Brief description of your segment"
                            />
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50/50">
                        <nav className="flex">
                            <button
                                onClick={() => setActiveTab('prompt')}
                                className={`flex-1 py-3 px-5 font-medium text-xs transition-all duration-200 ${activeTab === 'prompt'
                                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Sparkles size={16} />
                                    <span className="hidden sm:inline">AI Prompt Filter</span>
                                    <span className="sm:hidden">AI Filter</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('custom')}
                                className={`flex-1 py-3 px-5 font-medium text-xs transition-all duration-200 ${activeTab === 'custom'
                                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Filter size={16} />
                                    <span className="hidden sm:inline">Custom Filter</span>
                                    <span className="sm:hidden">Custom</span>
                                </div>
                            </button>
                        </nav>
                    </div>

                    <div className="p-5 lg:p-6">
                        {activeTab === 'prompt' ? (
                            <div className="space-y-5">
                                {/* Prompt Info Banner */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-blue-900 font-medium text-sm">Your filtering is as good as your prompt</p>
                                            <p className="text-blue-700 text-xs mt-1">Be specific and clear about your customer criteria for better results</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Describe your customer segment
                                    </label>
                                    <textarea
                                        value={promptText}
                                        onChange={(e) => setPromptText(e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none text-sm"
                                        rows={4}
                                        placeholder="e.g., customers who spent more than $500 and ordered in the last 3 months from electronics category..."
                                    />
                                </div>

                                <button
                                    onClick={handlePromptFilter}
                                    disabled={promptLoading || !promptText.trim()}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow hover:shadow-md font-medium text-sm"
                                >
                                    {promptLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            <span>Generate Filter</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Filter Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center">
                                            <Filter className="w-3 h-3 text-blue-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Filter Criteria</h3>
                                    </div>
                                    {hasActiveFilters() && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-xs text-gray-500 hover:text-red-600 font-medium transition-colors duration-200 px-2 py-1 hover:bg-red-50 rounded-md"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>

                                {/* Filter Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Total Spent Filter */}
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-7 h-7 bg-green-100 rounded-md flex items-center justify-center">
                                                <DollarSign className="w-3 h-3 text-green-600" />
                                            </div>
                                            <h4 className="font-medium text-gray-900 text-sm">Total Spent</h4>
                                        </div>
                                        <div className="space-y-2">
                                            <select
                                                value={customFilters.totalSpent.operator}
                                                onChange={(e) => setCustomFilters(prev => ({
                                                    ...prev,
                                                    totalSpent: { ...prev.totalSpent, operator: e.target.value }
                                                }))}
                                                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 bg-white focus:bg-white transition-all duration-200 text-xs font-medium"
                                            >
                                                <option value="gt">Greater than</option>
                                                <option value="lt">Less than</option>
                                                <option value="gte">Greater or equal</option>
                                                <option value="lte">Less or equal</option>
                                            </select>
                                            <input
                                                type="number"
                                                value={customFilters.totalSpent.value}
                                                onChange={(e) => setCustomFilters(prev => ({
                                                    ...prev,
                                                    totalSpent: { ...prev.totalSpent, value: e.target.value }
                                                }))}
                                                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 bg-white focus:bg-white transition-all duration-200 text-sm"
                                                placeholder="Enter amount ($)"
                                            />
                                        </div>
                                    </div>

                                    {/* Last Order Filter */}
                                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-7 h-7 bg-purple-100 rounded-md flex items-center justify-center">
                                                <Calendar className="w-3 h-3 text-purple-600" />
                                            </div>
                                            <h4 className="font-medium text-gray-900 text-sm">Last Order Date</h4>
                                        </div>
                                        <div className="space-y-2">
                                            <select
                                                value={customFilters.lastOrder.operator}
                                                onChange={(e) => setCustomFilters(prev => ({
                                                    ...prev,
                                                    lastOrder: { ...prev.lastOrder, operator: e.target.value }
                                                }))}
                                                className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white focus:bg-white transition-all duration-200 text-xs font-medium"
                                            >
                                                <option value="gte">After</option>
                                                <option value="lte">Before</option>
                                            </select>
                                            <input
                                                type="date"
                                                value={customFilters.lastOrder.value}
                                                onChange={(e) => setCustomFilters(prev => ({
                                                    ...prev,
                                                    lastOrder: { ...prev.lastOrder, value: e.target.value }
                                                }))}
                                                className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white focus:bg-white transition-all duration-200 text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Category Filter */}
                                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-7 h-7 bg-orange-100 rounded-md flex items-center justify-center">
                                                <Tag className="w-3 h-3 text-orange-600" />
                                            </div>
                                            <h4 className="font-medium text-gray-900 text-sm">Preferred Category</h4>
                                        </div>
                                        <select
                                            value={customFilters.preferredCategory}
                                            onChange={(e) => setCustomFilters(prev => ({
                                                ...prev,
                                                preferredCategory: e.target.value
                                            }))}
                                            className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white focus:bg-white transition-all duration-200 text-xs font-medium"
                                        >
                                            <option value="">All Categories</option>
                                            <option value="electronics">Electronics</option>
                                            <option value="clothing">Clothing</option>
                                            <option value="books">Books</option>
                                            <option value="home">Home</option>
                                        </select>
                                    </div>

                                    {/* Channel Filter */}
                                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-7 h-7 bg-cyan-100 rounded-md flex items-center justify-center">
                                                <Mail className="w-3 h-3 text-cyan-600" />
                                            </div>
                                            <h4 className="font-medium text-gray-900 text-sm">Preferred Channel</h4>
                                        </div>
                                        <select
                                            value={customFilters.preferredChannel}
                                            onChange={(e) => setCustomFilters(prev => ({
                                                ...prev,
                                                preferredChannel: e.target.value
                                            }))}
                                            className="w-full px-3 py-2 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-500 bg-white focus:bg-white transition-all duration-200 text-xs font-medium"
                                        >
                                            <option value="">All Channels</option>
                                            <option value="email">Email</option>
                                            <option value="sms">SMS</option>
                                            <option value="push">Push</option>
                                        </select>
                                    </div>

                                    {/* Name Filter */}
                                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-7 h-7 bg-pink-100 rounded-md flex items-center justify-center">
                                                <User className="w-3 h-3 text-pink-600" />
                                            </div>
                                            <h4 className="font-medium text-gray-900 text-sm">First Name</h4>
                                        </div>
                                        <input
                                            type="text"
                                            value={customFilters.firstName}
                                            onChange={(e) => setCustomFilters(prev => ({
                                                ...prev,
                                                firstName: e.target.value
                                            }))}
                                            className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:bg-white transition-all duration-200 text-sm"
                                            placeholder="Search by first name"
                                        />
                                    </div>

                                    {/* Email Filter */}
                                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-7 h-7 bg-indigo-100 rounded-md flex items-center justify-center">
                                                <Mail className="w-3 h-3 text-indigo-600" />
                                            </div>
                                            <h4 className="font-medium text-gray-900 text-sm">Email Address</h4>
                                        </div>
                                        <input
                                            type="email"
                                            value={customFilters.email}
                                            onChange={(e) => setCustomFilters(prev => ({
                                                ...prev,
                                                email: e.target.value
                                            }))}
                                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white focus:bg-white transition-all duration-200 text-sm"
                                            placeholder="Search by email"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                                    <button
                                        onClick={handleCustomFilter}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow hover:shadow-md font-medium text-sm"
                                    >
                                        <Search size={16} />
                                        <span>Apply Filters</span>
                                    </button>

                                    {hasActiveFilters() && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium text-sm"
                                        >
                                            <span>Clear Filters</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {currentResults && currentResults.length > 0 && (
                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Filtered Customers
                                        </h3>
                                        <p className="text-gray-600 text-xs mt-1">
                                            {currentResults.length} customers match your criteria
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleSaveSegment}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow hover:shadow-md font-medium text-sm"
                                    >
                                        <Users size={16} />
                                        <span>Save Segment</span>
                                    </button>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[600px]">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Spent</th>
                                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Order</th>
                                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {currentResultsPage.map((customer) => (
                                                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors duration-150">
                                                        <td className="px-3 py-3 text-xs font-medium text-gray-900">
                                                            {customer.firstName} {customer.lastName}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600">{customer.email}</td>
                                                        <td className="px-3 py-3 text-xs font-semibold text-green-600">
                                                            ${customer.totalSpent}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600">
                                                            {new Date(customer.lastOrder).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs">
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                                {customer.preferredCategory}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {currentResults.length > resultsPerPage && (
                                        <div>
                                            <div className="bg-gray-50 px-3 py-2 text-xs text-gray-500 text-center border-t border-gray-200">
                                                Showing {indexOfFirstResult + 1}-{Math.min(indexOfLastResult, currentResults.length)} of {currentResults.length} customers
                                            </div>
                                            <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-t border-gray-200">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={currentPage === 1}
                                                        className="px-2 py-1 border border-gray-300 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Previous
                                                    </button>
                                                    <span className="text-xs text-gray-700 px-2">
                                                        Page {currentPage} of {totalPages}
                                                    </span>
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                        disabled={currentPage === totalPages}
                                                        className="px-2 py-1 border border-gray-300 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}