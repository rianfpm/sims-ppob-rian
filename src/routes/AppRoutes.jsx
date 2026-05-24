import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import HomePage from '../pages/dashboard/HomePage'
import ProfilePage from '../pages/dashboard/ProfilePage'
import TopUpPage from '../pages/dashboard/TopUpPage'
import TransactionHistoryPage from '../pages/dashboard/TransactionHistoryPage'
import PaymentPage from '../pages/dashboard/PaymentPage'

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('token')
  if (token) {
    return <Navigate to="/home" replace />
  }
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/topup" element={<ProtectedRoute><TopUpPage /></ProtectedRoute>} />
      <Route path="/transaction" element={<ProtectedRoute><TransactionHistoryPage /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
    </Routes>
  )
}