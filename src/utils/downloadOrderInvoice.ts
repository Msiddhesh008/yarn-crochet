import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { hexToRgba, palette } from '../data/palette'
import type { InvoiceBranding } from '../types/invoice'
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  type ShopOrder,
} from '../types/orders'
import { formatMoney } from './formatMoney'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const PDF_MARGIN_MM = 10

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function buildOrderInvoiceDocument(
  order: ShopOrder,
  branding: InvoiceBranding,
): string {
  const { ink, inkSoft, terracotta, cream, surface, warmBrown } = palette
  const lineBorder = hexToRgba(warmBrown, 0.22)
  const rowBorder = hexToRgba(warmBrown, 0.12)
  const sheetShadow = hexToRgba(ink, 0.08)
  const noteBackground = hexToRgba(terracotta, 0.1)
  const loaderMuted = hexToRgba(inkSoft, 0.75)

  const orderId = escapeHtml(order.id)
  const shortId = escapeHtml(order.id.slice(0, 10))
  const placed = escapeHtml(new Date(order.createdAt).toLocaleString())
  const status = escapeHtml(
    ORDER_STATUS_LABELS[order.status] ?? String(order.status),
  )
  const payment = escapeHtml(
    PAYMENT_METHOD_LABELS[order.paymentMethod] ?? String(order.paymentMethod),
  )
  const customer = escapeHtml(order.customer)
  const email = escapeHtml(order.email)
  const brandName = escapeHtml(branding.name)
  const tagline = escapeHtml(branding.tagline)
  const loaderText = escapeHtml(branding.loaderText)
  const logoUrl = escapeHtml(branding.logoAbsoluteUrl)

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  const address = [
    order.address.line1,
    order.address.line2,
    `${order.address.city}, ${order.address.state} ${order.address.postalCode}`,
    order.address.country,
  ]
    .filter(Boolean)
    .map((line) => escapeHtml(String(line)))
    .join('<br />')

  const rows = order.items
    .map((item) => {
      const lineTotal = item.price * item.quantity
      const color = item.color
        ? `<span class="item-color">${escapeHtml(item.color)}</span>`
        : ''
      return `<tr>
        <td><span class="item-name">${escapeHtml(item.name)}</span>${color ? `<br />${color}` : ''}</td>
        <td class="num">${item.quantity}</td>
        <td class="num">${formatMoney(item.price)}</td>
        <td class="num">${formatMoney(lineTotal)}</td>
      </tr>`
    })
    .join('')

  const noteBlock =
    order.note.trim().length > 0
      ? `<section class="note">
      <h3>Order note</h3>
      <p>${escapeHtml(order.note)}</p>
    </section>`
      : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${shortId} · ${brandName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;1,9..40,400&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 2.25rem 2.5rem;
      font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
      font-size: 15px;
      line-height: 1.55;
      color: ${ink};
      background: ${cream};
    }
    .sheet {
      max-width: 720px;
      margin: 0 auto;
      background: ${surface};
      border: 1px solid ${lineBorder};
      border-radius: 14px;
      padding: 2rem 2.25rem 2.5rem;
      box-shadow: 0 12px 40px ${sheetShadow};
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid ${lineBorder};
    }
    .header-text {
      margin-left: auto;
      text-align: right;
    }
    .header img {
      width: 88px;
      height: auto;
      object-fit: contain;
    }
    .header .eyebrow {
      font-size: 0.72rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${terracotta};
      margin: 0;
      font-weight: 500;
    }
    .meta-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-top: 1.5rem;
      font-size: 0.92rem;
    }
    .meta-row h3 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.15rem;
      margin: 0 0 0.5rem;
      font-weight: 600;
    }
    .meta-row p { margin: 0.2rem 0; color: ${inkSoft}; }
    .meta-row strong { color: ${ink}; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1.75rem;
    }
    th {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${inkSoft};
      text-align: left;
      padding: 0.65rem 0.5rem;
      border-bottom: 1px solid ${lineBorder};
      font-weight: 500;
    }
    th.num, td.num { text-align: right; }
    td {
      padding: 0.85rem 0.5rem;
      border-bottom: 1px solid ${rowBorder};
      vertical-align: top;
    }
    .item-name { font-weight: 500; color: ${ink}; }
    .item-color { font-size: 0.85rem; color: ${inkSoft}; }
    .totals {
      margin-top: 1.25rem;
      text-align: right;
      font-size: 1.05rem;
    }
    .totals .grand {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.45rem;
      font-weight: 600;
      margin-top: 0.35rem;
      color: ${ink};
    }
    .note {
      margin-top: 1.5rem;
      padding: 1rem 1.15rem;
      background: ${noteBackground};
      border-radius: 10px;
      border: 1px solid ${lineBorder};
    }
    .note h3 {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0 0 0.4rem;
      color: ${inkSoft};
    }
    .note p { margin: 0; }
    .thanks {
      margin-top: 2rem;
      padding-top: 1.75rem;
      border-top: 1px solid ${lineBorder};
      text-align: center;
    }
    .thanks .script {
      font-family: 'Caveat', cursive;
      font-size: 1.65rem;
      color: ${terracotta};
      margin: 0 0 0.5rem;
    }
    .thanks .message {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.2rem;
      margin: 0 0 0.35rem;
      font-weight: 500;
    }
    .thanks .tagline {
      font-size: 0.88rem;
      color: ${inkSoft};
      margin: 0.15rem 0;
    }
    .thanks .loader {
      font-size: 0.8rem;
      color: ${loaderMuted};
      margin: 0.5rem 0 0;
      font-style: italic;
    }
    @media print {
      body { background: white; padding: 0.5in; }
      .sheet { box-shadow: none; border: none; max-width: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <header class="header">
      <img src="${logoUrl}" alt="${brandName}" />
      <div class="header-text">
        <p class="eyebrow">Invoice</p>
      </div>
    </header>

    <div class="meta-row">
      <div>
        <h3>Bill to</h3>
        <p><strong>${customer}</strong></p>
        <p>${email}</p>
        <p>${address}</p>
      </div>
      <div>
        <h3>Order details</h3>
        <p><strong>Order</strong> ${shortId}</p>
        <p><strong>Reference</strong> ${orderId}</p>
        <p><strong>Placed</strong> ${placed}</p>
        <p><strong>Status</strong> ${status}</p>
        <p><strong>Payment</strong> ${payment}</p>
        <p><strong>Items</strong> ${itemCount}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="num">Qty</th>
          <th class="num">Unit price</th>
          <th class="num">Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="totals">
      <p>Subtotal <strong>${formatMoney(order.total)}</strong></p>
      <p class="grand">Total ${formatMoney(order.total)}</p>
    </div>

    ${noteBlock}

    <footer class="thanks">
      <p class="script">Thank you for your order!</p>
      <p class="message">Your handmade pieces were made with care — we hope they bring warmth to your home.</p>
      <p class="tagline">${tagline}</p>
      <p class="loader">${loaderText}</p>
    </footer>
  </div>
</body>
</html>`
}

function parseInvoiceMarkup(html: string): {
  styles: string
  sheet: HTMLElement
} {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const styles = Array.from(parsed.querySelectorAll('style'))
    .map((node) => node.textContent ?? '')
    .join('\n')
  const sheet = parsed.querySelector('.sheet')
  if (!sheet || !(sheet instanceof HTMLElement)) {
    throw new Error('Invoice layout failed')
  }
  return { styles, sheet: sheet.cloneNode(true) as HTMLElement }
}

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'))
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve()
            return
          }
          img.onload = () => resolve()
          img.onerror = () => resolve()
        }),
    ),
  )
}

async function renderInvoiceToCanvas(html: string): Promise<HTMLCanvasElement> {
  const { styles, sheet } = parseInvoiceMarkup(html)

  const host = document.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  host.style.position = 'fixed'
  host.style.left = '-10000px'
  host.style.top = '0'
  host.style.width = '800px'
  host.style.pointerEvents = 'none'
  host.style.zIndex = '-1'

  const styleEl = document.createElement('style')
  styleEl.textContent = styles
  host.appendChild(styleEl)
  host.appendChild(sheet)
  document.body.appendChild(host)

  const images = host.querySelectorAll('img')
  images.forEach((img) => {
    img.crossOrigin = 'anonymous'
  })

  try {
    await document.fonts.ready
    await waitForImages(host)
    await new Promise((resolve) => setTimeout(resolve, 300))

    return await html2canvas(sheet, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: palette.cream,
    })
  } finally {
    document.body.removeChild(host)
  }
}

function saveCanvasAsPdf(canvas: HTMLCanvasElement, fileName: string): void {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const contentWidth = A4_WIDTH_MM - PDF_MARGIN_MM * 2
  const pageHeight = A4_HEIGHT_MM - PDF_MARGIN_MM * 2
  const imgData = canvas.toDataURL('image/png')
  const imgWidth = contentWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let remainingHeight = imgHeight
  let positionY = PDF_MARGIN_MM

  pdf.addImage(imgData, 'PNG', PDF_MARGIN_MM, positionY, imgWidth, imgHeight)
  remainingHeight -= pageHeight

  while (remainingHeight > 0) {
    positionY -= pageHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', PDF_MARGIN_MM, positionY, imgWidth, imgHeight)
    remainingHeight -= pageHeight
  }

  pdf.save(fileName)
}

export async function downloadOrderInvoice(
  order: ShopOrder,
  branding: InvoiceBranding,
): Promise<void> {
  const html = buildOrderInvoiceDocument(order, branding)
  const canvas = await renderInvoiceToCanvas(html)
  const fileName = `invoice-${order.id.slice(0, 10)}.pdf`
  saveCanvasAsPdf(canvas, fileName)
}
