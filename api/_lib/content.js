import { dbQuery, ensureOrdersTable, hasDatabase } from './db.js';

export async function seedContent() {
  const existing = await dbQuery('SELECT key FROM site_content LIMIT 1');
  if (existing.length > 0) return;

  const defaults = {
    home_h1: "Artisanal Chocolate,\nBorn from the Soul.",
    home_p: "Beyond taste. Beyond texture. A curated journey into the depths of single-origin cacao, crafted for those who seek the extraordinary.",
    home_cta: "Enter the Library",
    home_origin_h: "The Origin",
    home_origin_p: "Our journey begins in the high-altitude forests of the Western Ghats, where we source rare, wild-grown cacao beans. Each bean is hand-selected and fermented with precision to preserve its unique terroir.",
    home_story_h: "Our Story",
    home_story_p: "SoulfullBites was founded on a simple belief: that chocolate should be an immersive experience, not just a snack. We treat our cacao with the reverence of a fine wine, aging our bars for months to develop a complex, soulful profile.",
    home_story_quote: "Chocolate is the bridge between the physical and the spiritual.",
    home_craft_h: "The Craft",
    home_craft_p: "From stone-grinding for 72 hours to hand-wrapping each bar in recycled mulberry paper, our process is slow, deliberate, and deeply personal.",
    home_waitlist_h: "Join the Inner Circle",
    home_waitlist_p: "Our batches are small and infrequent. Sign up to be notified when the next collection is released.",
    shop_h1: "Cultivate Your Collection",
    shop_p: "Each bar in our inventory is a chapter in our ongoing exploration of flavor and soul.",
    site_title: "SoulfullBites",
    footer_desc: "Crafting immersive chocolate experiences from the heart of the Western Ghats.",
    insta_label: "@SoulfullBites",
    footer_copy: "© 2024 SoulfullBites Studio.",
  };

  for (const [key, value] of Object.entries(defaults)) {
    await updateContent(key, value);
  }
}

export async function getContent() {
  if (!hasDatabase()) {
    return {};
  }

  await ensureOrdersTable();

  let rows = await dbQuery('SELECT key, value FROM site_content');
  
  if (rows.length === 0) {
    await seedContent();
    rows = await dbQuery('SELECT key, value FROM site_content');
  }

  const content = {};
  rows.forEach(row => {
    content[row.key] = row.value;
  });
  return content;
}

export async function updateContent(key, value) {
  if (!hasDatabase()) {
    throw new Error('DATABASE_URL is not configured');
  }

  await ensureOrdersTable();

  await dbQuery(`
    INSERT INTO site_content (key, value, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
  `, [key, value]);
}

export async function batchUpdateContent(updates) {
  if (!hasDatabase()) {
    throw new Error('DATABASE_URL is not configured');
  }

  await ensureOrdersTable();

  for (const [key, value] of Object.entries(updates)) {
    await updateContent(key, value);
  }
}
