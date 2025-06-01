'use client';
import React, { useState } from 'react';

export default function AddCustomer() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredCategory: '',
    preferredDay: '',
    preferredChannel: '',
    orders: []
  });

  const [, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOrderSection, setShowOrderSection] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const token = localStorage.getItem('authToken');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleOrderChange = (index, e) => {
    const updatedOrders = [...formData.orders];
    updatedOrders[index] = {
      ...updatedOrders[index],
      [e.target.name]: e.target.value
    };
    setFormData((prev) => ({
      ...prev,
      orders: updatedOrders
    }));
  };

  const addOrder = () => {
    if (!showOrderSection) {
      setShowOrderSection(true);
    }
    setFormData((prev) => ({
      ...prev,
      orders: [...prev.orders, { amount: '', date: '', items: '', channel: '' }]
    }));
  };

  const removeOrder = (index) => {
    const updatedOrders = formData.orders.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      orders: updatedOrders
    }));

    if (updatedOrders.length === 0) {
      setShowOrderSection(false);
    }
  };

  const closeOrderSection = () => {
    setFormData((prev) => ({
      ...prev,
      orders: []
    }));
    setShowOrderSection(false);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      preferredCategory: '',
      preferredDay: '',
      preferredChannel: '',
      orders: []
    });
    setShowOrderSection(false);
    setResponseData(null);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ show: false, type: '', message: '' });

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setResponseData(data);

      if (res.ok && data.success) {
        showNotification('success', data.message || 'Customer added successfully!');
        resetForm();
      } else {
        showNotification('error', data.message || 'Failed to add customer. Please try again.');
      }
    } catch (error) {
      console.error('API request failed:', error);
      showNotification('error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white'>
      {/* Animated Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-md w-full transform transition-all duration-500 ease-in-out ${notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}>
          <div className={`rounded-lg shadow-lg p-4 border-l-4 ${notification.type === 'success'
              ? 'bg-green-50 border-green-400 text-green-800'
              : 'bg-red-50 border-red-400 text-red-800'
            }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setNotification({ show: false, type: '', message: '' })}
                  className={`inline-flex rounded-md p-1.5 ${notification.type === 'success'
                      ? 'text-green-500 hover:bg-green-100'
                      : 'text-red-500 hover:bg-red-100'
                    } focus:outline-none`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='container mx-auto px-4 py-8 max-w-4xl'>


        {/* Main Form */}
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4'>
            <h2 className='text-xl font-semibold text-white'>Customer Information</h2>
          </div>

          <form onSubmit={handleSubmit} className='p-6 space-y-6'>
            {/* Customer Details Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {[
                ['First Name', 'firstName', true],
                ['Last Name', 'lastName', true],
                ['Email', 'email', true],
                ['Phone', 'phone', true],
                ['Preferred Category', 'preferredCategory', false],
                ['Preferred Day', 'preferredDay', false],
                ['Preferred Channel', 'preferredChannel', false]
              ].map(([label, name, required]) => (
                <div key={name} className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    {label} {required && <span className='text-red-500'>*</span>}
                  </label>
                  <input
                    type={name === 'email' ? 'email' : 'text'}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
                    required={required}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            {/* Orders Section Toggle */}
            <div className='border-t pt-6'>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
                <h3 className='text-lg font-semibold text-gray-800'>Order History</h3>
                <div className='flex gap-2'>
                  <button
                    type='button'
                    onClick={addOrder}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                    </svg>
                    Add Order
                  </button>
                  {showOrderSection && (
                    <button
                      type='button'
                      onClick={closeOrderSection}
                      className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                      Close Orders
                    </button>
                  )}
                </div>
              </div>

              {/* Orders List */}
              {showOrderSection && (
                <div className='space-y-4'>
                  {formData.orders.map((order, index) => (
                    <div key={index} className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                      <div className='flex justify-between items-center mb-4'>
                        <h4 className='font-medium text-gray-800'>Order #{index + 1}</h4>
                        {formData.orders.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeOrder(index)}
                            className='text-red-500 hover:text-red-700 transition-colors duration-200 p-1'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        <div className='space-y-2'>
                          <label className='block text-sm font-medium text-gray-700'>
                            Amount <span className='text-red-500'>*</span>
                          </label>
                          <div className='relative'>
                            <span className='absolute left-3 top-3 text-gray-500'>$</span>
                            <input
                              type='number'
                              name='amount'
                              value={order.amount}
                              onChange={(e) => handleOrderChange(index, e)}
                              className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
                              required
                              placeholder='0.00'
                              step='0.01'
                            />
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <label className='block text-sm font-medium text-gray-700'>
                            Date <span className='text-red-500'>*</span>
                          </label>
                          <input
                            type='date'
                            name='date'
                            value={order.date}
                            onChange={(e) => handleOrderChange(index, e)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
                            required
                          />
                        </div>

                        <div className='space-y-2'>
                          <label className='block text-sm font-medium text-gray-700'>Items</label>
                          <input
                            type='text'
                            name='items'
                            placeholder='e.g., Shoes, T-shirt'
                            value={order.items}
                            onChange={(e) => handleOrderChange(index, e)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
                          />
                        </div>

                        <div className='space-y-2'>
                          <label className='block text-sm font-medium text-gray-700'>Channel</label>
                          <select
                            name='channel'
                            value={order.channel}
                            onChange={(e) => handleOrderChange(index, e)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white'
                          >
                            <option value=''>Select Channel</option>
                            <option value='Online'>Online</option>
                            <option value='In-Store'>In-Store</option>
                            <option value='WhatsApp'>WhatsApp</option>
                            <option value='Phone'>Phone</option>
                            <option value='Other'>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className='flex justify-end pt-6 border-t'>
              <button
                type='submit'
                disabled={isLoading}
                className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2 min-w-[140px] justify-center'
              >
                {isLoading ? (
                  <>
                    <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                    Submit Customer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}