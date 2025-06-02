import React, { useState, useEffect } from 'react';
import {
    Search, Users, Calendar, ChevronLeft, ChevronRight, TrendingUp, Mail, Phone, ShoppingBag
} from 'lucide-react';

export default function ViewSegment({ segment, onBack }) {
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-600 text-lg">Loading segment data...</p>
                </div>
            </div>
        );
    }

    const segmentName = currentSegment.name || 'Unnamed Segment';
    const segmentDescription = currentSegment.description || 'No description provided';
    const createdAt = currentSegment?.createdAt ? new Date(currentSegment.createdAt) : new Date();
    const createdBy = currentSegment.createdBy || 'Unknown';
    const customers = Array.isArray(currentSegment.customers) ? currentSegment.customers : [];

    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, c) => sum + (c?.totalSpent || 0), 0);
    const activeCustomers = customers.filter(c => (c?.totalSpent || 0) > 0).length;

    const filteredCustomers = customers.filter(c => {
        const firstName = c?.firstName || '';
        const lastName = c?.lastName || '';
        const email = c?.email || '';
        return (
            firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        if (!category) return 'bg-slate-100 text-slate-700 ring-slate-200';
        const colors = {
            electronics: 'bg-blue-50 text-blue-700 ring-blue-200',
            clothing: 'bg-purple-50 text-purple-700 ring-purple-200',
            books: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
            home: 'bg-orange-50 text-orange-700 ring-orange-200',
            'home decor': 'bg-orange-50 text-orange-700 ring-orange-200',
            grocery: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
            beauty: 'bg-pink-50 text-pink-700 ring-pink-200',
            fitness: 'bg-red-50 text-red-700 ring-red-200',
            jewelry: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
            toys: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
        };
        return colors[category.toLowerCase()] || 'bg-slate-100 text-slate-700 ring-slate-200';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white/80 sticky top-0 z-10 border-b shadow-sm backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm bg-white border border-slate-300 px-4 py-2 rounded-xl hover:bg-slate-100 transition"
                    >
                        <ChevronLeft size={18} /> Back
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Segment Overview</h1>
                        <p className="text-sm text-slate-500">Customer insights and analysis</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Summary */}
                <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">{segmentName}</h2>
                            <p className="text-slate-500">{segmentDescription}</p>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                            <p>Created by: <strong>{createdBy}</strong></p>
                            <p>Created at: {formatDate(createdAt)}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <MetricCard icon={<Users />} label="Total Customers" value={totalCustomers} color="blue" />
                        <MetricCard icon={<TrendingUp />} label="Total Revenue" value={formatCurrency(totalRevenue)} color="emerald" />
                        <MetricCard icon={<ShoppingBag />} label="Active Customers" value={activeCustomers} color="purple" />
                        <MetricCard icon={<Calendar />} label="Created" value={formatDate(createdAt)} color="orange" />
                    </div>
                </div>

                {/* Customer Directory */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Users className="text-blue-600" /> Customer Directory
                        </h3>
                        <div className="relative w-full max-w-md">
                            <Search className="absolute top-3 left-3 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search customers..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm"
                            />
                        </div>
                    </div>

                    {filteredCustomers.length > 0 ? (
                        <div className="space-y-4">
                            {currentCustomers.map((c, idx) => (
                                <div key={c?._id || idx} className="p-4 bg-slate-50 rounded-xl border hover:shadow transition">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                                                {(c?.firstName?.[0] || '') + (c?.lastName?.[0] || '') || 'C'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">
                                                    {c?.firstName || 'Unknown'} {c?.lastName || ''}
                                                </p>
                                                <div className="text-sm text-slate-500 flex flex-col sm:flex-row gap-2">
                                                    <span className="flex items-center gap-1"><Mail size={14} /> {c?.email || 'No email'}</span>
                                                    <span className="flex items-center gap-1"><Phone size={14} /> {c?.phone || 'No phone'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-1 text-sm">
                                            <p className="text-emerald-600 font-semibold">{formatCurrency(c?.totalSpent)}</p>
                                            <p>{formatDate(c?.lastOrder)}</p>
                                            {c?.preferredCategory ? (
                                                <span className={`inline-block px-3 py-1 text-xs rounded-full ring-1 ${getCategoryColor(c.preferredCategory)}`}>
                                                    {c.preferredCategory}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">No category</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">No customers match your search.</div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-center items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm font-semibold">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Reusable metric card component
function MetricCard({ icon, label, value, color }) {
    return (
        <div className={`rounded-xl p-4 border border-${color}-200 bg-${color}-50`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 bg-${color}-500 rounded-xl text-white`}>{icon}</div>
                <div>
                    <p className={`text-${color}-900 text-lg font-bold`}>{value}</p>
                    <p className={`text-${color}-600 text-sm`}>{label}</p>
                </div>
            </div>
        </div>
    );
}
