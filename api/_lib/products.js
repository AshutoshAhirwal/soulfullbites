import { dbQuery, ensureOrdersTable, hasDatabase } from './db.js';

export async function getProducts(includeInactive = false) {
  if (!hasDatabase()) {
    return [];
  }

  await ensureOrdersTable();

  const query = includeInactive 
    ? 'SELECT * FROM products ORDER BY created_at ASC' 
    : 'SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at ASC';
    
  return dbQuery(query);
}

export async function upsertProduct(product) {
  if (!hasDatabase()) {
    throw new Error('DATABASE_URL is not configured');
  }

  await ensureOrdersTable();

  const { id, name, description, price, image_slug, flavor_note, ingredients, is_active } = product;
  
  await dbQuery(`
    INSERT INTO products (id, name, description, price, image_slug, flavor_note, ingredients, is_active, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    ON CONFLICT (id) DO UPDATE SET 
      name = $2, 
      description = $3, 
      price = $4, 
      image_slug = $5, 
      flavor_note = $6,
      ingredients = $7,
      is_active = $8, 
      updated_at = NOW()
  `, [id, name, description, price, image_slug, flavor_note, ingredients, is_active]);
  
  return product;
}

export async function deleteProduct(id) {
  if (!hasDatabase()) {
    throw new Error('DATABASE_URL is not configured');
  }

  await ensureOrdersTable();
  await dbQuery('DELETE FROM products WHERE id = $1', [id]);
}

export async function seedProducts() {
    const existing = await getProducts(true);
    if (existing.length > 0) return;

    const defaults = [
        { id: 'p1', name: 'Dark & Bold', description: '75% single-origin cacao. Intense, earthy, and unapologetically deep.', price: 450, image_slug: 'chocolate_bar.png', flavor_note: '75% Single-origin Cacao', ingredients: 'Cocoa beans, Organic sugar, Cocoa butter.', is_active: true },
        { id: 'p2', name: 'Milk & Velvet', description: 'Creamy, slow-roasted milk chocolate with caramelised notes and a silky finish.', price: 380, image_slug: 'flavors.png', flavor_note: 'Creamy Caramelized Notes', ingredients: 'Milk solids, Cocoa beans, Sugar.', is_active: true },
        { id: 'p3', name: 'White & Rose', description: 'Delicate white chocolate kissed with dry rose petals and a touch of sea salt.', price: 420, image_slug: 'chocolate_bar.png', flavor_note: 'Delicate & Floral', ingredients: 'Cocoa butter, Milk, Rose petals, Sea salt.', is_active: true }
    ];

    for (const p of defaults) {
        await upsertProduct(p);
    }
}
