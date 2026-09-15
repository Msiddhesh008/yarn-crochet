import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { useStorefront } from '../context/StorefrontContext'
import { MagneticButton } from './MagneticButton'
import type { CustomOrderForm } from '../types'

const emptyForm: CustomOrderForm = {
  name: '',
  idea: '',
  colours: '',
  message: '',
}

export function CustomOrder() {
  const { content, submitCustomRequest } = useStorefront()
  const { customOrder } = content
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CustomOrderForm>(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    submitCustomRequest(form)
      .then(() => {
        setSubmitted(true)
        window.setTimeout(() => {
          setOpen(false)
          setSubmitted(false)
          setForm(emptyForm)
        }, 1600)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Could not send request')
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <section className="section custom-cta" id="custom">
      <div className="container">
        <p className="eyebrow" data-reveal>
          {customOrder.eyebrow}
        </p>
        <h2 className="section-heading" data-reveal>
          {customOrder.heading}
        </h2>
        <p className="section-intro" data-reveal>
          {customOrder.subheading}
        </p>
        <div className="custom-cta__action" data-reveal>
          <MagneticButton variant="unravel" onClick={() => setOpen(true)}>
            {customOrder.cta}
          </MagneticButton>
        </div>
      </div>

      {open ? (
        <div
          className="modal-backdrop is-open"
          role="dialog"
          aria-modal="true"
          aria-label="Custom order"
          onClick={() => setOpen(false)}
        >
          <div
            className="modal"
            style={{ position: 'relative', padding: '2rem', maxWidth: 560 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal__close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
            <h3 className="modal__name" style={{ fontSize: '2rem' }}>
              Tell us your idea
            </h3>
            {submitted ? (
              <p className="handmade-note">
                Thank you — we&apos;ll stitch it into something wonderful.
              </p>
            ) : (
              <form
                className="form-grid"
                onSubmit={onSubmit}
                style={{ marginTop: '1.25rem' }}
              >
                <div className="field">
                  <label htmlFor="custom-name">Name</label>
                  <input
                    id="custom-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="custom-idea">Product idea</label>
                  <input
                    id="custom-idea"
                    required
                    value={form.idea}
                    onChange={(e) => setForm({ ...form, idea: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="custom-colours">Preferred colours</label>
                  <input
                    id="custom-colours"
                    value={form.colours}
                    onChange={(e) =>
                      setForm({ ...form, colours: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="custom-message">Message</label>
                  <textarea
                    id="custom-message"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>
                {error ? <p className="handmade-note">{error}</p> : null}
                <MagneticButton type="submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send request'}
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </section>
  )
}
