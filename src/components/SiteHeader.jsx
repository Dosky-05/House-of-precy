import { useState } from 'react'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'

export default function SiteHeader({ cartCount, onCartOpen, onShopClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function closeMenu() {
    setMobileMenuOpen(false)
  }

  function handleShopClick() {
    onShopClick()
    closeMenu()
  }

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="House of Precy home">
        <img className="wordmark-image" src="/hop_logo_transparent.png" alt="House of Precy" />
      </a>
      <nav className={mobileMenuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#shop" onClick={handleShopClick}>Shop</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
      </nav>
      <div className="header-actions">
        <a className="icon-button search-shortcut" href="#shop" aria-label="Search the collection" onClick={closeMenu}>
          <Search />
        </a>
        <button className="bag-button" onClick={onCartOpen} aria-label={`Open shopping bag, ${cartCount} items`}>
          <ShoppingBag />
          <span className="bag-label">Bag</span>
          <span className="bag-count">{cartCount}</span>
        </button>
        <button
          className="icon-button mobile-menu-button"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}