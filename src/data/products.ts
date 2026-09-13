import type { GalleryItem, Product, Testimonial } from '../types'
import { palette } from './palette'

const { mutedPink, butter, cream, sage, warmBrown, terracotta, dustyRose } =
  palette

export const products: Product[] = [
  {
    id: '1',
    slug: 'dusty-rose-blossom',
    name: 'Dusty Rose Blossom',
    category: 'Crochet Flowers',
    price: 28,
    description:
      'A soft crochet flower in dusty rose, finished with a butter-yellow centre. Perfect as a gift, hair piece, or keepsake.',
    image: '/products/dusty-rose-blossom.jpg',
    colors: [mutedPink, butter, cream],
    featured: true,
  },
  {
    id: '2',
    slug: 'sage-market-tote',
    name: 'Sage Market Tote',
    category: 'Crochet Bags',
    price: 68,
    description:
      'A roomy handmade tote in muted sage. Strong enough for markets, soft enough for everyday.',
    image: '/products/sage-market-tote.jpg',
    colors: [sage, warmBrown, cream],
    featured: true,
  },
  {
    id: '3',
    slug: 'butter-bunny',
    name: 'Butter Bunny',
    category: 'Plushies',
    price: 42,
    description:
      'A plush crochet bunny in butter yellow with terracotta blush. Soft, small, and endlessly hug-worthy.',
    image: '/products/butter-bunny.jpg',
    colors: [butter, terracotta, cream],
    featured: true,
  },
  {
    id: '4',
    slug: 'loop-keychain-set',
    name: 'Loop Keychain Set',
    category: 'Keychains',
    price: 18,
    description:
      'Three miniature crochet loops on a brass ring — a pocket-sized reminder of handmade joy.',
    image: '/products/loop-keychain.jpg',
    colors: [mutedPink, sage, butter],
    featured: false,
  },
  {
    id: '5',
    slug: 'terracotta-posy',
    name: 'Terracotta Posy',
    category: 'Crochet Flowers',
    price: 34,
    description:
      'A clustered posy of terracotta petals and sage leaves. Arranged by hand, never identical.',
    image: '/products/terracotta-posy.jpg',
    colors: [terracotta, sage, warmBrown],
    featured: true,
  },
  {
    id: '6',
    slug: 'ivory-cloud-bag',
    name: 'Ivory Cloud Bag',
    category: 'Crochet Bags',
    price: 78,
    description:
      'A soft cloud-shaped bag in warm ivory. Light, dreamy, and made for slow afternoons.',
    image: '/products/ivory-cloud-bag.jpg',
    colors: [cream, mutedPink, warmBrown],
    featured: false,
  },
  {
    id: '7',
    slug: 'little-heart-plush',
    name: 'Little Heart Plush',
    category: 'Plushies',
    price: 24,
    description:
      'A palm-sized crochet heart in muted pink. Made to be given — or kept close.',
    image: '/products/little-heart.jpg',
    colors: [mutedPink, dustyRose, cream],
    featured: false,
  },
  {
    id: '8',
    slug: 'garden-gift-set',
    name: 'Garden Gift Set',
    category: 'Handmade Gifts',
    price: 56,
    description:
      'A curated set of three crochet blooms wrapped in soft tissue. Ready to gift.',
    image: '/products/garden-gift.jpg',
    colors: [sage, mutedPink, butter],
    featured: true,
  },
  {
    id: '9',
    slug: 'stitch-charm',
    name: 'Stitch Charm',
    category: 'Keychains',
    price: 14,
    description:
      'A single crochet stitch charm on a warm brass clasp. Small enough for keys, meaningful enough for keepsakes.',
    image: '/products/stitch-charm.jpg',
    colors: [terracotta, warmBrown, cream],
    featured: false,
  },
  {
    id: '10',
    slug: 'custom-dream-piece',
    name: 'Custom Dream Piece',
    category: 'Custom Pieces',
    price: 95,
    description:
      'A made-to-order crochet piece designed around your colours and idea. Start with a custom request.',
    image: '/products/custom-dream.jpg',
    colors: [mutedPink, sage, terracotta, butter],
    featured: true,
  },
]

export const galleryItems: GalleryItem[] = [
  { id: 'g1', image: '/gallery/g1.jpg', caption: 'Soft petals, dusty rose' },
  { id: 'g2', image: '/gallery/g2.jpg', caption: 'Yarn waiting on the table' },
  { id: 'g3', image: '/gallery/g3.jpg', caption: 'First loop of the day' },
  { id: 'g4', image: '/gallery/g4.jpg', caption: 'Behind the stitches' },
  { id: 'g5', image: '/gallery/g5.jpg', caption: 'Wrapped with care' },
  { id: 'g6', image: '/gallery/g6.jpg', caption: 'Finished and ready' },
]

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote: 'Every little detail feels like it was made just for us.',
    author: 'Maya R.',
  },
  {
    id: 't2',
    quote: 'The softest bag I own — and the story behind it makes it even better.',
    author: 'Elena K.',
  },
  {
    id: 't3',
    quote: 'A gift that felt personal, handmade, and quietly luxurious.',
    author: 'Priya S.',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}
