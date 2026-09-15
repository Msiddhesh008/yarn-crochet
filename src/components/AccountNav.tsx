import { NavLink } from 'react-router-dom'
import { useCustomerAuth } from '../context/CustomerAuthContext'

export function AccountNav() {
  const { logout } = useCustomerAuth()

  return (
    <nav aria-label="Account">
      <ul className="account-nav">
        <li>
          <NavLink
            to="/account/profile"
            className={({ isActive }) => (isActive ? 'is-active' : undefined)}
          >
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/account/orders"
            className={({ isActive }) => (isActive ? 'is-active' : undefined)}
          >
            Orders
          </NavLink>
        </li>
        <li>
          <button type="button" onClick={logout}>
            Sign out
          </button>
        </li>
      </ul>
    </nav>
  )
}
