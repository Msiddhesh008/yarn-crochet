import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import { ApiError } from '../services/api'
import { TextField } from '../components/form/FormControls'
import { EMPTY_ADDRESS } from '../types/orders'

export function RegisterPage() {
  const { register, isAuthenticated, ready } = useCustomerAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [address, setAddress] = useState(EMPTY_ADDRESS)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (ready && isAuthenticated) {
    return <Navigate to="/account/orders" replace />
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setSubmitting(true)
    setError('')
    register({
      name,
      email,
      phone,
      password,
      address: {
        ...address,
        line2: address.line2 || undefined,
      },
    })
      .then(() => navigate('/account/profile', { replace: true }))
      .catch((err: unknown) => {
        setError(
          err instanceof ApiError ? err.message : 'Could not create account',
        )
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero" style={{ maxWidth: 640 }}>
        <p className="eyebrow">Account</p>
        <h1 className="section-heading">Create account</h1>
        <p className="section-intro">
          Save your pieces and track every order from the studio.
        </p>
        <form className="form-grid" onSubmit={onSubmit} style={{ marginTop: '1.5rem' }}>
          {error ? <p className="handmade-note">{error}</p> : null}
          <div className="form-grid form-grid--2">
            <TextField
              id="reg-name"
              label="Name"
              required
              value={name}
              onChange={setName}
              autoComplete="name"
            />
            <TextField
              id="reg-phone"
              label="Phone"
              type="tel"
              required
              value={phone}
              onChange={setPhone}
              autoComplete="tel"
            />
          </div>
          <TextField
            id="reg-email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
          <div className="form-grid form-grid--2">
            <TextField
              id="reg-password"
              label="Password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
            />
            <TextField
              id="reg-confirm"
              label="Confirm password"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
            />
          </div>
          <p className="eyebrow" style={{ margin: '0.5rem 0 0' }}>
            Default shipping address
          </p>
          <TextField
            id="reg-line1"
            label="Address line 1"
            required
            value={address.line1}
            onChange={(line1) => setAddress({ ...address, line1 })}
            autoComplete="address-line1"
          />
          <TextField
            id="reg-line2"
            label="Address line 2"
            value={address.line2 ?? ''}
            onChange={(line2) => setAddress({ ...address, line2 })}
            autoComplete="address-line2"
          />
          <div className="form-grid form-grid--2">
            <TextField
              id="reg-city"
              label="City"
              required
              value={address.city}
              onChange={(city) => setAddress({ ...address, city })}
              autoComplete="address-level2"
            />
            <TextField
              id="reg-state"
              label="State"
              required
              value={address.state}
              onChange={(state) => setAddress({ ...address, state })}
              autoComplete="address-level1"
            />
          </div>
          <div className="form-grid form-grid--2">
            <TextField
              id="reg-postal"
              label="Postal code"
              required
              value={address.postalCode}
              onChange={(postalCode) => setAddress({ ...address, postalCode })}
              autoComplete="postal-code"
            />
            <TextField
              id="reg-country"
              label="Country"
              required
              value={address.country}
              onChange={(country) => setAddress({ ...address, country })}
              autoComplete="country-name"
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create account'}
          </button>
          <p className="section-intro" style={{ margin: 0 }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
