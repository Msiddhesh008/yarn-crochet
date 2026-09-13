import { HashRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { AboutPage } from './pages/AboutPage'
import { CustomPage } from './pages/CustomPage'

export default function App() {
  return (
    <CartProvider>
      <HashRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="custom" element={<CustomPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </CartProvider>
  )
}
