import { dbQuery, ensureOrdersTable, hasDatabase } from './db';

export const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Dark & Bold',
    description: '75% single-origin cacao. Intense, earthy, and unapologetically deep.',
    price: 450,
    image_slug: 'chocolate_bar.png',
    images_json: '["chocolate_bar.png"]',
    flavor_note: '75% Single-origin Cacao',
    ingredients: 'Cocoa beans, Organic sugar, Cocoa butter.',
    is_active: true,
  },
  {
    id: 'p2',
    name: 'Milk & Velvet',
    description: 'Creamy, slow-roasted milk chocolate with caramelised notes and a silky finish.',
    price: 380,
    image_slug: 'flavors.png',
    images_json: '["flavors.png"]',
    flavor_note: 'Creamy Caramelized Notes',
    ingredients: 'Milk solids, Cocoa beans, Sugar.',
    is_active: true,
  },
  {
    id: 'p3',
    name: 'White & Rose',
    description: 'Delicate white chocolate kissed with dry rose petals and a touch of sea salt.',
    price: 420,
    image_slug: 'chocolate_bar.png',
    images_json: '["chocolate_bar.png"]',
    flavor_note: 'Delicate & Floral',
    ingredients: 'Cocoa butter, Milk, Rose petals, Sea salt.',
    is_active: true,
  },
];

export async function getProducts({ status = 'all', sort = 'created_at:asc' } = {}) {
  if (!hasDatabase()) {
    let products = [...DEFAULT_PRODUCTS];
    if (status === 'active') products = products.filter(p => p.is_active);
    else if (status === 'draft') products = products.filter(p => !p.is_active);
    
    if (sort === 'price:asc') products.sort((a,b) => a.price - b.price);
    else if (sort === 'price:desc') products.sort((a,b) => b.price - a.price);
    else if (sort === 'name:asc') products.sort((a,b) => a.name.localeCompare(b.name));
    else if (sort === 'name:desc') products.sort((a,b) => b.name.localeCompare(a.name));
    
    return products;
  }

  await ensureOrdersTable();

  const conditions = [];
  const values = [];

  if (status === 'active') {
    conditions.push('is_active = TRUE');
  } else if (status === 'draft') {
    conditions.push('is_active = FALSE');
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  
  let orderBy = 'created_at ASC';
  const [field, dir] = (sort || '').split(':');
  const allowed = ['name', 'price', 'created_at'];
  if (allowed.includes(field)) {
    orderBy = `${field} ${dir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
  }
    
  return dbQuery(`SELECT * FROM products ${where} ORDER BY ${orderBy}`, values);
}

export async function upsertProduct(product) {
  if (!hasDatabase()) {
    throw new Error('DATABASE_URL is not configured');
  }

  await ensureOrdersTable();

  const { id, name, description, price, image_slug, images_json, flavor_note, ingredients, is_active } = product;
  const images = images_json || JSON.stringify([image_slug || 'chocolate_bar.png']);
  
  await dbQuery(`
    INSERT INTO products (id, name, description, price, image_slug, images_json, flavor_note, ingredients, is_active, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    ON CONFLICT (id) DO UPDATE SET 
      name = $2, 
      description = $3, 
      price = $4, 
      image_slug = $5, 
      images_json = $6,
      flavor_note = $7,
      ingredients = $8,
      is_active = $9, 
      updated_at = NOW()
  `, [id, name, description, price, image_slug, images, flavor_note, ingredients, is_active]);
  
  return product;
}

export async function seedProducts() {
    if (!hasDatabase()) return;
    const existing = await getProducts();
    if (existing.length > 0) return;

    for (const p of DEFAULT_PRODUCTS) {
        await upsertProduct(p);
    }
}
