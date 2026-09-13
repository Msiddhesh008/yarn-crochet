import { CustomOrder } from '../components/CustomOrder'
import { customPage } from '../data/content'

export function CustomPage() {
  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero">
        <p className="eyebrow">{customPage.eyebrow}</p>
        <h1 className="section-heading">
          {customPage.heading}
          <span>{customPage.subheading}</span>
        </h1>
        <p className="section-intro">{customPage.intro}</p>
      </div>
      <CustomOrder />
    </div>
  )
}
