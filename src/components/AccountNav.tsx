import { NavLink } from 'react-router-dom'

/** Account sub-nav: Profile + Orders only (Sign out lives on Profile). */
export function AccountNav() {
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
            end={false}
            className={({ isActive }) => (isActive ? 'is-active' : undefined)}
          >
            Orders
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
