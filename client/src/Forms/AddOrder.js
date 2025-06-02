import React, { useState } from 'react';

export const AddOrder = () => {
    const [formData, setFormData] = useState({
        identifier: '',
        amount: '',
        items: '',
        channel: ''
    });
    const [identifierType, setIdentifierType] = useState('email');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleIdentifierTypeChange = (type) => {
        setIdentifierType(type);
        setFormData(prev => ({ ...prev, identifier: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        if (!formData.identifier) {
            setMessage({ text: 'Please provide either email or phone number', type: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            const orderData = {
                identifierType,
                identifier: formData.identifier,
                amount: parseFloat(formData.amount),
                items: formData.items.split(',').map(item => item.trim()).filter(Boolean),
                channel: formData.channel
            };

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/customer/add/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add order');
            }

            setMessage({ text: 'Order added successfully!', type: 'success' });
            setFormData({ identifier: '', amount: '', items: '', channel: '' });
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Add New Order</h2>

            {message.text && (
                <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <div className="flex mb-2">
                        <button
                            type="button"
                            onClick={() => handleIdentifierTypeChange('email')}
                            className={`flex-1 py-2 px-4 ${identifierType === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-l-md`}
                        >
                            Email
                        </button>
                        <button
                            type="button"
                            onClick={() => handleIdentifierTypeChange('phone')}
                            className={`flex-1 py-2 px-4 ${identifierType === 'phone' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-r-md`}
                        >
                            Phone
                        </button>
                    </div>

                    <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                        {identifierType === 'email' ? 'Customer Email *' : 'Customer Phone *'}
                    </label>
                    <input
                        type={identifierType === 'email' ? 'email' : 'tel'}
                        id="identifier"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={identifierType === 'email' ? 'customer@example.com' : '+1234567890'}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Order Amount *</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="items" className="block text-sm font-medium text-gray-700 mb-1">Items (comma separated) *</label>
                    <input
                        type="text"
                        id="items"
                        name="items"
                        value={formData.items}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Item 1, Item 2, Item 3"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="channel" className="block text-sm font-medium text-gray-700 mb-1">Order Channel</label>
                    <input
                        type="text"
                        id="channel"
                        name="channel"
                        value={formData.channel}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Online, In-store, etc."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isLoading ? 'Adding Order...' : 'Add Order'}
                </button>
            </form>
        </div>
    );
};
