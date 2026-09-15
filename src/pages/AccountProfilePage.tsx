import { useEffect, useState, type FormEvent } from 'react'
import { AccountNav } from '../components/AccountNav'
import { TextField } from '../components/form/FormControls'
import { ProfileFormSkeleton } from '../components/Skeleton'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import { ApiError } from '../services/api'
import { EMPTY_ADDRESS, type OrderAddress } from '../types/orders'

export function AccountProfilePage() {
  const { customer, updateProfile, logout } = useCustomerAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState<OrderAddress>(EMPTY_ADDRESS)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!customer) return
    setName(customer.name)
    setPhone(customer.phone)
    setAddress({
      ...EMPTY_ADDRESS,
      ...customer.address,
      line2: customer.address.line2 ?? '',
    })
  }, [customer])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSaved(false)
    updateProfile({
      name,
      phone,
      address: {
        ...address,
        line2: address.line2 || undefined,
      },
    })
      .then(() => setSaved(true))
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Could not save profile')
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero" style={{ maxWidth: 640 }}>
        <p className="eyebrow">Account</p>
        <h1 className="section-heading">Profile</h1>
        <p className="section-intro">
          Contact and default shipping for checkout.
        </p>
        <AccountNav />
      </div>
      <div className="container" style={{ paddingBottom: '4rem', maxWidth: 640 }}>
        {!customer ? (
          <ProfileFormSkeleton />
        ) : (
          <form className="form-grid" onSubmit={onSubmit}>
          {error ? <p className="handmade-note">{error}</p> : null}
          {saved ? <p className="section-intro">Profile saved.</p> : null}
          <TextField
            id="profile-email"
            label="Email"
            value={customer.email}
            onChange={() => undefined}
            disabled
            hint="Email cannot be changed in this pass"
          />
          <div className="form-grid form-grid--2">
            <TextField
              id="profile-name"
              label="Name"
              required
              value={name}
              onChange={setName}
              autoComplete="name"
            />
            <TextField
              id="profile-phone"
              label="Phone"
              type="tel"
              required
              value={phone}
              onChange={setPhone}
              autoComplete="tel"
            />
          </div>
          <p className="eyebrow" style={{ margin: '0.5rem 0 0' }}>
            Default shipping address
          </p>
          <TextField
            id="profile-line1"
            label="Address line 1"
            required
            value={address.line1}
            onChange={(line1) => setAddress({ ...address, line1 })}
            autoComplete="address-line1"
          />
          <TextField
            id="profile-line2"
            label="Address line 2"
            value={address.line2 ?? ''}
            onChange={(line2) => setAddress({ ...address, line2 })}
            autoComplete="address-line2"
          />
          <div className="form-grid form-grid--2">
            <TextField
              id="profile-city"
              label="City"
              required
              value={address.city}
              onChange={(city) => setAddress({ ...address, city })}
            />
            <TextField
              id="profile-state"
              label="State"
              required
              value={address.state}
              onChange={(state) => setAddress({ ...address, state })}
            />
          </div>
          <div className="form-grid form-grid--2">
            <TextField
              id="profile-postal"
              label="Postal code"
              required
              value={address.postalCode}
              onChange={(postalCode) => setAddress({ ...address, postalCode })}
            />
            <TextField
              id="profile-country"
              label="Country"
              required
              value={address.country}
              onChange={(country) => setAddress({ ...address, country })}
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save profile'}
          </button>
          <button
            type="button"
            className="btn btn--ghost account-profile__sign-out"
            onClick={() => logout()}
          >
            Sign out
          </button>
        </form>
        )}
      </div>
    </div>
  )
}
