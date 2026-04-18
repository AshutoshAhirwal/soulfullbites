import { dbQuery, ensureOrdersTable, hasDatabase } from './db.js';

export async function getFaqs(includeInactive = false) {
  if (!hasDatabase()) return [];
  await ensureOrdersTable();

  const query = includeInactive 
    ? 'SELECT * FROM faq_items ORDER BY sort_order ASC, created_at ASC' 
    : 'SELECT * FROM faq_items WHERE is_active = TRUE ORDER BY sort_order ASC, created_at ASC';
    
  return dbQuery(query);
}

export async function upsertFaq(faq) {
  if (!hasDatabase()) throw new Error('DATABASE_URL is not configured');
  await ensureOrdersTable();

  const { id, category, question, answer, is_active, sort_order } = faq;
  
  if (id && !id.toString().startsWith('temp_')) {
    await dbQuery(`
      UPDATE faq_items SET 
        category = $2, question = $3, answer = $4, is_active = $5, sort_order = $6
      WHERE id = $1
    `, [id, category, question, answer, is_active, sort_order]);
  } else {
    await dbQuery(`
      INSERT INTO faq_items (category, question, answer, is_active, sort_order)
      VALUES ($1, $2, $3, $4, $5)
    `, [category, question, answer, is_active, sort_order]);
  }
}

export async function deleteFaq(id) {
  if (!hasDatabase()) throw new Error('DATABASE_URL is not configured');
  await ensureOrdersTable();
  await dbQuery('DELETE FROM faq_items WHERE id = $1', [id]);
}

export async function seedFaqs() {
    const existing = await getFaqs(true);
    if (existing.length > 0) return;

    const defaults = [
        { category: 'The Foundation', question: 'Do you ship internationally?', answer: 'Currently, we ship within India only. Each bar is packed with thermal protection to ensure it arrives with its soul intact, even in mountain heat.', is_active: true, sort_order: 1 },
        { category: 'The Foundation', question: 'Is your chocolate vegan?', answer: 'Our "Dark & Bold" bar is 100% vegan. Our "Milk & Velvet" and "White & Rose" contain high-quality grass-fed dairy from local mountain farms.', is_active: true, sort_order: 2 },
        { category: 'Preparation & Care', question: 'How should I store my bars?', answer: 'We recommend a cool, dry library. Between 16°C and 20°C is perfect. Avoid the fridge—extreme cold "shocks" the cocoa butter and mutes the story within.', is_active: true, sort_order: 3 },
        { category: 'Preparation & Care', question: 'Are your ingredients organic?', answer: 'Absolutely. We use certified organic cacao from ethical estates, unrefined organic sugars, and botanicals we\'d be proud to grow ourselves.', is_active: true, sort_order: 4 }
    ];

    for (const f of defaults) {
        await upsertFaq(f);
    }
}
