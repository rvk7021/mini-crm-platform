import { useState, useEffect } from "react";
import { 
   XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  ScatterChart, Scatter
} from "recharts";
import { 
  Users, DollarSign, ShoppingCart, TrendingUp, RefreshCw
} from "lucide-react";

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);



  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
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
        setCustomers(sampleData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const refreshData = async () => {
    setRefreshing(true);
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
      setCustomers(sampleData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  // Analytics calculations
  const analytics = {
    totalCustomers: customers.length,
    totalRevenue: customers.reduce((sum, customer) => sum + customer.totalSpent, 0),
    averageOrderValue: customers.length > 0 
      ? customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / customers.length 
      : 0,
    activeCustomers: customers.filter(customer => customer.orders.length > 0).length
  };

  // Monthly revenue trend
  const monthlyRevenue = customers.reduce((acc, customer) => {
    customer.orders.forEach(order => {
      const date = new Date(order.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthYear] = (acc[monthYear] || 0) + order.amount;
    });
    return acc;
  }, {});

  const revenueData = Object.entries(monthlyRevenue)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({
      month: month,
      revenue: Math.round(revenue * 100) / 100
    }));

  // Customer spending distribution
  const spendingRanges = [
    { range: '$0', count: customers.filter(c => c.totalSpent === 0).length },
    { range: '$1-$100', count: customers.filter(c => c.totalSpent > 0 && c.totalSpent <= 100).length },
    { range: '$101-$500', count: customers.filter(c => c.totalSpent > 100 && c.totalSpent <= 500).length },
    { range: '$501-$1000', count: customers.filter(c => c.totalSpent > 500 && c.totalSpent <= 1000).length },
    { range: '$1000+', count: customers.filter(c => c.totalSpent > 1000).length }
  ];

  // Preferred categories
  const categoryData = customers.reduce((acc, customer) => {
    const category = customer.preferredCategory || 'Unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / customers.length) * 100)
  }));

  // Communication preferences
  const channelData = customers.reduce((acc, customer) => {
    const channel = customer.preferredChannel || 'Unknown';
    acc[channel] = (acc[channel] || 0) + 1;
    return acc;
  }, {});

  const channelChartData = Object.entries(channelData).map(([channel, count]) => ({
    channel,
    count
  }));

  // Customer lifetime value vs order frequency
  const customerScatterData = customers.map(customer => ({
    name: `${customer.firstName} ${customer.lastName}`,
    totalSpent: customer.totalSpent,
    orderCount: customer.orders.length,
    avgOrderValue: customer.orders.length > 0 ? customer.totalSpent / customer.orders.length : 0
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into your customer base and revenue trends</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${analytics.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">${analytics.averageOrderValue.toFixed(2)}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeCustomers}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Spending Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Spending Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spendingRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Preferences */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Communication Channels */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Preferences</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="channel" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Value Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Value vs Order Frequency</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={customerScatterData}>
              <CartesianGrid />
              <XAxis dataKey="orderCount" name="Order Count" />
              <YAxis dataKey="totalSpent" name="Total Spent" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name) => [
                  name === 'totalSpent' ? `$${value}` : value,
                  name === 'totalSpent' ? 'Total Spent' : 'Order Count'
                ]}
              />
              <Scatter name="Customers" dataKey="totalSpent" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Advanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Customer Retention Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Retention Rate</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Customers</span>
                <span className="text-sm font-semibold text-blue-600">
                  {customers.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Returning Customers</span>
                <span className="text-sm font-semibold text-green-600">
                  {customers.filter(c => c.orders.length > 1).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retention Rate</span>
                <span className="text-lg font-bold text-purple-600">
                  {customers.length > 0 ? Math.round((customers.filter(c => c.orders.length > 1).length / customers.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Order Frequency Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Frequency Insights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Orders per Customer</span>
                <span className="text-lg font-bold text-indigo-600">
                  {customers.length > 0 ? (customers.reduce((sum, c) => sum + c.orders.length, 0) / customers.length).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High-Frequency Customers</span>
                <span className="text-sm font-semibold text-orange-600">
                  {customers.filter(c => c.orders.length >= 3).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Single Purchase</span>
                <span className="text-sm font-semibold text-red-600">
                  {customers.filter(c => c.orders.length === 1).length}
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Insights */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Insights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue per Customer</span>
                <span className="text-lg font-bold text-green-600">
                  ${analytics.averageOrderValue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Top 20% Revenue Share</span>
                <span className="text-sm font-semibold text-purple-600">
                  {Math.round((customers.sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, Math.ceil(customers.length * 0.2))
                    .reduce((sum, c) => sum + c.totalSpent, 0) / analytics.totalRevenue) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Highest Single Order</span>
                <span className="text-sm font-semibold text-blue-600">
                  ${Math.max(...customers.flatMap(c => c.orders.map(o => o.amount))).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Customer Lifecycle Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Lifecycle Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { stage: 'New (0 orders)', count: customers.filter(c => c.orders.length === 0).length },
                { stage: 'First Purchase', count: customers.filter(c => c.orders.length === 1).length },
                { stage: 'Repeat (2-3)', count: customers.filter(c => c.orders.length >= 2 && c.orders.length <= 3).length },
                { stage: 'Loyal (4+)', count: customers.filter(c => c.orders.length >= 4).length }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Day of Week Preferences */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Contact Days</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(customers.reduce((acc, customer) => {
                const day = customer.preferredDay || 'Unknown';
                acc[day] = (acc[day] || 0) + 1;
                return acc;
              }, {})).map(([day, count]) => ({ day, count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Items Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Items Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(customers.reduce((acc, customer) => {
              customer.orders.forEach(order => {
                order.items.forEach(item => {
                  acc[item] = (acc[item] || 0) + 1;
                });
              });
              return acc;
            }, {})).sort(([,a], [,b]) => b - a).slice(0, 10).map(([item, count]) => ({ item, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="item" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 Customers by Order Count */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 5 Customers by Order Count</h3>
          <div className="space-y-4">
            {customers
              .sort((a, b) => b.orders.length - a.orders.length)
              .slice(0, 5)
              .map((customer, index) => (
                <div key={customer._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-indigo-600">
                      {customer.orders.length} orders
                    </div>
                    <div className="text-sm text-green-600 font-semibold">
                      ${customer.totalSpent.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Avg: ${customer.orders.length > 0 ? (customer.totalSpent / customer.orders.length).toFixed(2) : '0.00'}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>Category: {customer.preferredCategory}</div>
                    <div>Channel: {customer.preferredChannel}</div>
                    <div>Day: {customer.preferredDay}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}