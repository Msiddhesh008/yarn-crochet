import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import { ApiError } from '../services/api'
import { TextField } from '../components/form/FormControls'

export function LoginPage() {
  const { login, isAuthenticated, ready } = useCustomerAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from ?? '/account/orders'

  const [email, setEmail] = useState('hello@customer.test')
  const [password, setPassword] = useState('handmade')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (ready && isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    login(email, password)
      .then(() => navigate(from, { replace: true }))
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Could not sign in')
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero" style={{ maxWidth: 480 }}>
        <p className="eyebrow">Account</p>
        <h1 className="section-heading">Sign in</h1>
        <p className="section-intro">
          Manage your orders and check out with a Yarn account.
        </p>
        <form className="form-grid" onSubmit={onSubmit} style={{ marginTop: '1.5rem' }}>
          {error ? <p className="handmade-note">{error}</p> : null}
          <TextField
            id="login-email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={setEmail}
            autoComplete="username"
          />
          <TextField
            id="login-password"
            label="Password"
            type="password"
            required
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="section-intro" style={{ margin: 0 }}>
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
