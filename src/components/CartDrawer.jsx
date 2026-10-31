import { useState } from 'react'
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'

function createOrderReference() {
  return `HOP-${Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(6, '0')}`
}

function formatCurrency(amount) {
  return `₦${amount.toLocaleString()}`
}

export default function CartDrawer({
  cart,
  cartCount,
  cartSubtotal,
  onClose,
  onExplore,
  onOrderComplete,
  onQuantityChange,
  inventoryChecking,
  unavailableCartKeys,
  open,
  paymentDetails,
  whatsappNumber,
}) {
  const [step, setStep] = useState('cart')
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', deliveryArea: '' })
  const [order, setOrder] = useState(null)

  if (!open) return null

  function submitCustomerDetails(event) {
    event.preventDefault()
    setOrder({
      reference: createOrderReference(),
      customer: { ...customer },
      items: cart.map((item) => ({ ...item })),
      subtotal: cartSubtotal,
    })
    setStep('payment')
  }

  function buildOrderMessage() {
    const itemLines = order.items
      .map((item) => `- ${item.quantity} x ${item.name} (size ${item.size}) - ${formatCurrency(item.price * item.quantity)}`)
      .join('\n')
    return [
      'Hi House of Precy! I have made a bank transfer for this order.',
      `Order reference: ${order.reference}`,
      `Name: ${order.customer.name}`,
      `Phone: ${order.customer.phone}`,
      `Delivery address: ${order.customer.address}`,
      `Delivery area: ${order.customer.deliveryArea}`,
      'Order:',
      itemLines,
      `Items subtotal: ${formatCurrency(order.subtotal)}`,
    ].join('\n')
  }

  function sendOrderToWhatsApp() {
    const message = buildOrderMessage()
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setStep('confirmation')
  }

  function confirmOrderSent() {
    setStep('cart')
    setCustomer({ name: '', phone: '', address: '', deliveryArea: '' })
    setOrder(null)
    onOrderComplete()
  }

  return (
    <div className="drawer-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-heading">
        <div className="drawer-header">
          <div>
            <p className="eyebrow">{step === 'cart' ? 'YOUR GOOD FINDS' : step === 'checkout' ? 'DELIVERY DETAILS' : step === 'confirmation' ? 'ORDER SENT' : 'BANK TRANSFER'}</p>
            <h2 id="cart-heading">{step === 'cart' ? <>Your bag <span>({cartCount})</span></> : step === 'checkout' ? 'Checkout' : step === 'confirmation' ? 'Thank you!' : 'Complete your order'}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close bag"><X /></button>
        </div>

        {step === 'cart' && cart.length ? (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.key}>
                  <img src={item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `${item.image}?auto=format&fit=crop&w=220&q=85`} alt="" />
                  <div className="cart-item-info"><p className="product-category">{item.category}</p><h3>{item.name}</h3><span>Size {item.size} · ₦{item.price.toLocaleString()}</span>{unavailableCartKeys.includes(item.key) && <span className="cart-unavailable">Out of stock or no longer available — remove to continue.</span>}<div className="quantity-control"><button onClick={() => onQuantityChange(item.key, -1)} aria-label={`Remove one ${item.name}, size ${item.size}`}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => onQuantityChange(item.key, 1)} aria-label={`Add one ${item.name}, size ${item.size}`}><Plus size={14} /></button><button className="remove-item" onClick={() => onQuantityChange(item.key, -item.quantity)} aria-label={`Remove ${item.name}, size ${item.size}`}><Trash2 size={15} /></button></div></div>
                </div>
              ))}
            </div>
            <div className="drawer-bottom">
              <p>Items subtotal <strong>{formatCurrency(cartSubtotal)}</strong></p>
              {unavailableCartKeys.length > 0 && <p className="cart-unavailable-note">Remove unavailable items before continuing to checkout.</p>}
              {inventoryChecking && <p className="cart-unavailable-note">Checking current product availability…</p>}
              <button className="primary-button checkout-button" onClick={() => setStep('checkout')} disabled={inventoryChecking || unavailableCartKeys.length > 0}>Continue to checkout <ArrowRight size={18} /></button>
            </div>
          </>
        ) : step === 'cart' ? (
          <div className="empty-bag"><ShoppingBag size={30} /><h3>Your bag is taking a little break.</h3><p>Find something that feels like you.</p><button className="primary-button" onClick={onExplore}>Explore the edit <ArrowRight size={18} /></button></div>
        ) : step === 'checkout' ? (
          <form className="checkout-form" onSubmit={submitCustomerDetails}>
            <label>Full name<input autoComplete="name" required value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
            <label>Phone number<input autoComplete="tel" type="tel" required value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label>
            <label>Delivery address<textarea autoComplete="street-address" required rows="2" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} /></label>
            <label>Delivery area<input autoComplete="address-level2" placeholder="City or neighbourhood" required value={customer.deliveryArea} onChange={(event) => setCustomer({ ...customer, deliveryArea: event.target.value })} /></label>
            <div className="checkout-total"><span>Items subtotal</span><strong>{formatCurrency(cartSubtotal)}</strong></div>
            <p className="checkout-note">Delivery fee will be confirmed for your area before payment.</p>
            <div className="checkout-actions">
              <button className="text-link" type="button" onClick={() => setStep('cart')}><ArrowLeft size={16} /> Back to bag</button>
              <button className="primary-button" type="submit">Continue to payment <ArrowRight size={18} /></button>
            </div>
          </form>
        ) : step === 'payment' ? (
          <div className="payment-step">
            <div className="order-reference"><span>ORDER REFERENCE</span><strong>{order.reference}</strong></div>
            <p className="payment-amount">Items subtotal <strong>{formatCurrency(order.subtotal)}</strong></p>
            <p className="checkout-note">After this payment you'll still have to discuss delivery fees with the owner, in chat.</p>
            {paymentDetails.bankName && paymentDetails.accountName && paymentDetails.accountNumber ? (
              <dl className="bank-details">
                <div><dt>Bank</dt><dd>{paymentDetails.bankName}</dd></div>
                <div><dt>Account name</dt><dd>{paymentDetails.accountName}</dd></div>
                <div><dt>Account number</dt><dd>{paymentDetails.accountNumber}</dd></div>
                <div><dt>Transfer reference</dt><dd>{order.reference}</dd></div>
              </dl>
            ) : (
              <p className="payment-warning" role="status">Bank transfer details are not configured yet. Please contact us on WhatsApp before making a payment.</p>
            )}
            <p className="payment-warning" role="note">After completing your transfer, tap “Send order and proof” to open the owner’s WhatsApp chat with your order details pre-filled. Simply attach your payment receipt and send the message to complete your order.</p>
            <div className="checkout-actions">
              <button className="text-link" type="button" onClick={() => setStep('checkout')}><ArrowLeft size={16} /> Edit details</button>
              <button className="primary-button" type="button" onClick={sendOrderToWhatsApp}>Send order and proof <ArrowRight size={18} /></button>
            </div>
          </div>
        ) : (
          <div className="payment-step order-confirmation">
            <div className="order-reference"><span>ORDER REFERENCE</span><strong>{order.reference}</strong></div>
            <p className="confirmation-message">Your order details are ready in the owner’s WhatsApp chat. Attach your payment proof and send the message; we’ll confirm your order with you there.</p>
            <p className="checkout-note">If WhatsApp did not open, go back and try again. Your bag will stay saved until you confirm that you sent the message.</p>
            <div className="checkout-actions">
              <button className="text-link" type="button" onClick={() => setStep('payment')}><ArrowLeft size={16} /> Back to payment</button>
              <button className="primary-button" type="button" onClick={confirmOrderSent}>I’ve sent it — clear my bag</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}