export type ProductCategory =
  | 'Crochet Flowers'
  | 'Crochet Bags'
  | 'Plushies'
  | 'Keychains'
  | 'Handmade Gifts'
  | 'Custom Pieces'

export interface Product {
  id: string
  slug: string
  name: string
  category: ProductCategory
  price: number
  description: string
  image: string
  colors: string[]
  featured: boolean
  showInCollection: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  color?: string
}

export interface CustomOrderForm {
  name: string
  idea: string
  colours: string
  message: string
}

export interface GalleryItem {
  id: string
  image: string
  caption: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
}

export type {
  SiteContent,
  ProcessVisual,
  StitchStoryStep,
  ProcessStep,
  GalleryContentItem,
  TestimonialItem,
} from './content'
