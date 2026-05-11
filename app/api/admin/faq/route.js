import { NextResponse } from 'next/server';
import { getFaqs, upsertFaq, deleteFaq } from '@/lib/faq';
import { hasPermission } from '@/lib/permissions';

export async function GET() {
  if (!(await hasPermission('faq.manage'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const faqs = await getFaqs(true); // true = include inactive
    return NextResponse.json(faqs);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await hasPermission('faq.manage'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const body = await request.json();
    await upsertFaq(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save FAQ' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await hasPermission('faq.manage'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });

  try {
    await deleteFaq(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
