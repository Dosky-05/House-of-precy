import { ArrowRight, Heart, Search } from 'lucide-react'

function imageUrl(id, width = 720) {
  if (id.startsWith('/') || id.startsWith('http')) return id
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
}

export default function ProductCollection({
  activeCategory,
  categories,
  catalogError,
  catalogLoading,
  favorites,
  onCategoryChange,
  onFavoriteToggle,
  onProductOpen,
  onSearchChange,
  pageType = 'shop',
  products,
  search,
}) {
  return (
    <section className="shop-section" id="shop">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{pageType === 'shop' ? 'THE FULL COLLECTION' : 'THE PRECY EDIT'}</p>
          <h2>{pageType === 'shop' ? <>Find your <em>next favourite.</em></> : <>Good things, <em>picked for you.</em></>}</h2>
        </div>
        <p className="section-aside">Pieces to reach for<br />again and again.</p>
      </div>

      <div className="shop-tools">
        <div className="category-tabs" role="group" aria-label="Filter products by category">
          {categories.map((category) => (
            <button
              className={activeCategory === category ? 'category-tab active' : 'category-tab'}
              key={category}
              onClick={() => onCategoryChange(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={17} />
          <input
            type="search"
            placeholder="Find your thing"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search products"
          />
        </label>
      </div>

      {catalogError ? (
        <p className="catalog-status catalog-error" role="alert">{catalogError}</p>
      ) : catalogLoading ? (
        <p className="catalog-status" role="status">Loading the collection…</p>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map((product, index) => (
            <article className="product-card" key={product.id} style={{ '--card-index': index }}>
              <div className="product-image-wrap">
                <button className="product-photo" onClick={() => onProductOpen(product)} aria-label={`View details for ${product.name}`}>
                  <img src={imageUrl(product.image)} alt={product.name} loading="lazy" />
                </button>
                {product.tag && <span className="product-tag">{product.tag}</span>}
                {product.inStock === false && <span className="product-stock-badge">Out of stock</span>}
                <button
                  className={favorites.includes(product.id) ? 'favorite-button is-favorite' : 'favorite-button'}
                  onClick={() => onFavoriteToggle(product.id)}
                  aria-label={favorites.includes(product.id) ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
                  aria-pressed={favorites.includes(product.id)}
                >
                  <Heart size={18} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                </button>
                <button className="quick-add" onClick={() => onProductOpen(product)}>
                  <ArrowRight size={16} /> View product
                </button>
              </div>
              <div className="product-info">
                <div><p className="product-category">{product.category}</p><h3><button className="product-title" onClick={() => onProductOpen(product)}>{product.name}</button></h3></div>
                <span className="product-price">₦{product.price.toLocaleString()}</span>
              </div>
              <p className="product-note">{product.note}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-search">
          <p>{search ? `No pieces found for “${search}”.` : 'No products are available right now.'}</p>
          {search && <button onClick={() => onSearchChange('')}>Clear search</button>}
        </div>
      )}
      <div className="shop-more"><span>MORE GOOD FINDS, ALWAYS</span><span>ASK US WHAT'S NEW</span></div>
    </section>
  )
}