import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { PageNotFound } from "./pages/PageNotFound";
import Layout from "./components/Layout";
import CustomerPage from "./pages/Customer";
import SegmentPage from "./pages/Segment";
import CampaignPage from "./pages/Campaigns";
import OrderPage from "./pages/Order";
import CreateCampaign from "./components/CreateCampaign";
import { useEffect,useState } from "react";
const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  const [authenticated, setAuthenticated] = useState(null); // null means loading

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = authToken || localStorage.getItem('authToken');
        if (!token) {
          setAuthenticated(false);
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/authenticate`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Authentication response:", data);
          setAuthenticated(data.success);
        } else {
          console.log('Authentication failed - invalid token');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setAuthenticated(false);
      }
    };

    checkAuthentication();
  }, [authToken]);

  if (authenticated === null) {
    // Improved loading state with spinner
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-sm font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user'));

  if (authToken && user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};


function App() {
  return (
    <div className="App bg-red-500">
      <Router>
        <Routes>
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>

          }>
            <Route path="" element={<Dashboard />} />
            <Route path="customers" element={<CustomerPage />} />
            <Route path="segments" element={<SegmentPage />} />
            <Route path="campaigns" element={<CampaignPage />} />
            <Route path="create-campaign" element={<CreateCampaign />} />
            <Route path="create-order" element={<OrderPage />} />

          </Route>
          <Route path='/*' element={
            <PageNotFound />
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
