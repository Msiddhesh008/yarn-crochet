import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Loader } from '../components/Loader'
import { YarnTrail } from '../components/YarnTrail'
import { CartDrawer } from '../components/CartDrawer'
import { SearchPanel } from '../components/SearchPanel'
import { useLenis, scrollToTop } from '../hooks/useLenis'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { initSectionReveals } from '../animations/scrollAnimations'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function MainLayout() {
  const [loaderDone, setLoaderDone] = useState(false)
  const [ready, setReady] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const reduced = usePrefersReducedMotion()
  const location = useLocation()

  useLenis(!reduced)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoaderDone(true)
      window.setTimeout(() => setReady(true), 200)
    }, reduced ? 200 : 1300)
    return () => window.clearTimeout(timer)
  }, [reduced])

  useEffect(() => {
    scrollToTop(true)
    ScrollTrigger.refresh()
    const t = window.setTimeout(() => {
      scrollToTop(true)
      initSectionReveals(reduced)
      ScrollTrigger.refresh()
    }, 100)
    return () => window.clearTimeout(t)
  }, [location.pathname, location.search, location.hash, reduced])

  return (
    <>
      <Loader done={loaderDone} />
      <YarnTrail />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
      <main>
        <Outlet context={{ ready }} />
      </main>
      <Footer />
    </>
  )
}
