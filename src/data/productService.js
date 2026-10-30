import { supabase } from '../lib/supabase.js'

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the project URL and public key to .env.local.')
  }
  return supabase
}

function fromDatabaseProduct(product) {
  return {
    ...product,
    description: product.note,
    inStock: product.in_stock,
  }
}

export async function fetchProducts() {
  const client = requireSupabase()
  const { data, error } = await client
    .from('products')
    .select('id, name, category, note, price, image, tag, in_stock')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(fromDatabaseProduct)
}

export async function saveProduct(product, imageFile, productId) {
  const client = requireSupabase()
  let image = product.image

  if (imageFile) {
    const safeFileName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const imagePath = `${crypto.randomUUID()}-${safeFileName}`
    const { error: uploadError } = await client.storage
      .from('product-images')
      .upload(imagePath, imageFile, { contentType: imageFile.type })

    if (uploadError) throw uploadError
    image = client.storage.from('product-images').getPublicUrl(imagePath).data.publicUrl
  }

  const values = {
    name: product.name.trim(),
    category: product.category,
    note: product.note.trim(),
    price: Number(product.price),
    image,
    tag: product.tag.trim(),
    in_stock: product.inStock,
  }

  const query = productId
    ? client.from('products').update(values).eq('id', productId)
    : client.from('products').insert(values)
  const { data, error } = await query.select('id').single()

  if (error) throw error
  if (!data) throw new Error('The saved product could not be found.')
}

export async function deleteProduct(productId) {
  const client = requireSupabase()
  const { data, error } = await client.from('products').delete().eq('id', productId).select('id').single()
  if (error) throw error
  if (!data) throw new Error('The product could not be found.')
}
