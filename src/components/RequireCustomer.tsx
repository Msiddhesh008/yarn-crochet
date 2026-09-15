import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useCustomerAuth } from '../context/CustomerAuthContext'

export function RequireCustomer() {
  const { isAuthenticated, ready } = useCustomerAuth()
  const location = useLocation()

  if (!ready) return null
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }
  return <Outlet />
}
