import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VendorList from './pages/vendor/VendorList';
import VendorAdd from './pages/vendor/VendorAdd';
import VendorEdit from './pages/vendor/VendorEdit';
import SalesmanList from './pages/salesman/SalesmanList';
import SalesmanAdd from './pages/salesman/SalesmanAdd';
import SalesmanEdit from './pages/salesman/SalesmanEdit';
import OrderList from './pages/order/OrderList';
import OrderAdd from './pages/order/OrderAdd';
import OrderEdit from './pages/order/OrderEdit';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/vendors/new" element={<VendorAdd />} />
            <Route path="/vendors/:id/edit" element={<VendorEdit />} />
            <Route path="/salesmen" element={<SalesmanList />} />
            <Route path="/salesmen/new" element={<SalesmanAdd />} />
            <Route path="/salesmen/:id/edit" element={<SalesmanEdit />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/new" element={<OrderAdd />} />
            <Route path="/orders/:id/edit" element={<OrderEdit />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
