import { Users, TrendingUp, Calendar, Phone, Mail, ShoppingBag, X } from 'lucide-react';
export default function ViewProfile({ customer, onClose }) {
    if (!customer) return null;

    const totalSpent = customer.totalSpent || customer.orders?.reduce((acc, order) => acc + (order.amount || 0), 0) || 0;
    const avgSpend = customer.orders?.length > 0 ? totalSpent / customer.orders.length : 0;
    const lastOrderDate = customer.lastOrder || (customer.orders?.length > 0 ? customer.orders[customer.orders.length - 1]?.date : null);

    const formatCurrency = (amount) =>
        amount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00';

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
                {/* Fixed Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md flex items-center justify-center transition-all duration-200 border border-gray-200"
                >
                    <X className="w-4 h-4 text-gray-600" />
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[90vh]">
                    {/* Header */}
                    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 border-b">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {customer.firstName} {customer.lastName}
                                </h2>
                                <p className="text-gray-600 text-lg mt-1">{customer.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white p-6 rounded-lg border shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp className="w-6 h-6 text-green-500" />
                                </div>
                                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg border shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <ShoppingBag className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-sm text-gray-600 mb-1">Average Order</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgSpend)}</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg border shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <Users className="w-6 h-6 text-purple-500" />
                                </div>
                                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{customer.orders?.length || 0}</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg border shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <Calendar className="w-6 h-6 text-orange-500" />
                                </div>
                                <p className="text-sm text-gray-600 mb-1">Last Order</p>
                                <p className="text-lg font-bold text-gray-900">{formatDate(lastOrderDate)}</p>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Contact Information */}
                            <div className="bg-white p-6 rounded-lg border shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Phone className="w-5 h-5 mr-2 text-gray-500" />
                                    Contact
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                                        <span className="text-gray-700">{customer.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                                        <span className="text-gray-700">{customer.phone || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="bg-white p-6 rounded-lg border shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Preferred Day</span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                                            {customer.preferredDay || 'Not set'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Channel</span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                                            {customer.preferredChannel || 'Not set'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Category</span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                                            {customer.preferredCategory || 'Not set'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order History */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <ShoppingBag className="w-5 h-5 mr-2 text-gray-500" />
                                Order History
                            </h3>
                            {customer.orders?.length > 0 ? (
                                <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Amount
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Items
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {customer.orders.map((order, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatDate(order.date)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                            {formatCurrency(order.amount)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">
                                                            <div className="flex flex-wrap gap-1">
                                                                {order.items?.map((item, itemIdx) => (
                                                                    <span key={itemIdx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                                        {item}
                                                                    </span>
                                                                )) || 'No items'}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
                                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No orders found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}