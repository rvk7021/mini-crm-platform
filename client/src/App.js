import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { PageNotFound } from "./pages/PageNotFound";
import Layout from "./components/Layout";
import CustomerPage from "./pages/Customer";
import SegmentPage from "./pages/Segment";
import CampaignPage from "./pages/Campaigns";


const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!authToken || !user) {
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
            <Route path="home" element={<Dashboard />} />
            <Route path="customers" element={<CustomerPage />} />
            <Route path="segments" element={<SegmentPage />} />
            <Route path="campaigns" element={<CampaignPage />} />
            <Route path="create-campaign" element={<CampaignPage />} />
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
