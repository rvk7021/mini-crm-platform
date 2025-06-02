import React, { useState } from "react";
import AddCustomer from "../Forms/AddCustomer";
import {AddOrder} from "../Forms/AddOrder";
import { toast } from "react-hot-toast";

export default function OrderPage() {
  const [mode, setMode] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCustomerAdded, setIsCustomerAdded] = useState(false);

  const handleSuccess = (message) => toast.success(message, { duration: 3000 });
  const handleError = (message) => toast.error(message, { duration: 3000 });

  const handleModeChange = (type) => {
    setMode(type);
    setRefreshKey((prev) => prev + 1); // Reset child forms
    setIsCustomerAdded(false); // Reset customer state when switching modes
  };

  const handleCloseForm = () => {
    setMode(null);
    setIsCustomerAdded(false);
    setRefreshKey((prev) => prev + 1); // Reset forms
  };

  const handleCloseOrderForm = () => {
    if (mode === "new") {
      setIsCustomerAdded(false); // Go back to customer form for new customer mode
    } else {
      setMode(null); // Go back to initial state for existing customer mode
    }
    setRefreshKey((prev) => prev + 1); // Reset forms
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">SmartReach CRM</h1>
        <p className="text-gray-500">Track, manage, and grow customer relationships with ease.</p>
      </div>

      {/* Analytics Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Orders", value: "1,248" },
          { label: "New Customers", value: "312" },
          { label: "Conversion Rate", value: "58.7%" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-all">
            <h4 className="text-sm text-gray-500 mb-1">{label}</h4>
            <p className="text-xl font-semibold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Customer Type */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Who are you placing the order for?</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleModeChange("new")}
            className={`px-6 py-2 text-sm rounded-md border transition-all ${mode === "new"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
              }`}
          >
            New Customer
          </button>
          <button
            onClick={() => handleModeChange("existing")}
            className={`px-6 py-2 text-sm rounded-md border transition-all ${mode === "existing"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
              }`}
          >
            Existing Customer
          </button>
        </div>
      </div>

      {/* Forms */}
      <div className="max-w-3xl mx-auto space-y-8">
        {/* New Customer Mode */}
        {mode === "new" && !isCustomerAdded && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Customer</h3>
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all"
              >
                ✕ Close
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <AddCustomer
                key={refreshKey}
                onSuccess={() => {
                  handleSuccess("Customer added successfully!");
                  setIsCustomerAdded(true);
                }}
                onError={(msg) => handleError(msg || "Failed to add customer")}
              />
            </div>
          </section>
        )}

        {/* Show AddOrder only after customer is added */}
        {mode === "new" && isCustomerAdded && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Create Order</h3>
              <button
                onClick={handleCloseOrderForm}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all"
              >
                ✕ Close
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <AddOrder
                key={refreshKey + "-order"}
                onSuccess={() => handleSuccess("Order created successfully!")}
                onError={(msg) => handleError(msg || "Failed to create order")}
              />
            </div>
          </section>
        )}

        {/* Existing Customer Mode */}
        {mode === "existing" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Create Order for Existing Customer</h3>
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all"
              >
                ✕ Close
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <AddOrder
                key={refreshKey}
                onSuccess={() => handleSuccess("Order created successfully!")}
                onError={(msg) => handleError(msg || "Failed to create order")}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}