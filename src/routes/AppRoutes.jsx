import { Routes, Route } from 'react-router-dom'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import HomePage from '../pages/dashboard/HomePage'
import ProfilePage from '../pages/dashboard/ProfilePage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}