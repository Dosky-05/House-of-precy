import { useEffect, useMemo, useState } from 'react'
import { contacts, products } from '../data/storefront.js'
import { fetchProducts } from '../data/productService.js'
import { isSupabaseConfigured } from '../lib/supabase.js'

const CART_STORAGE_KEY = 'house-of-precy-cart'

function readSavedCart() {
  try {
    const savedCart = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || '[]')
    return Array.isArray(savedCart) ? savedCart : []
  } catch {
    return []
  }
}

export default function useStorefront(page) {
  const [activeCategory, setActiveCategory] = useState('All pieces')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState(readSavedCart)
  const [catalogProducts, setCatalogProducts] = useState(() => isSupabaseConfigured ? [] : products)
  const [catalogLoading, setCatalogLoading] = useState(isSupabaseConfigured)
  const [catalogError, setCatalogError] = useState('')
  const [favorites, setFavorites] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    let active = true
    fetchProducts()
      .then((items) => {
        if (!active) return
        setCatalogProducts(items)
        setCart((savedItems) => savedItems.map((item) => {
          const currentProduct = items.find((product) => product.id === item.id)
            || items.find((product) => product.name === item.name)
          return currentProduct
            ? {
                ...item,
                ...currentProduct,
                key: `${currentProduct.id}-${item.size}`,
                size: item.size,
                quantity: item.quantity,
              }
            : item
        }))
      })
      .catch((error) => {
        if (active) setCatalogError(`Could not load products: ${error.message}`)
      })
      .finally(() => {
        if (active) setCatalogLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const selectedProduct = page.startsWith('product/')
    ? catalogProducts.find((product) => String(product.id) === page.split('/')[1])
    : null

  const visibleProducts = useMemo(() => catalogProducts.filter((product) => {
    const matchesCategory = activeCategory === 'All pieces' || product.category === activeCategory
    const matchesSearch = `${product.name} ${product.category} ${product.note}`
      .toLowerCase()
      .includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  }), [activeCategory, catalogProducts, search])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const unavailableCartKeys = catalogLoading ? [] : cart
    .filter((item) => {
      const currentProduct = catalogProducts.find((product) => product.id === item.id)
      return !currentProduct || currentProduct.inStock === false
    })
    .map((item) => item.key)

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Keep cart actions available if browser storage is disabled.
    }
  }, [cart])

  function addToCart(product, size) {
    if (!size || product.inStock === false) return
    setCart((items) => {
      const key = `${product.id}-${size}`
      const existing = items.find((item) => item.key === key)
      if (existing) {
        return items.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...items, { ...product, key, size, quantity: 1 }]
    })
    setCartOpen(true)
  }

  function changeQuantity(itemKey, amount) {
    setCart((items) =>
      items
        .map((item) =>
          item.key === itemKey ? { ...item, quantity: item.quantity + amount } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function clearCart() {
    setCart([])
  }

  function productSizes(product) {
    if (product.category === 'Clothing') return ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    if (product.category === 'Shoes') return ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
    return ['One size']
  }

  function toggleFavorite(productId) {
    setFavorites((items) =>
      items.includes(productId)
        ? items.filter((item) => item !== productId)
        : [...items, productId],
    )
  }

  function startOrder() {
    const orderText = cart
      .map((item) => `${item.quantity} x ${item.name} (size ${item.size}) - ₦${item.price.toLocaleString()}`)
      .join(', ')
    const message = encodeURIComponent(`Hi House of Precy! I'd love to order: ${orderText}. Please confirm availability.`)
    window.open(`https://wa.me/${contacts.whatsapp}?text=${message}`, '_blank', 'noopener,noreferrer')
  }

  return {
    activeCategory,
    addToCart,
    cart,
    cartCount,
    cartOpen,
    cartSubtotal,
    catalogError,
    catalogLoading,
    catalogProducts,
    clearCart,
    changeQuantity,
    favorites,
    productSizes,
    search,
    selectedProduct,
    selectedSize,
    setActiveCategory,
    setCartOpen,
    setSearch,
    setSelectedSize,
    startOrder,
    toggleFavorite,
    unavailableCartKeys,
    visibleProducts,
  }
}