import { NextResponse } from 'next/server';
import { getContent } from '@/lib/content';
import { getFaqs, seedFaqs } from '@/lib/faq';

/**
 * Public data endpoint — no auth required.
 * GET /api/content           - site content (CMS)
 * GET /api/content?section=faq  - FAQ list
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section === 'faq') {
      await seedFaqs(); // Ensure defaults exist if DB is empty
      const faqs = await getFaqs();
      return NextResponse.json(faqs);
    }

    const data = await getContent();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Public content error:', err);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
