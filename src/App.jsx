import { useEffect, useState } from 'react'
import CartDrawer from './components/CartDrawer.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { categories, contacts, paymentDetails } from './data/storefront.js'
import useStorefront from './hooks/useStorefront.js'
import AboutPage from './pages/About.jsx'
import ContactPage from './pages/Contact.jsx'
import HomePage from './pages/Home.jsx'
import AdminPage from './pages/Admin.jsx'
import ProductPage from './pages/Product.jsx'
import ShopPage from './pages/Shop.jsx'
import './App.css'

function App() {
  const [page, setPage] = useState(() => window.location.hash.slice(1) || 'home')
  const storefront = useStorefront(page)
  const { setSelectedSize } = storefront

  useEffect(() => {
    function syncPage() {
      setPage(window.location.hash.slice(1) || 'home')
      setSelectedSize('')
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', syncPage)
    window.addEventListener('popstate', syncPage)
    return () => {
      window.removeEventListener('hashchange', syncPage)
      window.removeEventListener('popstate', syncPage)
    }
  }, [setSelectedSize])

  function chooseCategory(category) {
    storefront.setActiveCategory(category)
    if (page !== 'shop') navigateTo('shop')
    else document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
  }

  function navigateTo(route) {
    window.history.pushState(null, '', `#${route}`)
    setPage(route)
    setSelectedSize('')
    window.scrollTo(0, 0)
  }

  function openProduct(product) {
    navigateTo(`product/${product.id}`)
  }

  if (page === 'admin') return <AdminPage />

  return (
    <>
      <SiteHeader
        cartCount={storefront.cartCount}
        onCartOpen={() => storefront.setCartOpen(true)}
        onShopClick={() => storefront.setActiveCategory('All pieces')}
      />

      <main id="home">
        {page === 'home' && (
          <HomePage
            categories={categories}
            chooseCategory={chooseCategory}
            contacts={contacts}
            collectionProps={{
              activeCategory: storefront.activeCategory,
              catalogError: storefront.catalogError,
              catalogLoading: storefront.catalogLoading,
              favorites: storefront.favorites,
              onCategoryChange: storefront.setActiveCategory,
              onFavoriteToggle: storefront.toggleFavorite,
              onProductOpen: openProduct,
              onSearchChange: storefront.setSearch,
              products: storefront.visibleProducts,
              search: storefront.search,
            }}
          />
        )}
        {page === 'shop' && (
          <ShopPage
            activeCategory={storefront.activeCategory}
            catalogError={storefront.catalogError}
            catalogLoading={storefront.catalogLoading}
            categories={categories}
            favorites={storefront.favorites}
            onCategoryChange={storefront.setActiveCategory}
            onFavoriteToggle={storefront.toggleFavorite}
            onProductOpen={openProduct}
            onSearchChange={storefront.setSearch}
            products={storefront.visibleProducts}
            search={storefront.search}
          />
        )}
        {page === 'about' && <AboutPage />}
        {page === 'contact' && <ContactPage contacts={contacts} />}
        {storefront.selectedProduct && (
          <ProductPage
            addToCart={storefront.addToCart}
            navigateTo={navigateTo}
            product={storefront.selectedProduct}
            productSizes={storefront.productSizes}
            selectedSize={storefront.selectedSize}
            setSelectedSize={storefront.setSelectedSize}
          />
        )}
        {page.startsWith('product/') && !storefront.selectedProduct && (
          <p className="catalog-status" role={storefront.catalogError ? 'alert' : 'status'}>
            {storefront.catalogError || (storefront.catalogLoading ? 'Loading product…' : 'This product could not be found.')}
          </p>
        )}
      </main>

      <SiteFooter contacts={contacts} />
      <CartDrawer
        cart={storefront.cart}
        cartCount={storefront.cartCount}
        cartSubtotal={storefront.cartSubtotal}
        onOrderComplete={() => {
          storefront.clearCart()
          storefront.setCartOpen(false)
        }}
        onClose={() => storefront.setCartOpen(false)}
        onExplore={() => {
          storefront.setCartOpen(false)
          chooseCategory('All pieces')
        }}
        onQuantityChange={storefront.changeQuantity}
        inventoryChecking={storefront.catalogLoading}
        unavailableCartKeys={storefront.unavailableCartKeys}
        open={storefront.cartOpen}
        paymentDetails={paymentDetails}
        whatsappNumber={contacts.whatsapp}
      />
    </>
  )
}

export default App
