import { HashRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { StorefrontProvider } from './context/StorefrontContext'
import { CustomerAuthProvider } from './context/CustomerAuthContext'
import { MainLayout } from './layouts/MainLayout'
import { RequireCustomer } from './components/RequireCustomer'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { AboutPage } from './pages/AboutPage'
import { CustomPage } from './pages/CustomPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { AccountOrdersPage } from './pages/AccountOrdersPage'
import { AccountOrderDetailPage } from './pages/AccountOrderDetailPage'
import { AccountProfilePage } from './pages/AccountProfilePage'

export default function App() {
  return (
    <CustomerAuthProvider>
      <CartProvider>
        <StorefrontProvider>
          <HashRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="product/:slug" element={<ProductDetailPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="custom" element={<CustomPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route element={<RequireCustomer />}>
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="account/profile" element={<AccountProfilePage />} />
                  <Route path="account/orders" element={<AccountOrdersPage />} />
                  <Route
                    path="account/orders/:id"
                    element={<AccountOrderDetailPage />}
                  />
                </Route>
              </Route>
            </Routes>
          </HashRouter>
        </StorefrontProvider>
      </CartProvider>
    </CustomerAuthProvider>
  )
}
