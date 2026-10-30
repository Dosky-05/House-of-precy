import { useEffect, useState } from 'react'
import { ArrowLeft, ImagePlus, LogOut, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { categories } from '../data/storefront.js'
import { deleteProduct, fetchProducts, saveProduct } from '../data/productService.js'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

const emptyProduct = {
  name: '',
  category: 'Clothing',
  note: '',
  price: '',
  image: '',
  tag: '',
  inStock: true,
}

function formatCurrency(price) {
  return `₦${Number(price).toLocaleString()}`
}

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [sessionReady, setSessionReady] = useState(!isSupabaseConfigured)
  const [adminVerification, setAdminVerification] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState([])
  const [draft, setDraft] = useState(emptyProduct)
  const [editingId, setEditingId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [notice, setNotice] = useState('')
  const adminStatus = !isSupabaseConfigured
    ? 'unconfigured'
    : !sessionReady
      ? 'checking'
      : !session
        ? 'signed-out'
        : adminVerification?.userId === session.user.id
          ? adminVerification.status
          : 'checking'

  useEffect(() => {
    if (!supabase) return undefined

    let active = true
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) setErrorMessage(error.message)
      setSession(data?.session || null)
      setSessionReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!sessionReady || !session) return undefined

    let active = true
    supabase.rpc('is_product_admin').then(({ data, error }) => {
      if (!active) return
      if (error) {
        setErrorMessage(error.message)
        setAdminVerification({ userId: session.user.id, status: 'error' })
      } else {
        setAdminVerification({ userId: session.user.id, status: data ? 'authorized' : 'unauthorized' })
      }
    }).catch((error) => {
      if (!active) return
      setErrorMessage(error.message)
      setAdminVerification({ userId: session.user.id, status: 'error' })
    })

    return () => {
      active = false
    }
  }, [session, sessionReady])

  useEffect(() => {
    if (adminStatus !== 'authorized') return undefined

    let active = true
    fetchProducts()
      .then((items) => {
        if (active) setProducts(items)
      })
      .catch((error) => {
        if (active) setErrorMessage(`Could not load products: ${error.message}`)
      })

    return () => {
      active = false
    }
  }, [adminStatus, refreshKey])

  async function signIn(event) {
    event.preventDefault()
    setBusy(true)
    setErrorMessage('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setErrorMessage(error.message)
    } catch (error) {
      setErrorMessage(`Could not sign in: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    setErrorMessage('')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) setErrorMessage(error.message)
    } catch (error) {
      setErrorMessage(`Could not sign out: ${error.message}`)
    }
  }

  function editProduct(product) {
    setEditingId(product.id)
    setDraft({
      name: product.name,
      category: product.category,
      note: product.note,
      price: String(product.price),
      image: product.image,
      tag: product.tag || '',
      inStock: product.inStock,
    })
    setImageFile(null)
    setNotice('')
    setErrorMessage('')
    window.scrollTo(0, 0)
  }

  function resetForm() {
    setEditingId(null)
    setDraft(emptyProduct)
    setImageFile(null)
  }

  async function submitProduct(event) {
    event.preventDefault()
    const price = Number(draft.price)
    if (!Number.isFinite(price) || price <= 0) {
      setErrorMessage('Enter a price greater than zero.')
      return
    }
    if (!draft.image && !imageFile) {
      setErrorMessage('Choose a product photo before saving.')
      return
    }
    if (imageFile && !imageFile.type.startsWith('image/')) {
      setErrorMessage('Choose an image file for the product photo.')
      return
    }

    setBusy(true)
    setErrorMessage('')
    setNotice('')
    try {
      await saveProduct(draft, imageFile, editingId)
      resetForm()
      setRefreshKey((key) => key + 1)
      setNotice(editingId ? 'Product changes saved.' : 'Product added to the collection.')
    } catch (error) {
      setErrorMessage(`Could not save product: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  async function removeProduct(product) {
    if (!window.confirm(`Delete "${product.name}" from the collection?`)) return
    setBusy(true)
    setErrorMessage('')
    setNotice('')
    try {
      await deleteProduct(product.id)
      setRefreshKey((key) => key + 1)
      if (editingId === product.id) resetForm()
      setNotice('Product deleted.')
    } catch (error) {
      setErrorMessage(`Could not delete product: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <a className="admin-back" href="#home"><ArrowLeft size={16} /> View storefront</a>
        <p className="eyebrow">HOUSE OF PRECY</p>
        <h1>Product management</h1>
        <p>Add new pieces, update prices, and keep stock status current.</p>
      </header>

      {!isSupabaseConfigured ? (
        <section className="admin-message" role="status">
          <h2>Connect the product database</h2>
          <p>Set up the Supabase project and environment variables by following the setup steps in the storefront README. The admin will be available here after configuration.</p>
        </section>
      ) : !sessionReady || adminStatus === 'checking' ? (
        <p className="admin-message" role="status">Checking your sign-in…</p>
      ) : adminStatus === 'signed-out' ? (
        <form className="admin-login" onSubmit={signIn}>
          <h2>Owner sign-in</h2>
          <label>Email address<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button className="primary-button" type="submit" disabled={busy}>Sign in</button>
        </form>
      ) : adminStatus === 'unauthorized' ? (
        <section className="admin-message" role="alert">
          <h2>This account is not an administrator</h2>
          <p>Ask the site owner to grant this account product-management access in Supabase.</p>
          <button className="text-link" type="button" onClick={signOut}>Sign out</button>
        </section>
      ) : adminStatus === 'error' ? (
        <section className="admin-message" role="alert">
          <h2>Could not verify admin access</h2>
          <p>Check that the Supabase setup SQL has been run and try signing in again.</p>
          <button className="text-link" type="button" onClick={signOut}>Sign out</button>
        </section>
      ) : (
        <>
          <div className="admin-toolbar">
            <p>Signed in as <strong>{session.user.email}</strong></p>
            <button type="button" className="text-link" onClick={signOut}><LogOut size={15} /> Sign out</button>
          </div>

          <div className="admin-layout">
            <form className="admin-form" onSubmit={submitProduct}>
              <div className="admin-form-heading">
                <h2>{editingId ? 'Edit product' : 'Add a product'}</h2>
                {editingId && <button className="text-link" type="button" onClick={resetForm}><X size={15} /> Cancel edit</button>}
              </div>
              <label>Product name<input required maxLength={100} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
              <label>Category<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categories.filter((category) => category !== 'All pieces').map((category) => <option key={category}>{category}</option>)}</select></label>
              <label>Description<textarea required rows="3" maxLength={300} value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} /></label>
              <label>Price (NGN)<input type="number" min="1" step="1" required value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></label>
              <label>Product photo<input type="file" accept="image/*" required={!draft.image} onChange={(event) => setImageFile(event.target.files?.[0] || null)} /></label>
              {draft.image && !imageFile && <img className="admin-image-preview" src={draft.image} alt="Current product" />}
              {imageFile && <p className="admin-file-name"><ImagePlus size={15} /> {imageFile.name}</p>}
              <label>Product tag <span className="admin-optional">(optional)</span><input maxLength={32} placeholder="e.g. New arrival" value={draft.tag} onChange={(event) => setDraft({ ...draft, tag: event.target.value })} /></label>
              <label className="admin-stock-toggle"><input type="checkbox" checked={draft.inStock} onChange={(event) => setDraft({ ...draft, inStock: event.target.checked })} /><span>In stock and available to order</span></label>
              <button className="primary-button" type="submit" disabled={busy}>{editingId ? <Save size={16} /> : <Plus size={16} />}{busy ? 'Saving…' : editingId ? 'Save changes' : 'Add product'}</button>
            </form>

            <section className="admin-products">
              <h2>Products <span>({products.length})</span></h2>
              {products.length ? products.map((product) => (
                <article className="admin-product" key={product.id}>
                  <img src={product.image} alt="" />
                  <div className="admin-product-copy">
                    <h3>{product.name}</h3>
                    <p>{product.category} · {formatCurrency(product.price)}</p>
                    <span className={product.inStock ? 'admin-stock available' : 'admin-stock unavailable'}>{product.inStock ? 'In stock' : 'Out of stock'}</span>
                  </div>
                  <button type="button" className="admin-icon-button" aria-label={`Edit ${product.name}`} onClick={() => editProduct(product)}><Pencil size={16} /></button>
                  <button type="button" className="admin-icon-button" aria-label={`Delete ${product.name}`} onClick={() => removeProduct(product)} disabled={busy}><Trash2 size={16} /></button>
                </article>
              )) : <p className="admin-empty">No products yet. Add the first piece or import the starter catalog using the README steps.</p>}
            </section>
          </div>
        </>
      )}

      {errorMessage && <p className="admin-alert" role="alert">{errorMessage}</p>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}
    </main>
  )
}
