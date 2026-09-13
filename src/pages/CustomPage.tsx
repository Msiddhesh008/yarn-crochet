import { CustomOrder } from '../components/CustomOrder'

export function CustomPage() {
  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero">
        <p className="eyebrow">Custom orders</p>
        <h1 className="section-heading">
          Your idea.
          <span>Our stitches.</span>
        </h1>
        <p className="section-intro">
          Share a colour, a shape, a feeling — we&apos;ll turn yarn into something made just for you.
        </p>
      </div>
      <CustomOrder />
    </div>
  )
}
