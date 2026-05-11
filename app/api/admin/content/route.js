import { NextResponse } from 'next/server';
import { batchUpdateContent } from '@/lib/content';
import { hasPermission } from '@/lib/permissions';

export async function POST(request) {
  if (!(await hasPermission('cms.edit'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const { updates } = await request.json();
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'Invalid updates payload' }, { status: 400 });
    }

    await batchUpdateContent(updates);
    return NextResponse.json({ success: true, message: 'Content updated successfully' });
  } catch (err) {
    console.error('Admin content update error:', err);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
