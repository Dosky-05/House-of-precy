import { ArrowRight, ShoppingBag } from 'lucide-react'

function imageUrl(id, width = 1100) {
  if (id.startsWith('/') || id.startsWith('http')) return id
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
}

export default function ProductPage({
  addToCart,
  navigateTo,
  product,
  productSizes,
  selectedSize,
  setSelectedSize,
}) {
  return (
    <section className="product-detail" aria-labelledby="detail-heading">
      <button className="detail-back" onClick={() => navigateTo('shop')}><ArrowRight size={16} /> Back to shop</button>
      <div className="detail-layout">
        <img className="detail-image" src={imageUrl(product.image)} alt={product.name} />
        <div className="detail-copy">
          <p className="eyebrow">{product.category} · HOUSE OF PRECY</p>
          <h1 id="detail-heading">{product.name}</h1>
          <p className="detail-price">₦{product.price.toLocaleString()}</p>
          <p className="detail-description">{product.description}</p>
          {product.inStock === false ? (
            <p className="out-of-stock-message" role="status">This piece is currently out of stock.</p>
          ) : (
            <>
              <fieldset className="size-picker">
                <legend>Select size <span>{selectedSize && `· ${selectedSize}`}</span></legend>
                <div className="size-options">
                  {productSizes(product).map((size) => <button type="button" key={size} className={selectedSize === size ? 'size-option selected' : 'size-option'} onClick={() => setSelectedSize(size)} aria-pressed={selectedSize === size}>{size}</button>)}
                </div>
              </fieldset>
              <button className="primary-button detail-add" onClick={() => addToCart(product, selectedSize)} disabled={!selectedSize}>Add to bag <ShoppingBag size={17} /></button>
              {!selectedSize && <p className="size-hint">Choose a size to add this piece to your bag.</p>}
            </>
          )}
          <p className="detail-note">Your order will be confirmed with us on WhatsApp.</p>
        </div>
      </div>
    </section>
  )
}