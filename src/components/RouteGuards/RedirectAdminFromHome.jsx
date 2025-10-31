import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const RedirectAdminFromHome = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth()
  if (loading) return null
  // if (isAuthenticated && user?.role === 'admin') {
  //   return <Navigate to="/admin" replace />
  // }
  return children
}

export default RedirectAdminFromHome


